import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Dimensions, TouchableOpacity,
  TextInput, ScrollView, Animated, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Storage, defaultProfile } from '../utils/storage';
import { requestNotificationPermissions, setupAllNotifications } from '../services/notifications';
import { checkAndUpdateStreak } from '../utils/xp';

const { width, height } = Dimensions.get('window');

interface Props { onComplete: () => void; }

const SLIDES = [
  {
    emoji: '✝️',
    title: 'Walk With Him',
    subtitle: 'Not religion. A relationship.',
    body: 'This app exists for one reason — to help you know God. To see Him more clearly, love Him more dearly, follow Him more nearly, day by day.',
  },
  {
    emoji: '📞',
    title: 'God Is Calling',
    subtitle: 'Three times a day. Randomly.',
    body: 'A call will ring on your phone — like a real incoming call. Answer it, hear what He has to say, and respond. Decline it and lose XP. He\'ll call again.',
  },
  {
    emoji: '⚡',
    title: 'You Grow Here',
    subtitle: 'XP, levels, and real formation.',
    body: 'Every act of connection earns XP. Journal, read, play games that teach Scripture, track God\'s work in your life. Ten levels of spiritual growth — with real demotion if you drift.',
  },
  {
    emoji: '🔥',
    title: 'Not Just an App',
    subtitle: 'A companion for life with God.',
    body: 'Purpose journal. Sermons. Books of the month. Games. Prayer builder. Testimonies. Everything is designed for one goal: a deeper, more real walk with Jesus.',
  },
];

export default function OnboardingScreen({ onComplete }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [name, setName] = useState('');
  const [showNameStep, setShowNameStep] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const goToNext = () => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      if (currentSlide < SLIDES.length - 1) {
        setCurrentSlide(currentSlide + 1);
      } else {
        setShowNameStep(true);
      }
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    });
  };

  const handleStart = async () => {
    if (!name.trim()) return;

    const profile = {
      ...defaultProfile,
      name: name.trim(),
      joinedAt: new Date().toISOString(),
      streak: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
    };

    await Storage.set('profile', profile);

    const granted = await requestNotificationPermissions();
    if (granted) {
      await setupAllNotifications(profile);
    }

    onComplete();
  };

  if (showNameStep) {
    return (
      <LinearGradient colors={[COLORS.bg, COLORS.bg2, COLORS.bg3]} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.nameContainer}>
            <Text style={styles.nameEmoji}>🙏</Text>
            <Text style={styles.nameTitle}>What shall I call you?</Text>
            <Text style={styles.nameSubtitle}>
              God knows your name. He always has.{'\n'}Let\'s make this personal.
            </Text>
            <TextInput
              style={styles.nameInput}
              placeholder="Enter your name..."
              placeholderTextColor={COLORS.text3}
              value={name}
              onChangeText={setName}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleStart}
            />
            <Text style={styles.nameVerse}>
              "Fear not, for I have redeemed you; I have called you by name, you are mine."
              {'\n'}- Isaiah 43:1
            </Text>
            <TouchableOpacity
              style={[styles.startBtn, !name.trim() && styles.startBtnDisabled]}
              onPress={handleStart}
              disabled={!name.trim()}
            >
              <Text style={styles.startBtnText}>Begin Walking With Him →</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const slide = SLIDES[currentSlide];

  return (
    <LinearGradient colors={[COLORS.bg, COLORS.bg2, COLORS.bg3]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.slideContainer, { opacity: fadeAnim }]}>
          <Text style={styles.slideEmoji}>{slide.emoji}</Text>
          <Text style={styles.slideTitle}>{slide.title}</Text>
          <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>
          <Text style={styles.slideBody}>{slide.body}</Text>

          {/* Dots */}
          <View style={styles.dots}>
            {SLIDES.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === currentSlide && styles.dotActive]}
              />
            ))}
          </View>

          <TouchableOpacity style={styles.nextBtn} onPress={goToNext}>
            <LinearGradient
              colors={[COLORS.gold, COLORS.goldDark]}
              style={styles.nextBtnGrad}
            >
              <Text style={styles.nextBtnText}>
                {currentSlide === SLIDES.length - 1 ? 'Get Started' : 'Continue'}
              </Text>
              <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
            </LinearGradient>
          </TouchableOpacity>

          {currentSlide > 0 && (
            <TouchableOpacity onPress={() => setCurrentSlide(c => c - 1)}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  slideContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  slideEmoji: { fontSize: 72, marginBottom: 28 },
  slideTitle: {
    color: COLORS.text,
    fontSize: 30,
    fontFamily: 'Lora-SemiBold',
    textAlign: 'center',
    marginBottom: 8,
  },
  slideSubtitle: {
    color: COLORS.gold,
    fontSize: 15,
    fontFamily: 'DMSans-Medium',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  slideBody: {
    color: COLORS.text2,
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'center',
    fontFamily: 'DMSans-Regular',
    marginBottom: 48,
  },
  dots: { flexDirection: 'row', gap: 8, marginBottom: 40 },
  dot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  dotActive: { width: 24, backgroundColor: COLORS.gold },
  nextBtn: { width: '100%', borderRadius: RADIUS.full, overflow: 'hidden', marginBottom: 16 },
  nextBtnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  nextBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: 'DMSans-SemiBold',
  },
  backText: { color: COLORS.text3, fontSize: 14, fontFamily: 'DMSans-Regular' },
  // Name step
  nameContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28,
  },
  nameEmoji: { fontSize: 56, marginBottom: 24 },
  nameTitle: {
    color: COLORS.text,
    fontSize: 26,
    fontFamily: 'Lora-SemiBold',
    textAlign: 'center',
    marginBottom: 12,
  },
  nameSubtitle: {
    color: COLORS.text2,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'DMSans-Regular',
    marginBottom: 32,
  },
  nameInput: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: 16,
    color: COLORS.text,
    fontSize: 18,
    fontFamily: 'Lora-Regular',
    textAlign: 'center',
    marginBottom: 24,
  },
  nameVerse: {
    color: COLORS.gold,
    fontSize: 13,
    fontFamily: 'Lora-Italic',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 40,
    paddingHorizontal: 8,
  },
  startBtn: {
    width: '100%',
    backgroundColor: COLORS.gold,
    borderRadius: RADIUS.full,
    paddingVertical: 16,
    alignItems: 'center',
  },
  startBtnDisabled: { opacity: 0.4 },
  startBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: 'DMSans-SemiBold',
  },
});
