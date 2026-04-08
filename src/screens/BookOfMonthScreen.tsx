import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Storage, UserProfile, defaultProfile } from '../utils/storage';
import { BOOKS_OF_MONTH } from '../constants/data';
import { awardXP } from '../utils/xp';
import { format } from 'date-fns';

export default function BookOfMonthScreen() {
  const navigation = useNavigation<any>();
  const [tab, setTab] = useState<'current' | 'archive' | 'submit'>('current');
  const [summary, setSummary] = useState('');
  const [submittedMonths, setSubmittedMonths] = useState<Record<string, any>>({});
  const currentMonth = format(new Date(), 'yyyy-MM');
  const book = BOOKS_OF_MONTH[currentMonth];

  useFocusEffect(useCallback(() => {
    Storage.get<Record<string, any>>('book_summaries', {}).then(s => setSubmittedMonths(s || {}));
  }, []));

  const submitSummary = async () => {
    if (summary.trim().length < 100) {
      Alert.alert('Too Short', 'Write at least 100 characters to show you actually read it. God knows. 😉');
      return;
    }
    const record = { summary: summary.trim(), submittedAt: new Date().toISOString(), monthKey: currentMonth };
    const updated = { ...submittedMonths, [currentMonth]: record };
    await Storage.set('book_summaries', updated);
    setSubmittedMonths(updated);

    const p = await Storage.get<UserProfile>('profile', defaultProfile);
    if (p) {
      const result = await awardXP('bookSummary', p);
      await Storage.set('profile', result.profile);
    }
    setSummary('');
    Alert.alert('Submitted! +30 XP 🎉', 'Well done. You didn\'t just read — you engaged. That\'s what changes you.');
    setTab('current');
  };

  const alreadySubmitted = !!submittedMonths[currentMonth];
  const archiveEntries = Object.entries(BOOKS_OF_MONTH)
    .filter(([k]) => k <= currentMonth)
    .sort(([a], [b]) => b.localeCompare(a));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Book of the Month</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.tabs}>
        {(['current', 'archive', 'submit'] as const).map(t => (
          <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'current' ? '📚 This Month' : t === 'archive' ? '🗄 Archive' : '✍️ Submit'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'current' && book && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <LinearGradient colors={['#1A2E4A', '#0A1628']} style={styles.bookHero}>
            <Text style={styles.monthLabel}>{format(new Date(), 'MMMM yyyy')}</Text>
            <Text style={styles.bookTitle}>{book.title}</Text>
            <Text style={styles.bookAuthor}>by {book.author}</Text>
          </LinearGradient>
          <View style={styles.bookDescCard}>
            <Text style={styles.bookDescTitle}>About This Book</Text>
            <Text style={styles.bookDescText}>{book.description}</Text>
          </View>
          <View style={styles.promptCard}>
            <Text style={styles.promptLabel}>REFLECTION PROMPT</Text>
            <Text style={styles.promptText}>{book.prompt}</Text>
          </View>
          {alreadySubmitted ? (
            <View style={styles.submittedBadge}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.green} />
              <Text style={styles.submittedText}>Summary submitted this month! +30 XP earned.</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.submitBtn} onPress={() => setTab('submit')}>
              <Text style={styles.submitBtnText}>Submit Summary for +30 XP →</Text>
            </TouchableOpacity>
          )}
          <View style={{ height: 24 }} />
        </ScrollView>
      )}

      {tab === 'archive' && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <Text style={styles.archiveIntro}>Books from 2024 to 2030. A curated spiritual library for every season of your walk with God.</Text>
          {archiveEntries.map(([key, b]) => {
            const submitted = !!submittedMonths[key];
            const [year, month] = key.split('-');
            const dateObj = new Date(parseInt(year), parseInt(month) - 1, 1);
            return (
              <View key={key} style={[styles.archiveCard, key === currentMonth && styles.archiveCardCurrent]}>
                <View style={styles.archiveCardHeader}>
                  <Text style={styles.archiveMonth}>{format(dateObj, 'MMMM yyyy')}</Text>
                  {submitted && <View style={styles.readBadge}><Text style={styles.readBadgeText}>✓ Read</Text></View>}
                  {key === currentMonth && <View style={styles.currentBadge}><Text style={styles.currentBadgeText}>Current</Text></View>}
                </View>
                <Text style={styles.archiveTitle}>{b.title}</Text>
                <Text style={styles.archiveAuthor}>by {b.author}</Text>
              </View>
            );
          })}
          <View style={{ height: 24 }} />
        </ScrollView>
      )}

      {tab === 'submit' && (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.content}>
            {alreadySubmitted ? (
              <View style={styles.alreadySubmitted}>
                <Text style={styles.alreadySubmittedEmoji}>✅</Text>
                <Text style={styles.alreadySubmittedTitle}>Already submitted this month!</Text>
                <Text style={styles.alreadySubmittedText}>You earned +30 XP. Come back next month.</Text>
              </View>
            ) : (
              <>
                <View style={styles.promptCard}>
                  <Text style={styles.promptLabel}>REFLECTION PROMPT</Text>
                  <Text style={styles.promptText}>{book?.prompt}</Text>
                </View>
                <Text style={styles.formLabel}>Your summary (min. 100 characters)</Text>
                <TextInput
                  style={[styles.textArea]}
                  value={summary}
                  onChangeText={setSummary}
                  multiline
                  numberOfLines={8}
                  placeholder="Write what you took away from the book. Answer the reflection prompt. Be honest — this is for you and God, not a book report."
                  placeholderTextColor={COLORS.text3}
                  textAlignVertical="top"
                />
                <Text style={styles.charCount}>{summary.length} / 100 min</Text>
                <TouchableOpacity
                  style={[styles.submitBtn, summary.trim().length < 100 && styles.submitBtnDisabled]}
                  onPress={submitSummary}
                  disabled={summary.trim().length < 100}
                >
                  <Text style={styles.submitBtnText}>Submit Summary (+30 XP)</Text>
                </TouchableOpacity>
              </>
            )}
            <View style={{ height: 40 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  navTitle: { color: COLORS.text, fontSize: 16, fontFamily: 'DMSans-SemiBold' },
  tabs: { flexDirection: 'row', paddingHorizontal: SPACING.lg, gap: 8, marginBottom: SPACING.md },
  tab: { flex: 1, paddingVertical: 10, borderRadius: RADIUS.md, backgroundColor: COLORS.surface, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  tabActive: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  tabText: { color: COLORS.text2, fontSize: 11, fontFamily: 'DMSans-Medium' },
  tabTextActive: { color: COLORS.white },
  content: { padding: SPACING.lg },
  bookHero: { borderRadius: RADIUS.lg, padding: SPACING.xl, marginBottom: SPACING.md, alignItems: 'center' },
  monthLabel: { color: COLORS.gold, fontSize: 12, fontFamily: 'DMSans-SemiBold', letterSpacing: 1, marginBottom: 12 },
  bookTitle: { color: COLORS.white, fontSize: 24, fontFamily: 'Lora-SemiBold', textAlign: 'center', marginBottom: 8 },
  bookAuthor: { color: 'rgba(255,255,255,0.6)', fontSize: 14, fontFamily: 'DMSans-Regular' },
  bookDescCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  bookDescTitle: { color: COLORS.text, fontSize: 15, fontFamily: 'DMSans-SemiBold', marginBottom: 8 },
  bookDescText: { color: COLORS.text2, fontSize: 14, lineHeight: 22, fontFamily: 'DMSans-Regular' },
  promptCard: { backgroundColor: COLORS.bg2, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.lg, borderLeftWidth: 3, borderLeftColor: COLORS.gold },
  promptLabel: { color: COLORS.text3, fontSize: 10, letterSpacing: 2, fontFamily: 'DMSans-SemiBold', marginBottom: 8 },
  promptText: { color: COLORS.text2, fontSize: 14, fontFamily: 'Lora-Italic', lineHeight: 22 },
  submittedBadge: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.green + '15', borderRadius: RADIUS.md, padding: SPACING.md },
  submittedText: { color: COLORS.green, fontSize: 14, fontFamily: 'DMSans-Medium', flex: 1 },
  submitBtn: { backgroundColor: COLORS.gold, borderRadius: RADIUS.full, paddingVertical: 14, alignItems: 'center' },
  submitBtnDisabled: { opacity: 0.4 },
  submitBtnText: { color: COLORS.white, fontSize: 15, fontFamily: 'DMSans-SemiBold' },
  archiveIntro: { color: COLORS.text2, fontSize: 13, fontFamily: 'DMSans-Regular', lineHeight: 20, marginBottom: SPACING.lg },
  archiveCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  archiveCardCurrent: { borderColor: COLORS.gold },
  archiveCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  archiveMonth: { color: COLORS.text3, fontSize: 12, fontFamily: 'DMSans-Regular', flex: 1 },
  readBadge: { backgroundColor: COLORS.green + '20', paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full },
  readBadgeText: { color: COLORS.green, fontSize: 10, fontFamily: 'DMSans-SemiBold' },
  currentBadge: { backgroundColor: COLORS.gold + '20', paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full },
  currentBadgeText: { color: COLORS.gold, fontSize: 10, fontFamily: 'DMSans-SemiBold' },
  archiveTitle: { color: COLORS.text, fontSize: 15, fontFamily: 'DMSans-SemiBold', marginBottom: 3 },
  archiveAuthor: { color: COLORS.text3, fontSize: 12, fontFamily: 'DMSans-Regular' },
  formLabel: { color: COLORS.text2, fontSize: 13, fontFamily: 'DMSans-Medium', marginBottom: 8 },
  textArea: { backgroundColor: COLORS.surface, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: 14, color: COLORS.text, fontSize: 15, fontFamily: 'DMSans-Regular', minHeight: 200, textAlignVertical: 'top', marginBottom: 8 },
  charCount: { color: COLORS.text3, fontSize: 12, fontFamily: 'DMSans-Regular', textAlign: 'right', marginBottom: SPACING.md },
  alreadySubmitted: { alignItems: 'center', paddingTop: 60 },
  alreadySubmittedEmoji: { fontSize: 56, marginBottom: 16 },
  alreadySubmittedTitle: { color: COLORS.text, fontSize: 18, fontFamily: 'Lora-SemiBold', marginBottom: 8 },
  alreadySubmittedText: { color: COLORS.text3, fontSize: 14, fontFamily: 'DMSans-Regular', textAlign: 'center' },
});
