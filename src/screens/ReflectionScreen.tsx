import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, Alert, Animated, Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS, useThemeColors } from '../constants/theme';
import { DEEP_REFLECTION_QUESTIONS } from '../services/api';
import { Storage, UserProfile, defaultProfile } from '../utils/storage';
import { awardXP } from '../utils/xp';
import { format } from 'date-fns';

const { width } = Dimensions.get('window');

export default function ReflectionScreen() {
  const C = useThemeColors();
  const styles = getStyles(C);
  const navigation = useNavigation<any>();
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [savedReflections, setSavedReflections] = useState<any[]>([]);
  const [tab, setTab] = useState<'reflect' | 'history'>('reflect');
  const [showAll, setShowAll] = useState(false);

  useFocusEffect(useCallback(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    setCurrentQ(dayOfYear % DEEP_REFLECTION_QUESTIONS.length);
    Storage.get<any[]>('deep_reflections', []).then(r => setSavedReflections(r || []));
  }, []));

  const q = DEEP_REFLECTION_QUESTIONS[currentQ];

  const save = async () => {
    if (answer.trim().length < 20) {
      Alert.alert('Go Deeper', 'This question deserves more than a quick answer. Stay with it.');
      return;
    }
    const entry = {
      id: `reflect_${Date.now()}`,
      date: new Date().toISOString(),
      category: q.category,
      question: q.question,
      answer: answer.trim(),
    };
    const updated = [entry, ...savedReflections];
    await Storage.set('deep_reflections', updated);
    setSavedReflections(updated);

    const p = await Storage.get<UserProfile>('profile', defaultProfile);
    if (p) {
      const result = await awardXP('purposeEntry', p);
      await Storage.set('profile', result.profile);
    }
    setAnswer('');
    setTab('history');
    Alert.alert('Saved +10 XP', 'That\'s the kind of honesty that changes things. Well done.');
  };

  const nextQuestion = () => {
    setCurrentQ(q => (q + 1) % DEEP_REFLECTION_QUESTIONS.length);
    setAnswer('');
  };

  const displayQuestions = showAll ? DEEP_REFLECTION_QUESTIONS : DEEP_REFLECTION_QUESTIONS.slice(0, 5);

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: C.bg}]} edges={['top']}>
      <View style={[styles.navBar, {backgroundColor: C.bg, borderBottomColor: C.border + "60"}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={C.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Deep Reflection</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.tabs}>
        {(['reflect', 'history'] as const).map(t => (
          <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'reflect' ? '🔍 Reflect' : `📚 Saved (${savedReflections.length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'reflect' && (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            <LinearGradient colors={['#0A1628', '#152545']} style={styles.questionHero}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{q.category}</Text>
              </View>
              <Text style={styles.questionText}>{q.question}</Text>
              <Text style={styles.questionHint}>Stay with this. Don't rush past it.</Text>
            </LinearGradient>

            <View style={styles.questionNav}>
              <TouchableOpacity
                style={styles.skipBtn}
                onPress={nextQuestion}
              >
                <Text style={styles.skipBtnText}>Different question →</Text>
              </TouchableOpacity>
            </View>

            {/* All Questions Toggle */}
            <TouchableOpacity
              style={styles.allQuestionsToggle}
              onPress={() => setShowAll(s => !s)}
            >
              <Text style={styles.allQuestionsText}>{showAll ? 'Hide' : 'Browse all questions'}</Text>
              <Ionicons name={showAll ? 'chevron-up' : 'chevron-down'} size={14} color={C.gold} />
            </TouchableOpacity>

            {showAll && (
              <View style={styles.allQuestionsList}>
                {DEEP_REFLECTION_QUESTIONS.map((dq, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[styles.allQItem, i === currentQ && styles.allQItemActive]}
                    onPress={() => { setCurrentQ(i); setShowAll(false); setAnswer(''); }}
                  >
                    <View style={styles.allQCatBadge}>
                      <Text style={styles.allQCatText}>{dq.category}</Text>
                    </View>
                    <Text style={styles.allQText} numberOfLines={2}>{dq.question}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={styles.answerLabel}>Your honest answer:</Text>
            <TextInput
              style={styles.answerInput}
              multiline
              numberOfLines={8}
              value={answer}
              onChangeText={setAnswer}
              placeholder="Be completely honest. This is between you and God. No performance needed here."
              placeholderTextColor={C.text3}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={[styles.saveBtn, answer.trim().length < 20 && styles.saveBtnDisabled]}
              onPress={save}
              disabled={answer.trim().length < 20}
            >
              <Text style={styles.saveBtnText}>Save Reflection (+10 XP)</Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      )}

      {tab === 'history' && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {savedReflections.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyTitle}>No reflections yet</Text>
              <Text style={styles.emptyText}>
                The examined life is the changed life. Start with one honest answer.
              </Text>
            </View>
          ) : (
            savedReflections.map(r => (
              <View key={r.id} style={styles.historyCard}>
                <View style={styles.historyTop}>
                  <View style={styles.categoryCapsule}>
                    <Text style={styles.categoryCapsuleText}>{r.category}</Text>
                  </View>
                  <Text style={styles.historyDate}>{format(new Date(r.date), 'MMM d, yyyy')}</Text>
                </View>
                <Text style={styles.historyQuestion}>"{r.question}"</Text>
                <Text style={styles.historyAnswer}>{r.answer}</Text>
              </View>
            ))
          )}
          <View style={{ height: 32 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const getStyles = (C: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  navTitle: { color: C.text, fontSize: 16, fontFamily: 'DMSans-SemiBold' },
  tabs: { flexDirection: 'row', paddingHorizontal: SPACING.lg, gap: 8, marginBottom: SPACING.md },
  tab: { flex: 1, paddingVertical: 10, borderRadius: RADIUS.md, backgroundColor: C.surface, alignItems: 'center', borderWidth: 1, borderColor: C.border },
  tabActive: { backgroundColor: C.gold, borderColor: C.gold },
  tabText: { color: C.text2, fontSize: 13, fontFamily: 'DMSans-Medium' },
  tabTextActive: { color: C.white },
  content: { padding: SPACING.lg },
  questionHero: { borderRadius: RADIUS.xl, padding: SPACING.xl, marginBottom: SPACING.md },
  categoryBadge: { backgroundColor: C.gold + '25', paddingHorizontal: 12, paddingVertical: 5, borderRadius: RADIUS.full, alignSelf: 'flex-start', marginBottom: 16 },
  categoryBadgeText: { color: C.gold, fontSize: 11, fontFamily: 'DMSans-SemiBold', letterSpacing: 0.5 },
  questionText: { color: C.white, fontSize: 20, fontFamily: 'Lora-SemiBold', lineHeight: 32, marginBottom: 16 },
  questionHint: { color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'Lora-Italic' },
  questionNav: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: SPACING.md },
  skipBtn: { paddingVertical: 8, paddingHorizontal: 12 },
  skipBtnText: { color: C.gold, fontSize: 13, fontFamily: 'DMSans-Medium' },
  allQuestionsToggle: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: SPACING.sm },
  allQuestionsText: { color: C.gold, fontSize: 13, fontFamily: 'DMSans-Medium' },
  allQuestionsList: { marginBottom: SPACING.lg },
  allQItem: { backgroundColor: C.surface, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: 6, borderWidth: 1, borderColor: C.border },
  allQItemActive: { borderColor: C.gold, backgroundColor: C.gold + '10' },
  allQCatBadge: { alignSelf: 'flex-start', backgroundColor: C.bg3, paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full, marginBottom: 6 },
  allQCatText: { color: C.text3, fontSize: 10, fontFamily: 'DMSans-SemiBold' },
  allQText: { color: C.text2, fontSize: 13, lineHeight: 20, fontFamily: 'DMSans-Regular' },
  answerLabel: { color: C.text2, fontSize: 13, fontFamily: 'DMSans-Medium', marginBottom: 8 },
  answerInput: { backgroundColor: C.surface, borderWidth: 1.5, borderColor: C.border, borderRadius: RADIUS.md, padding: 14, color: C.text, fontSize: 15, fontFamily: 'DMSans-Regular', minHeight: 180, textAlignVertical: 'top', marginBottom: SPACING.md },
  saveBtn: { backgroundColor: C.gold, borderRadius: RADIUS.full, paddingVertical: 15, alignItems: 'center' },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: { color: C.white, fontSize: 15, fontFamily: 'DMSans-SemiBold' },
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { color: C.text, fontSize: 18, fontFamily: 'Lora-SemiBold', marginBottom: 8 },
  emptyText: { color: C.text3, fontSize: 14, textAlign: 'center', lineHeight: 22, fontFamily: 'DMSans-Regular' },
  historyCard: { backgroundColor: C.surface, borderRadius: RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: C.border },
  historyTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  categoryCapsule: { backgroundColor: C.gold + '20', paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full },
  categoryCapsuleText: { color: C.gold, fontSize: 10, fontFamily: 'DMSans-SemiBold' },
  historyDate: { color: C.text3, fontSize: 11, fontFamily: 'DMSans-Regular' },
  historyQuestion: { color: C.gold, fontSize: 13, fontFamily: 'Lora-Italic', lineHeight: 20, marginBottom: 10 },
  historyAnswer: { color: C.text2, fontSize: 14, lineHeight: 22, fontFamily: 'DMSans-Regular' },
});
