import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Dimensions, TouchableOpacity,
  TextInput, ScrollView, Animated, FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Storage, defaultProfile } from '../utils/storage';
import { requestNotificationPermissions, setupAllNotifications } from '../services/notifications';
import { checkAndUpdateStreak } from '../utils/xp';
import { SUPPORTED_LANGUAGES, setLanguage, LangCode } from '../utils/i18n';

const { width, height } = Dimensions.get('window');

interface Props { onComplete: () => void; }

const COUNTRIES = [
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', currency: 'NGN', region: 'africa' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', currency: 'GHS', region: 'africa' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', currency: 'KES', region: 'africa' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', currency: 'ZAR', region: 'africa' },
  { code: 'US', name: 'United States', flag: '🇺🇸', currency: 'USD', region: 'north_america' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', region: 'europe' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', currency: 'USD', region: 'north_america' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', currency: 'USD', region: 'oceania' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', currency: 'EUR', region: 'europe' },
  { code: 'FR', name: 'France', flag: '🇫🇷', currency: 'EUR', region: 'europe' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', currency: 'USD', region: 'south_america' },
  { code: 'IN', name: 'India', flag: '🇮🇳', currency: 'USD', region: 'asia' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', currency: 'USD', region: 'asia' },
  { code: 'CN', name: 'China', flag: '🇨🇳', currency: 'USD', region: 'asia' },
  { code: 'LS', name: 'Lesotho', flag: '🇱🇸', currency: 'ZAR', region: 'africa' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼', currency: 'USD', region: 'africa' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', currency: 'KES', region: 'africa' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', currency: 'USD', region: 'africa' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', currency: 'USD', region: 'africa' },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', currency: 'USD', region: 'africa' },
  { code: 'CM', name: 'Cameroon', flag: '🇨🇲', currency: 'USD', region: 'africa' },
  { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼', currency: 'USD', region: 'africa' },
  { code: 'ZM', name: 'Zambia', flag: '🇿🇲', currency: 'USD', region: 'africa' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', currency: 'USD', region: 'south_america' },
  { code: 'OTHER', name: 'Other', flag: '🌍', currency: 'USD', region: 'global' },
];

const SLIDES = [
  { emoji: '✝️', title: 'Walk With Him', subtitle: 'Not religion. A relationship.', body: 'This app exists for one reason — to help you know God. To see Him more clearly, love Him more dearly, follow Him more nearly, day by day.' },
  { emoji: '📞', title: 'God Is Calling', subtitle: 'Randomly. Throughout your day.', body: 'A call will ring on your phone — like a real incoming call. Answer it, hear what He has to say, and respond. Decline it and lose XP. He\'ll call again.' },
  { emoji: '⚡', title: 'You Grow Here', subtitle: 'XP, levels, and real formation.', body: 'Every act of connection earns XP. Journal, read, play games that teach Scripture, track God\'s work in your life. Ten levels of spiritual growth.' },
  { emoji: '🔥', title: 'Not Just an App', subtitle: 'A companion for life with God.', body: 'Purpose journal. Sermons. Books of the month. Community. Games. Everything is designed for one goal: a deeper, more real walk with Jesus.' },
];

type Step = 'slides' | 'country' | 'language' | 'name';

export default function OnboardingScreen({ onComplete }: Props) {
  const [step, setStep] = useState<Step>('slides');
  const [slideIndex, setSlideIndex] = useState(0);
  const [name, setName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<typeof COUNTRIES[0] | null>(null);
  const [selectedLang, setSelectedLang] = useState<LangCode>('en');
  const [countrySearch, setCountrySearch] = useState('');
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const fadeTransition = (callback: () => void) => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => {
      callback();
      Animated.timing(fadeAnim, { toValue: 1, duration: 180, useNativeDriver: true }).start();
    });
  };

  const goNextSlide = () => {
    fadeTransition(() => {
      if (slideIndex < SLIDES.length - 1) {
        setSlideIndex(i => i + 1);
      } else {
        setStep('country');
      }
    });
  };

  const handleStart = async () => {
    if (!name.trim()) return;
    setLanguage(selectedLang);
    const profile = {
      ...defaultProfile,
      name: name.trim(),
      joinedAt: new Date().toISOString(),
      streak: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      preferredCurrency: (selectedCountry?.currency ?? 'USD') as any,
      communityRegion: selectedCountry?.region ?? 'global',
    };
    await Storage.set('profile', profile);
    await Storage.set('app_language', selectedLang);
    await Storage.set('app_country', selectedCountry?.code ?? 'OTHER');
    const granted = await requestNotificationPermissions();
    if (granted) await setupAllNotifications(profile);
    onComplete();
  };

  const filteredCountries = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  // ── SLIDES ────────────────────────────────────────────────
  if (step === 'slides') {
    const slide = SLIDES[slideIndex];
    return (
      <LinearGradient colors={[COLORS.bg, COLORS.bg2, COLORS.bg3]} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <Animated.View style={[styles.slideContainer, { opacity: fadeAnim }]}>
            <Text style={styles.slideEmoji}>{slide.emoji}</Text>
            <Text style={styles.slideTitle}>{slide.title}</Text>
            <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>
            <Text style={styles.slideBody}>{slide.body}</Text>
            <View style={styles.dots}>
              {SLIDES.map((_, i) => (
                <View key={i} style={[styles.dot, i === slideIndex && styles.dotActive]} />
              ))}
            </View>
            <TouchableOpacity style={styles.nextBtn} onPress={goNextSlide}>
              <LinearGradient colors={[COLORS.gold, COLORS.goldDark]} style={styles.nextBtnGrad}>
                <Text style={styles.nextBtnText}>{slideIndex === SLIDES.length - 1 ? 'Get Started' : 'Continue'}</Text>
                <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
              </LinearGradient>
            </TouchableOpacity>
            {slideIndex > 0 && (
              <TouchableOpacity onPress={() => fadeTransition(() => setSlideIndex(i => i - 1))}>
                <Text style={styles.backText}>← Back</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // ── COUNTRY ───────────────────────────────────────────────
  if (step === 'country') {
    return (
      <LinearGradient colors={[COLORS.bg, COLORS.bg2]} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.stepHeader}>
            <TouchableOpacity onPress={() => setStep('slides')}>
              <Ionicons name="chevron-back" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.stepTitle}>Where are you from?</Text>
            <View style={{ width: 24 }} />
          </View>
          <Text style={styles.stepSubtitle}>We'll set your currency and connect you with nearby believers.</Text>

          <View style={styles.searchWrap}>
            <Ionicons name="search" size={16} color={COLORS.text3} />
            <TextInput
              style={styles.searchInput}
              value={countrySearch}
              onChangeText={setCountrySearch}
              placeholder="Search country..."
              placeholderTextColor={COLORS.text3}
            />
          </View>

          <FlatList
            data={filteredCountries}
            keyExtractor={item => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.countryRow, { borderColor: selectedCountry?.code === item.code ? COLORS.gold : COLORS.border, borderWidth: selectedCountry?.code === item.code ? 2 : 1 }]}
                onPress={() => setSelectedCountry(item)}>
                <Text style={styles.countryFlag}>{item.flag}</Text>
                <Text style={styles.countryName}>{item.name}</Text>
                {selectedCountry?.code === item.code && <Ionicons name="checkmark-circle" size={20} color={COLORS.gold} />}
              </TouchableOpacity>
            )}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: SPACING.lg, paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.stepFooter}>
            <TouchableOpacity
              style={[styles.nextBtn, { marginHorizontal: SPACING.lg, opacity: selectedCountry ? 1 : 0.4 }]}
              onPress={() => selectedCountry && setStep('language')}
              disabled={!selectedCountry}>
              <LinearGradient colors={[COLORS.gold, COLORS.goldDark]} style={styles.nextBtnGrad}>
                <Text style={styles.nextBtnText}>Continue</Text>
                <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // ── LANGUAGE ──────────────────────────────────────────────
  if (step === 'language') {
    return (
      <LinearGradient colors={[COLORS.bg, COLORS.bg2]} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.stepHeader}>
            <TouchableOpacity onPress={() => setStep('country')}>
              <Ionicons name="chevron-back" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.stepTitle}>Choose your language</Text>
            <View style={{ width: 24 }} />
          </View>
          <Text style={styles.stepSubtitle}>The app will display in your chosen language.</Text>

          <ScrollView contentContainerStyle={{ paddingHorizontal: SPACING.lg, paddingBottom: 20 }}>
            {SUPPORTED_LANGUAGES.map(lang => (
              <TouchableOpacity
                key={lang.code}
                style={[styles.langRow, { borderColor: selectedLang === lang.code ? COLORS.gold : COLORS.border, borderWidth: selectedLang === lang.code ? 2 : 1 }]}
                onPress={() => setSelectedLang(lang.code as LangCode)}>
                <Text style={styles.langFlag}>{lang.flag}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.langName}>{lang.label}</Text>
                  <Text style={styles.langNative}>{lang.nativeLabel}</Text>
                </View>
                {selectedLang === lang.code && <Ionicons name="checkmark-circle" size={20} color={COLORS.gold} />}
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.stepFooter}>
            <TouchableOpacity
              style={[styles.nextBtn, { marginHorizontal: SPACING.lg }]}
              onPress={() => setStep('name')}>
              <LinearGradient colors={[COLORS.gold, COLORS.goldDark]} style={styles.nextBtnGrad}>
                <Text style={styles.nextBtnText}>Continue</Text>
                <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // ── NAME ──────────────────────────────────────────────────
  return (
    <LinearGradient colors={[COLORS.bg, COLORS.bg2, COLORS.bg3]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.stepHeader}>
          <TouchableOpacity onPress={() => setStep('language')}>
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.nameEmoji}>🙏</Text>
          <Text style={styles.nameTitle}>What shall I call you?</Text>
          <Text style={styles.nameSubtitle}>
            God knows your name. He always has.{'\n'}Let's make this personal.
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
          {selectedCountry && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryItem}>{selectedCountry.flag} {selectedCountry.name}</Text>
              <Text style={styles.summaryDot}>·</Text>
              <Text style={styles.summaryItem}>{SUPPORTED_LANGUAGES.find(l => l.code === selectedLang)?.flag} {SUPPORTED_LANGUAGES.find(l => l.code === selectedLang)?.label}</Text>
            </View>
          )}
          <Text style={styles.nameVerse}>
            "Fear not, for I have redeemed you; I have called you by name, you are mine."
            {'\n'}- Isaiah 43:1
          </Text>
          <TouchableOpacity
            style={[styles.startBtn, !name.trim() && styles.startBtnDisabled]}
            onPress={handleStart}
            disabled={!name.trim()}>
            <Text style={styles.startBtnText}>Begin Walking With Him →</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  slideContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  slideEmoji: { fontSize: 72, marginBottom: 28 },
  slideTitle: { color: COLORS.text, fontSize: 30, fontFamily: 'Lora-SemiBold', textAlign: 'center', marginBottom: 8 },
  slideSubtitle: { color: COLORS.gold, fontSize: 15, fontFamily: 'DMSans-Medium', textAlign: 'center', marginBottom: 20, letterSpacing: 0.5 },
  slideBody: { color: COLORS.text2, fontSize: 16, lineHeight: 26, textAlign: 'center', fontFamily: 'DMSans-Regular', marginBottom: 48 },
  dots: { flexDirection: 'row', gap: 8, marginBottom: 40 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.border },
  dotActive: { width: 24, backgroundColor: COLORS.gold },
  nextBtn: { width: '100%', borderRadius: RADIUS.full, overflow: 'hidden', marginBottom: 16 },
  nextBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  nextBtnText: { color: COLORS.white, fontSize: 16, fontFamily: 'DMSans-SemiBold' },
  backText: { color: COLORS.text3, fontSize: 14, fontFamily: 'DMSans-Regular' },
  // Step pages
  stepHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  stepTitle: { color: COLORS.text, fontSize: 18, fontFamily: 'Lora-SemiBold' },
  stepSubtitle: { color: COLORS.text3, fontSize: 13, fontFamily: 'DMSans-Regular', paddingHorizontal: SPACING.lg, marginBottom: SPACING.md, lineHeight: 20 },
  stepFooter: { paddingVertical: SPACING.md },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: SPACING.lg, marginBottom: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: RADIUS.md, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: COLORS.border },
  searchInput: { flex: 1, color: COLORS.text, fontSize: 14, fontFamily: 'DMSans-Regular' },
  countryRow: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: RADIUS.md, padding: 14, marginBottom: 8, backgroundColor: COLORS.surface },
  countryFlag: { fontSize: 24 },
  countryName: { flex: 1, color: COLORS.text, fontSize: 15, fontFamily: 'DMSans-Medium' },
  langRow: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: RADIUS.md, padding: 14, marginBottom: 8, backgroundColor: COLORS.surface },
  langFlag: { fontSize: 24 },
  langName: { color: COLORS.text, fontSize: 15, fontFamily: 'DMSans-SemiBold', marginBottom: 2 },
  langNative: { color: COLORS.text3, fontSize: 12, fontFamily: 'DMSans-Regular' },
  // Name step
  nameContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  nameEmoji: { fontSize: 56, marginBottom: 24 },
  nameTitle: { color: COLORS.text, fontSize: 26, fontFamily: 'Lora-SemiBold', textAlign: 'center', marginBottom: 12 },
  nameSubtitle: { color: COLORS.text2, fontSize: 15, textAlign: 'center', lineHeight: 24, fontFamily: 'DMSans-Regular', marginBottom: 32 },
  nameInput: { width: '100%', backgroundColor: COLORS.surface, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: 16, color: COLORS.text, fontSize: 18, fontFamily: 'Lora-Regular', textAlign: 'center', marginBottom: 16 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  summaryItem: { color: COLORS.text2, fontSize: 13, fontFamily: 'DMSans-Regular' },
  summaryDot: { color: COLORS.text3 },
  nameVerse: { color: COLORS.gold, fontSize: 13, fontFamily: 'Lora-Italic', textAlign: 'center', lineHeight: 20, marginBottom: 40, paddingHorizontal: 8 },
  startBtn: { width: '100%', backgroundColor: COLORS.gold, borderRadius: RADIUS.full, paddingVertical: 16, alignItems: 'center' },
  startBtnDisabled: { opacity: 0.4 },
  startBtnText: { color: COLORS.white, fontSize: 16, fontFamily: 'DMSans-SemiBold' },
});
