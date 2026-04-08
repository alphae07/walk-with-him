import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  Animated, Dimensions, ScrollView, Vibration
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Storage, UserProfile, defaultProfile } from '../utils/storage';
import { awardXP } from '../utils/xp';
import { CALL_PROMPTS } from '../constants/data';

const { width, height } = Dimensions.get('window');
const CALL_TIMEOUT = 30; // seconds before auto-decline

interface Props {
  callData: any;
  onDismiss: () => void;
}

export default function CallOverlayScreen({ callData, onDismiss }: Props) {
  const [phase, setPhase] = useState<'ringing' | 'in-call' | 'ended'>('ringing');
  const [secondsLeft, setSecondsLeft] = useState(CALL_TIMEOUT);
  const [callDuration, setCallDuration] = useState(0);
  const [response, setResponse] = useState('');
  const timerFill = useRef(new Animated.Value(1)).current;
  const ripple1 = useRef(new Animated.Value(0)).current;
  const ripple2 = useRef(new Animated.Value(0)).current;
  const ripple3 = useRef(new Animated.Value(0)).current;
  const callTimer = useRef<any>(null);
  const durationTimer = useRef<any>(null);

  const prompt = CALL_PROMPTS[Math.floor(Math.random() * CALL_PROMPTS.length)];

  useEffect(() => {
    // Vibration pattern for ringing
    Vibration.vibrate([0, 700, 500, 700, 500, 700], true);

    // Ripple animations
    const rippleLoop = () => {
      Animated.sequence([
        Animated.delay(0),
        Animated.timing(ripple1, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ]).start();
      setTimeout(() => {
        Animated.timing(ripple2, { toValue: 1, duration: 2000, useNativeDriver: true }).start();
      }, 600);
      setTimeout(() => {
        Animated.timing(ripple3, { toValue: 1, duration: 2000, useNativeDriver: true }).start();
      }, 1200);
    };
    rippleLoop();
    const rippleInterval = setInterval(() => {
      ripple1.setValue(0);
      ripple2.setValue(0);
      ripple3.setValue(0);
      rippleLoop();
    }, 2400);

    // Countdown timer
    Animated.timing(timerFill, {
      toValue: 0,
      duration: CALL_TIMEOUT * 1000,
      useNativeDriver: false,
    }).start();

    callTimer.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          handleDecline();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(rippleInterval);
      clearInterval(callTimer.current);
      clearInterval(durationTimer.current);
      Vibration.cancel();
    };
  }, []);

  const handleAnswer = () => {
    clearInterval(callTimer.current);
    Vibration.cancel();
    setPhase('in-call');

    durationTimer.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    awardXP('answerCall', defaultProfile).then(async () => {
      const profile = await Storage.get<UserProfile>('profile', defaultProfile);
      if (profile) {
        const result = await awardXP('answerCall', profile);
        await Storage.set('profile', {
          ...result.profile,
          callsAnswered: (result.profile.callsAnswered || 0) + 1,
        });
        // Mark today's call
        const todayKey = new Date().toISOString().split('T')[0];
        await Storage.set(`today_call_${todayKey}`, true);
      }
    });
  };

  const handleDecline = () => {
    clearInterval(callTimer.current);
    Vibration.cancel();
    setPhase('ended');

    Storage.get<UserProfile>('profile', defaultProfile).then(async profile => {
      if (profile) {
        const result = await awardXP('declineCall', profile);
        await Storage.set('profile', {
          ...result.profile,
          callsDeclined: (result.profile.callsDeclined || 0) + 1,
        });
      }
    });

    setTimeout(onDismiss, 1500);
  };

  const handleHangUp = async () => {
    clearInterval(durationTimer.current);

    if (response.trim()) {
      const entry = {
        id: `call_${Date.now()}`,
        date: new Date().toISOString(),
        content: response,
        prompt,
        xpEarned: 15,
        type: 'call',
      };
      const existing = await Storage.get<any[]>('journal_entries', []);
      await Storage.set('journal_entries', [entry, ...(existing || [])]);
    }

    setPhase('ended');
    setTimeout(onDismiss, 1200);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const rippleStyle = (anim: Animated.Value) => ({
    opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 0] }),
    transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 2.4] }) }],
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
              <View style={styles.inCallDot} />
              <Text style={styles.inCallStatusText}>In call with God</Text>
            </View>
            <Text style={styles.inCallTimer}>{formatTime(callDuration)}</Text>
          </View>

          <ScrollView style={styles.inCallBody} showsVerticalScrollIndicator={false}>
            <LinearGradient
              colors={['#0A1628', '#1A2E4A']}
              style={styles.promptCard}
            >
              <Text style={styles.promptLabel}>HE'S ASKING YOU:</Text>
              <Text style={styles.promptText}>"{prompt}"</Text>
            </LinearGradient>

            <Text style={styles.responseLabel}>Your response to Him:</Text>
            <TextInput
              style={styles.responseInput}
              multiline
              numberOfLines={6}
              placeholder="Talk to Him honestly. He can handle it."
              placeholderTextColor={COLORS.text3}
              value={response}
              onChangeText={setResponse}
              textAlignVertical="top"
            />

            <Text style={styles.inCallNote}>
              💡 This will be saved to your journal.
            </Text>
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

  // Ringing phase
  return (
    <View style={styles.overlay}>
      <LinearGradient
        colors={['#0A1628', '#1A2E4A', '#0D2137']}
        style={styles.ringingScreen}
      >
        {/* Ripple effect */}
        <View style={styles.rippleContainer}>
          {[ripple1, ripple2, ripple3].map((anim, i) => (
            <Animated.View
              key={i}
              style={[styles.ripple, rippleStyle(anim)]}
            />
          ))}
          <LinearGradient
            colors={[COLORS.gold, COLORS.goldDark]}
            style={styles.callerAvatar}
          >
            <Text style={styles.callerAvatarEmoji}>✝️</Text>
          </LinearGradient>
        </View>

        <Text style={styles.callerLabel}>INCOMING CALL</Text>
        <Text style={styles.callerName}>God</Text>
        <Text style={styles.callerSub}>"I have been waiting to speak with you."</Text>

        {/* Timer bar */}
        <View style={styles.timerWrap}>
          <View style={styles.timerBar}>
            <Animated.View
              style={[styles.timerFill, { width: timerFill.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]}
            />
          </View>
          <Text style={styles.timerText}>Responding in {secondsLeft}s</Text>
        </View>

        {/* Decline / Answer */}
        <View style={styles.callActions}>
          <TouchableOpacity style={styles.callAction} onPress={handleDecline}>
            <View style={[styles.callActionBtn, styles.declineBtn]}>
              <Ionicons name="call" size={28} color={COLORS.white} style={{ transform: [{ rotate: '135deg' }] }} />
            </View>
            <Text style={styles.callActionLabel}>Decline</Text>
            <Text style={styles.callActionPenalty}>-10 XP</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.callAction} onPress={handleAnswer}>
            <Animated.View style={[styles.callActionBtn, styles.answerBtn]}>
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
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 9999,
  },
  ringingScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  rippleContainer: {
    width: 130, height: 130, alignItems: 'center', justifyContent: 'center',
    marginBottom: 28,
  },
  ripple: {
    position: 'absolute',
    width: 130, height: 130,
    borderRadius: 65,
    borderWidth: 2,
    borderColor: `rgba(200,146,42,0.4)`,
  },
  callerAvatar: {
    width: 100, height: 100, borderRadius: 50,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  callerAvatarEmoji: { fontSize: 40 },
  callerLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    letterSpacing: 3,
    fontFamily: 'DMSans-Medium',
    marginBottom: 8,
  },
  callerName: {
    color: COLORS.white,
    fontSize: 36,
    fontFamily: 'Lora-SemiBold',
    marginBottom: 10,
  },
  callerSub: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 15,
    fontFamily: 'Lora-Italic',
    textAlign: 'center',
    marginBottom: 36,
    lineHeight: 22,
  },
  timerWrap: { width: '100%', marginBottom: 52 },
  timerBar: {
    height: 3, backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 2, overflow: 'hidden', marginBottom: 8,
  },
  timerFill: { height: '100%', backgroundColor: COLORS.gold },
  timerText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12, textAlign: 'center', fontFamily: 'DMSans-Regular',
  },
  callActions: { flexDirection: 'row', gap: 56, justifyContent: 'center' },
  callAction: { alignItems: 'center', gap: 8 },
  callActionBtn: {
    width: 68, height: 68, borderRadius: 34,
    alignItems: 'center', justifyContent: 'center',
  },
  declineBtn: { backgroundColor: COLORS.red },
  answerBtn: {
    backgroundColor: COLORS.green,
    shadowColor: COLORS.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 10,
  },
  callActionLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 13, fontFamily: 'DMSans-Medium' },
  callActionPenalty: { color: COLORS.red, fontSize: 11, fontFamily: 'DMSans-Regular' },
  callActionReward: { color: COLORS.green, fontSize: 11, fontFamily: 'DMSans-Regular' },
  // In-call styles
  inCallScreen: { flex: 1, paddingTop: 56, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.lg },
  inCallHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: SPACING.xl,
  },
  inCallStatus: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  inCallDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: COLORS.green,
  },
  inCallStatusText: { color: COLORS.text2, fontSize: 14, fontFamily: 'DMSans-Regular' },
  inCallTimer: { color: COLORS.text, fontSize: 22, fontFamily: 'Lora-SemiBold' },
  inCallBody: { flex: 1 },
  promptCard: { borderRadius: RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.lg },
  promptLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10, letterSpacing: 2,
    fontFamily: 'DMSans-Medium', marginBottom: 10,
  },
  promptText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: 'Lora-Italic',
    lineHeight: 28,
  },
  responseLabel: { color: COLORS.text2, fontSize: 13, fontFamily: 'DMSans-Regular', marginBottom: 10 },
  responseInput: {
    borderWidth: 1.5, borderColor: COLORS.border,
    borderRadius: RADIUS.md, padding: SPACING.md,
    color: COLORS.text, fontSize: 15, lineHeight: 24,
    fontFamily: 'DMSans-Regular',
    backgroundColor: COLORS.surface,
    minHeight: 130, marginBottom: 12,
  },
  inCallNote: { color: COLORS.text3, fontSize: 12, fontFamily: 'DMSans-Regular', marginBottom: SPACING.lg },
  hangupBtn: { alignItems: 'center', gap: 8, paddingBottom: 16 },
  hangupBtnInner: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: COLORS.red,
    alignItems: 'center', justifyContent: 'center',
  },
  hangupBtnText: { color: COLORS.text3, fontSize: 13, fontFamily: 'DMSans-Regular' },
  // Ended
  endedContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  endedEmoji: { fontSize: 56, marginBottom: 16 },
  endedText: { color: COLORS.white, fontSize: 24, fontFamily: 'Lora-SemiBold', marginBottom: 8 },
  endedSubtext: { color: 'rgba(255,255,255,0.5)', fontSize: 15, fontFamily: 'Lora-Italic' },
});
