import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors, SPACING, RADIUS } from '../constants/theme';
import { Storage } from '../utils/storage';

const { width } = Dimensions.get('window');

interface PopupDef {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  body: string;
  cta: string;
  ctaSecondary?: string;
  action: 'navigate' | 'link' | 'dismiss';
  target?: string;
  frequency: 'weekly' | 'biweekly' | 'monthly';
}

const POPUPS: PopupDef[] = [
  {
    id: 'donate_popup',
    emoji: '💝',
    title: 'Walk With Him Has Been Blessing You',
    subtitle: 'And it\'s always free.',
    body: 'If God has moved through this app, consider sowing a seed. Even $3 helps keep this ministry going and reaching more people who need it.',
    cta: 'Support the Ministry',
    ctaSecondary: 'Maybe Later',
    action: 'navigate',
    target: 'Donate',
    frequency: 'biweekly',
  },
  {
    id: 'testimony_popup',
    emoji: '🌟',
    title: 'Has God Done Something?',
    subtitle: 'Your story could change someone.',
    body: 'A testimony is a weapon and a witness. If God\'s been working in your life recently — through a call you answered, a journal entry, a streak, or just His presence — share it.',
    cta: 'Share My Testimony',
    ctaSecondary: 'Not Yet',
    action: 'navigate',
    target: 'Testimony',
    frequency: 'weekly',
  },
  {
    id: 'suggestion_popup',
    emoji: '💡',
    title: 'How Can We Make This Better?',
    subtitle: 'Your idea could become a feature.',
    body: 'Every suggestion is read. What would make your walk with God even more real? New games, features, sermons, books — tell us.',
    cta: 'Send a Suggestion',
    ctaSecondary: 'All Good For Now',
    action: 'navigate',
    target: 'Suggestions',
    frequency: 'monthly',
  },
  {
    id: 'community_popup',
    emoji: '🌍',
    title: 'You Don\'t Have to Walk Alone',
    subtitle: 'Join thousands of believers.',
    body: 'Connect with prayer partners, discipline partners, and believers across the globe in the Walk With Him community. Real people. Real faith.',
    cta: 'Join the Community',
    ctaSecondary: 'Maybe Later',
    action: 'navigate',
    target: 'Community',
    frequency: 'biweekly',
  },
  {
    id: 'share_popup',
    emoji: '🔗',
    title: 'Know Someone Who Needs This?',
    subtitle: 'One share could change their life.',
    body: 'Someone in your life is drifting. Someone needs to hear God\'s voice again. This app might be exactly what they need. Would you share it with one person today?',
    cta: 'Share With a Friend',
    ctaSecondary: 'Not Today',
    action: 'link',
    target: 'share',
    frequency: 'biweekly',
  },
  {
    id: 'streak_popup',
    emoji: '🔥',
    title: 'Consistency Is a Superpower',
    subtitle: 'Don\'t let it die here.',
    body: 'Your streak is your momentum. Every day you show up is a day God honors your faithfulness. Keep going. Even 5 minutes today counts.',
    cta: 'I\'m Showing Up Today',
    action: 'dismiss',
    frequency: 'weekly',
  },
  {
    id: 'prayer_popup',
    emoji: '🙏',
    title: 'When Did You Last Pray Out Loud?',
    subtitle: 'Not just think. Actually speak.',
    body: 'There\'s something different about praying with your voice. It engages your whole being. Try the Prayer Builder today — even 3 minutes changes the atmosphere.',
    cta: 'Open Prayer Builder',
    ctaSecondary: 'Later',
    action: 'navigate',
    target: 'PrayerBuilder',
    frequency: 'weekly',
  },
];

function daysBetween(date1: Date, date2: Date) {
  return Math.floor(Math.abs(date1.getTime() - date2.getTime()) / 86400000);
}

export async function shouldShowPopup(): Promise<PopupDef | null> {
  const lastShown = await Storage.get<Record<string, string>>('popup_last_shown', {});
  const now = new Date();

  // Shuffle to not always show same one
  const shuffled = [...POPUPS].sort(() => Math.random() - 0.5);

  for (const popup of shuffled) {
    const lastDate = lastShown?.[popup.id] ? new Date(lastShown[popup.id]) : null;
    if (!lastDate) return popup;
    const days = daysBetween(now, lastDate);
    if (popup.frequency === 'weekly' && days >= 7) return popup;
    if (popup.frequency === 'biweekly' && days >= 14) return popup;
    if (popup.frequency === 'monthly' && days >= 30) return popup;
  }
  return null;
}

export async function markPopupShown(id: string) {
  const lastShown = await Storage.get<Record<string, string>>('popup_last_shown', {});
  await Storage.set('popup_last_shown', { ...lastShown, [id]: new Date().toISOString() });
}

interface WeeklyPopupProps {
  popup: PopupDef;
  onNavigate: (route: string) => void;
  onDismiss: () => void;
}

export function WeeklyPopupModal({ popup, onNavigate, onDismiss }: WeeklyPopupProps) {
  const C = useThemeColors();
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 10, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
    markPopupShown(popup.id);
  }, []);

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 300, duration: 250, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(onDismiss);
  };

  const handleCta = () => {
    if (popup.action === 'navigate' && popup.target) { dismiss(); setTimeout(() => onNavigate(popup.target!), 300); }
    else if (popup.action === 'link' && popup.target === 'share') {
      Linking.canOpenURL('https://expo.dev').then(() => {}).catch(() => {});
      dismiss();
    } else { dismiss(); }
  };

  return (
    <Animated.View style={[StyleSheet.absoluteFillObject, { zIndex: 8888, opacity: fadeAnim }]}>
      <TouchableOpacity style={styles.backdrop} onPress={dismiss} activeOpacity={1} />
      <Animated.View style={[styles.sheet, { backgroundColor: C.bg2, borderColor: C.border, transform: [{ translateY: slideAnim }] }]}>
        <LinearGradient colors={['#0A1628', '#1A2E4A']} style={styles.sheetHeader}>
          <Text style={styles.sheetEmoji}>{popup.emoji}</Text>
          <Text style={styles.sheetTitle}>{popup.title}</Text>
          <Text style={styles.sheetSubtitle}>{popup.subtitle}</Text>
        </LinearGradient>
        <View style={{ padding: SPACING.lg }}>
          <Text style={[styles.sheetBody, { color: C.text2 }]}>{popup.body}</Text>
          <TouchableOpacity style={[styles.sheetCta, { backgroundColor: C.gold }]} onPress={handleCta}>
            <Text style={styles.sheetCtaText}>{popup.cta}</Text>
          </TouchableOpacity>
          {popup.ctaSecondary && (
            <TouchableOpacity style={styles.sheetCtaSecondary} onPress={dismiss}>
              <Text style={[styles.sheetCtaSecondaryText, { color: C.text3 }]}>{popup.ctaSecondary}</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)' },
  sheet: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden', borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1 },
  sheetHeader: { padding: SPACING.xl, alignItems: 'center' },
  sheetEmoji: { fontSize: 52, marginBottom: 12 },
  sheetTitle: { color: '#FFFFFF', fontSize: 20, fontFamily: 'Lora-SemiBold', textAlign: 'center', marginBottom: 6 },
  sheetSubtitle: { color: 'rgba(255,255,255,0.6)', fontSize: 14, fontFamily: 'Lora-Italic', textAlign: 'center' },
  sheetBody: { fontSize: 14, fontFamily: 'DMSans-Regular', lineHeight: 22, textAlign: 'center', marginBottom: SPACING.xl },
  sheetCta: { borderRadius: RADIUS.full, paddingVertical: 15, alignItems: 'center', marginBottom: SPACING.sm },
  sheetCtaText: { color: '#FFFFFF', fontSize: 15, fontFamily: 'DMSans-SemiBold' },
  sheetCtaSecondary: { alignItems: 'center', paddingVertical: 10 },
  sheetCtaSecondaryText: { fontSize: 14, fontFamily: 'DMSans-Regular' },
});
