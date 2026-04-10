import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  Animated, Dimensions, ScrollView, Vibration, Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Storage, UserProfile, defaultProfile } from '../utils/storage';
import { awardXP } from '../utils/xp';
import { CALL_PROMPTS } from '../constants/data';

const { width, height } = Dimensions.get('window');
const CALL_TIMEOUT = 30;

// Built-in ringtone patterns using expo-av beeps (since we can't bundle audio assets without them)
// These play system sounds via Audio
export const RINGTONE_OPTIONS = [
  { id: 'heavenly', label: '✨ Heavenly', desc: 'Soft angelic tone' },
  { id: 'church_bell', label: '🔔 Church Bell', desc: 'Classic church chime' },
  { id: 'gentle', label: '🕊️ Gentle', desc: 'Soft and peaceful' },
  { id: 'urgent', label: '📞 Urgent Call', desc: 'Standard phone ring' },
  { id: 'custom', label: '🎵 Custom', desc: 'Your own audio file' },
];

interface Props { callData: any; onDismiss: () => void; }

export default function CallOverlayScreen({ callData, onDismiss }: Props) {
  const [phase, setPhase] = useState<'ringing' | 'in-call' | 'ended'>('ringing');
  const [secondsLeft, setSecondsLeft] = useState(CALL_TIMEOUT);
  const [callDuration, setCallDuration] = useState(0);
  const [response, setResponse] = useState('');
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const timerFill = useRef(new Animated.Value(1)).current;
  const ripple1 = useRef(new Animated.Value(0)).current;
  const ripple2 = useRef(new Animated.Value(0)).current;
  const ripple3 = useRef(new Animated.Value(0)).current;
  const pulseScale = useRef(new Animated.Value(1)).current;
  const callTimer = useRef<any>(null);
  const durationTimer = useRef<any>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const vibrationActive = useRef(false);

  const prompt = useRef(CALL_PROMPTS[Math.floor(Math.random() * CALL_PROMPTS.length)]).current;

  useEffect(() => {
    Storage.get<UserProfile>('profile', defaultProfile).then(p => { if (p) setProfile(p); });
  }, []);

  useEffect(() => {
    startRinging();
    return () => stopRinging();
  }, []);

  const startRinging = async () => {
    // Vibration pattern like a phone call
    const vibratePattern = [0, 1000, 1000, 1000, 1000, 1000];
    if (Platform.OS === 'android') {
      Vibration.vibrate(vibratePattern, true);
    } else {
      Vibration.vibrate(vibratePattern, true);
    }
    vibrationActive.current = true;

    // Try to play audio if custom ringtone
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: false,
        shouldDuckAndroid: false,
      });
      const prof = await Storage.get<UserProfile>('profile', defaultProfile);
      if (prof?.customRingtoneUri && prof.ringtone === 'custom') {
        const { sound } = await Audio.Sound.createAsync(
          { uri: prof.customRingtoneUri },
          { shouldPlay: true, isLooping: true, volume: 1.0 }
        );
        soundRef.current = sound;
      }
    } catch (e) { /* Fallback to vibration only */ }

    // Ripple
    const loop = () => {
      ripple1.setValue(0); ripple2.setValue(0); ripple3.setValue(0);
      Animated.timing(ripple1, { toValue: 1, duration: 2000, useNativeDriver: true }).start();
      setTimeout(() => Animated.timing(ripple2, { toValue: 1, duration: 2000, useNativeDriver: true }).start(), 600);
      setTimeout(() => Animated.timing(ripple3, { toValue: 1, duration: 2000, useNativeDriver: true }).start(), 1200);
    };
    loop();
    const ri = setInterval(loop, 2400);

    // Pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseScale, { toValue: 1.08, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseScale, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();

    // Countdown
    Animated.timing(timerFill, { toValue: 0, duration: CALL_TIMEOUT * 1000, useNativeDriver: false }).start();
    callTimer.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) { clearInterval(ri); handleDecline(); return 0; }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(ri);
  };

  const stopRinging = async () => {
    Vibration.cancel();
    vibrationActive.current = false;
    if (soundRef.current) {
      try { await soundRef.current.stopAsync(); await soundRef.current.unloadAsync(); }
      catch {}
      soundRef.current = null;
    }
    clearInterval(callTimer.current);
    clearInterval(durationTimer.current);
  };

  const handleAnswer = async () => {
    await stopRinging();
    setPhase('in-call');
    durationTimer.current = setInterval(() => setCallDuration(prev => prev + 1), 1000);

    const p = await Storage.get<UserProfile>('profile', defaultProfile);
    if (p) {
      const result = await awardXP('answerCall', p);
      await Storage.set('profile', { ...result.profile, callsAnswered: (result.profile.callsAnswered || 0) + 1 });
      const todayKey = new Date().toISOString().split('T')[0];
      await Storage.set(`today_call_${todayKey}`, true);
    }
  };

  const handleDecline = async () => {
    await stopRinging();
    setPhase('ended');
    const p = await Storage.get<UserProfile>('profile', defaultProfile);
    if (p) {
      const result = await awardXP('declineCall', p);
      await Storage.set('profile', { ...result.profile, callsDeclined: (result.profile.callsDeclined || 0) + 1 });
    }
    setTimeout(onDismiss, 1800);
  };

  const handleHangUp = async () => {
    clearInterval(durationTimer.current);
    if (response.trim()) {
      const entry = { id: `call_${Date.now()}`, date: new Date().toISOString(), content: response, prompt, xpEarned: 15, type: 'call' };
      const existing = await Storage.get<any[]>('journal_entries', []);
      await Storage.set('journal_entries', [entry, ...(existing || [])]);
    }
    setPhase('ended');
    setTimeout(onDismiss, 1200);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const rippleStyle = (anim: Animated.Value) => ({
    opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] }),
    transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 2.6] }) }],
  });

  if (phase === 'ended') {
    return (
      <View style={styles.overlay}>
        <LinearGradient colors={['#0A1628', '#1A2E4A']} style={styles.endedContainer}>
          <Text style={styles.endedEmoji}>🙏</Text>
          <Text style={styles.endedText}>Until next time</Text>
          <Text style={styles.endedSubtext}>He never stops calling.</Text>
        </LinearGradient>
      </View>
    );
  }

  if (phase === 'in-call') {
    return (
      <View style={styles.overlay}>
        <View style={[styles.inCallScreen, { backgroundColor: COLORS.bg }]}>
          <View style={styles.inCallHeader}>
            <View style={styles.inCallStatus}>
              <Animated.View style={[styles.inCallDot, { transform: [{ scale: pulseScale }] }]} />
              <Text style={styles.inCallStatusText}>In call with God</Text>
            </View>
            <Text style={styles.inCallTimer}>{formatTime(callDuration)}</Text>
          </View>

          <ScrollView style={styles.inCallBody} showsVerticalScrollIndicator={false}>
            <LinearGradient colors={['#0A1628', '#1A2E4A']} style={styles.promptCard}>
              <Text style={styles.promptLabel}>HE'S ASKING YOU:</Text>
              <Text style={styles.promptText}>"{prompt}"</Text>
            </LinearGradient>

            <Text style={styles.responseLabel}>Your response to Him:</Text>
            <TextInput
              style={styles.responseInput} multiline numberOfLines={6}
              placeholder="Talk to Him honestly. He can handle it."
              placeholderTextColor={COLORS.text3} value={response}
              onChangeText={setResponse} textAlignVertical="top"
            />
            <Text style={styles.inCallNote}>💡 This will be saved to your journal.</Text>
          </ScrollView>

          <TouchableOpacity style={styles.hangupBtn} onPress={handleHangUp}>
            <View style={styles.hangupBtnInner}>
              <Ionicons name="call" size={24} color={COLORS.white} style={{ transform: [{ rotate: '135deg' }] }} />
            </View>
            <Text style={styles.hangupBtnText}>End Call</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.overlay}>
      <LinearGradient colors={['#0A1628', '#1A2E4A', '#0D2137']} style={styles.ringingScreen}>
        <View style={styles.rippleContainer}>
          {[ripple1, ripple2, ripple3].map((anim, i) => (
            <Animated.View key={i} style={[styles.ripple, rippleStyle(anim)]} />
          ))}
          <Animated.View style={{ transform: [{ scale: pulseScale }] }}>
            <LinearGradient colors={[COLORS.gold, COLORS.goldDark]} style={styles.callerAvatar}>
              <Text style={styles.callerAvatarEmoji}>✝️</Text>
            </LinearGradient>
          </Animated.View>
        </View>

        <Text style={styles.callerLabel}>INCOMING CALL</Text>
        <Text style={styles.callerName}>God</Text>
        <Text style={styles.callerSub}>"I have been waiting to speak with you."</Text>

        <View style={styles.timerWrap}>
          <View style={styles.timerBar}>
            <Animated.View style={[styles.timerFill, { width: timerFill.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} />
          </View>
          <Text style={styles.timerText}>Auto-declining in {secondsLeft}s</Text>
        </View>

        <View style={styles.callActions}>
          <TouchableOpacity style={styles.callAction} onPress={handleDecline}>
            <View style={[styles.callActionBtn, styles.declineBtn]}>
              <Ionicons name="call" size={28} color={COLORS.white} style={{ transform: [{ rotate: '135deg' }] }} />
            </View>
            <Text style={styles.callActionLabel}>Decline</Text>
            <Text style={styles.callActionPenalty}>-10 XP</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.callAction} onPress={handleAnswer}>
            <Animated.View style={[styles.callActionBtn, styles.answerBtn, { transform: [{ scale: pulseScale }] }]}>
              <Ionicons name="call" size={28} color={COLORS.white} />
            </Animated.View>
            <Text style={[styles.callActionLabel, { color: COLORS.white }]}>Answer</Text>
            <Text style={styles.callActionReward}>+15 XP</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 },
  ringingScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  rippleContainer: { width: 140, height: 140, alignItems: 'center', justifyContent: 'center', marginBottom: 32 },
  ripple: { position: 'absolute', width: 140, height: 140, borderRadius: 70, borderWidth: 2, borderColor: 'rgba(200,146,42,0.45)' },
  callerAvatar: { width: 110, height: 110, borderRadius: 55, alignItems: 'center', justifyContent: 'center', shadowColor: COLORS.gold, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.7, shadowRadius: 24, elevation: 12 },
  callerAvatarEmoji: { fontSize: 46 },
  callerLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 12, letterSpacing: 3, fontFamily: 'DMSans-Medium', marginBottom: 8 },
  callerName: { color: COLORS.white, fontSize: 40, fontFamily: 'Lora-SemiBold', marginBottom: 10 },
  callerSub: { color: 'rgba(255,255,255,0.6)', fontSize: 15, fontFamily: 'Lora-Italic', textAlign: 'center', marginBottom: 40, lineHeight: 22 },
  timerWrap: { width: '100%', marginBottom: 56 },
  timerBar: { height: 3, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 2, overflow: 'hidden', marginBottom: 8 },
  timerFill: { height: '100%', backgroundColor: COLORS.gold },
  timerText: { color: 'rgba(255,255,255,0.4)', fontSize: 12, textAlign: 'center', fontFamily: 'DMSans-Regular' },
  callActions: { flexDirection: 'row', gap: 64, justifyContent: 'center' },
  callAction: { alignItems: 'center', gap: 8 },
  callActionBtn: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  declineBtn: { backgroundColor: COLORS.red },
  answerBtn: { backgroundColor: COLORS.green, shadowColor: COLORS.green, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.7, shadowRadius: 20, elevation: 12 },
  callActionLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 13, fontFamily: 'DMSans-Medium' },
  callActionPenalty: { color: COLORS.red, fontSize: 11, fontFamily: 'DMSans-Regular' },
  callActionReward: { color: COLORS.green, fontSize: 11, fontFamily: 'DMSans-Regular' },
  inCallScreen: { flex: 1, paddingTop: 56, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.lg },
  inCallHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xl },
  inCallStatus: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  inCallDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.green },
  inCallStatusText: { color: COLORS.text2, fontSize: 14, fontFamily: 'DMSans-Regular' },
  inCallTimer: { color: COLORS.text, fontSize: 24, fontFamily: 'Lora-SemiBold' },
  inCallBody: { flex: 1 },
  promptCard: { borderRadius: RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.lg },
  promptLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 10, letterSpacing: 2, fontFamily: 'DMSans-Medium', marginBottom: 10 },
  promptText: { color: COLORS.white, fontSize: 18, fontFamily: 'Lora-Italic', lineHeight: 28 },
  responseLabel: { color: COLORS.text2, fontSize: 13, fontFamily: 'DMSans-Regular', marginBottom: 10 },
  responseInput: { borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: SPACING.md, color: COLORS.text, fontSize: 15, lineHeight: 24, fontFamily: 'DMSans-Regular', backgroundColor: COLORS.surface, minHeight: 130, marginBottom: 12 },
  inCallNote: { color: COLORS.text3, fontSize: 12, fontFamily: 'DMSans-Regular', marginBottom: SPACING.lg },
  hangupBtn: { alignItems: 'center', gap: 8, paddingBottom: 16 },
  hangupBtnInner: { width: 68, height: 68, borderRadius: 34, backgroundColor: COLORS.red, alignItems: 'center', justifyContent: 'center' },
  hangupBtnText: { color: COLORS.text3, fontSize: 13, fontFamily: 'DMSans-Regular' },
  endedContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  endedEmoji: { fontSize: 60, marginBottom: 20 },
  endedText: { color: COLORS.white, fontSize: 26, fontFamily: 'Lora-SemiBold', marginBottom: 8 },
  endedSubtext: { color: 'rgba(255,255,255,0.5)', fontSize: 16, fontFamily: 'Lora-Italic' },
});
