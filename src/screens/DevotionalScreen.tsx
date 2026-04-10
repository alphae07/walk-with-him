import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, Alert, Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS, useThemeColors } from '../constants/theme';
import { getDailyDevotional, GOD_ATTRIBUTES } from '../services/api';
import { Storage, UserProfile, defaultProfile } from '../utils/storage';
import { awardXP } from '../utils/xp';
import { format } from 'date-fns';

const { width } = Dimensions.get('window');

export default function DevotionalScreen() {
  const C = useThemeColors();
  const styles = getStyles(C);
  const navigation = useNavigation<any>();
  const [tab, setTab] = useState<'today' | 'attribute' | 'history'>('today');
  const [devotionalResponse, setDevotionalResponse] = useState('');
  const [completed, setCompleted] = useState(false);
  const [attrIndex, setAttrIndex] = useState(0);
  const [attrResponse, setAttrResponse] = useState('');
  const [history, setHistory] = useState<any[]>([]);

  const devotional = getDailyDevotional();
  const attribute = GOD_ATTRIBUTES[attrIndex % GOD_ATTRIBUTES.length];
  const today = new Date().toISOString().split('T')[0];

  useFocusEffect(useCallback(() => {
    Storage.get<boolean>(`devotional_done_${today}`, false).then(v => setCompleted(v || false));
    Storage.get<any[]>('devotional_history', []).then(h => setHistory(h || []));
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    setAttrIndex(dayOfYear % GOD_ATTRIBUTES.length);
  }, []));

  const completeDevotional = async () => {
    if (!devotionalResponse.trim()) {
      Alert.alert('Missing Response', 'Write at least a sentence. Engage with what you read.');
      return;
    }
    const entry = {
      date: today,
      title: devotional.title,
      response: devotionalResponse.trim(),
      completedAt: new Date().toISOString(),
    };
    const updated = [entry, ...history];
    await Storage.set('devotional_history', updated);
    await Storage.set(`devotional_done_${today}`, true);
    setHistory(updated);
    setCompleted(true);

    const p = await Storage.get<UserProfile>('profile', defaultProfile);
    if (p) {
      const result = await awardXP('journalEntry', p);
      await Storage.set('profile', result.profile);
    }
    Alert.alert('Done! +20 XP', 'He saw you show up today. Day by day. That\'s how it works. 🙏');
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: C.bg}]} edges={['top']}>
      <View style={[styles.navBar, {backgroundColor: C.bg, borderBottomColor: C.border + "60"}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={C.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Daily Devotional</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.tabs}>
        {(['today', 'attribute', 'history'] as const).map(t => (
          <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'today' ? '📖 Today' : t === 'attribute' ? '✨ Know Him' : '📚 History'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'today' && (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            {completed && (
              <View style={styles.completedBanner}>
                <Ionicons name="checkmark-circle" size={18} color={C.green} />
                <Text style={styles.completedText}>Completed today. See you tomorrow.</Text>
              </View>
            )}

            {/* Verse */}
            <LinearGradient colors={['#1A2E4A', '#0A1628']} style={styles.verseHero}>
              <Text style={styles.verseHeroLabel}>TODAY'S VERSE</Text>
              <Text style={styles.verseHeroText}>"{devotional.verse}"</Text>
              <Text style={styles.verseHeroRef}>— {devotional.verseRef}</Text>
            </LinearGradient>

            {/* Title */}
            <Text style={styles.devotionalTitle}>{devotional.title}</Text>
            <Text style={styles.devotionalDate}>{format(new Date(), 'MMMM d, yyyy')}</Text>

            {/* Body */}
            <View style={styles.devotionalBody}>
              {devotional.body.split('\n\n').map((para, i) => (
                <Text key={i} style={styles.devotionalPara}>{para}</Text>
              ))}
            </View>

            {/* Prayer */}
            <View style={styles.prayerBlock}>
              <Text style={styles.prayerLabel}>🙏 PRAYER</Text>
              <Text style={styles.prayerText}>{devotional.prayer}</Text>
            </View>

            {/* Response */}
            {!completed && (
              <>
                <Text style={styles.responseLabel}>Your response to God:</Text>
                <TextInput
                  style={styles.responseInput}
                  multiline
                  numberOfLines={5}
                  value={devotionalResponse}
                  onChangeText={setDevotionalResponse}
                  placeholder="What did this stir in you? What do you want to say to Him?"
                  placeholderTextColor={C.text3}
                  textAlignVertical="top"
                />
                <TouchableOpacity
                  style={[styles.completeBtn, !devotionalResponse.trim() && styles.completeBtnDisabled]}
                  onPress={completeDevotional}
                  disabled={!devotionalResponse.trim()}
                >
                  <Text style={styles.completeBtnText}>Mark Complete (+20 XP)</Text>
                </TouchableOpacity>
              </>
            )}

            {completed && (
              <View style={styles.completedCard}>
                <Text style={styles.completedCardText}>
                  "Day by day, in everything, He is worth it." Come back tomorrow.
                </Text>
              </View>
            )}

            <View style={{ height: 32 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      )}

      {tab === 'attribute' && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <Text style={styles.attrIntro}>
            You can't love someone you don't know. Every day, go deeper into who God actually is — not what you've assumed He is.
          </Text>

          {/* Nav between attributes */}
          <View style={styles.attrNav}>
            <TouchableOpacity
              style={[styles.attrNavBtn, attrIndex === 0 && styles.attrNavBtnDisabled]}
              onPress={() => setAttrIndex(i => Math.max(0, i - 1))}
              disabled={attrIndex === 0}
            >
              <Ionicons name="chevron-back" size={20} color={attrIndex === 0 ? C.text3 : C.gold} />
            </TouchableOpacity>
            <Text style={styles.attrNavLabel}>{attrIndex + 1} / {GOD_ATTRIBUTES.length}</Text>
            <TouchableOpacity
              style={[styles.attrNavBtn, attrIndex === GOD_ATTRIBUTES.length - 1 && styles.attrNavBtnDisabled]}
              onPress={() => setAttrIndex(i => Math.min(GOD_ATTRIBUTES.length - 1, i + 1))}
              disabled={attrIndex === GOD_ATTRIBUTES.length - 1}
            >
              <Ionicons name="chevron-forward" size={20} color={attrIndex === GOD_ATTRIBUTES.length - 1 ? C.text3 : C.gold} />
            </TouchableOpacity>
          </View>

          <LinearGradient colors={['#1A2E4A', '#0A1628']} style={styles.attrHero}>
            <Text style={styles.attrName}>{attribute.name}</Text>
            <Text style={styles.attrVerse}>"{attribute.verseText}"</Text>
            <Text style={styles.attrVerseRef}>— {attribute.verse}</Text>
          </LinearGradient>

          <Text style={styles.attrReflection}>{attribute.reflection}</Text>

          <View style={styles.attrQuestionCard}>
            <Text style={styles.attrQuestionLabel}>REFLECT</Text>
            <Text style={styles.attrQuestion}>{attribute.question}</Text>
          </View>

          <TextInput
            style={styles.attrInput}
            value={attrResponse}
            onChangeText={setAttrResponse}
            multiline
            numberOfLines={4}
            placeholder="Write your answer..."
            placeholderTextColor={C.text3}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[styles.completeBtn, !attrResponse.trim() && styles.completeBtnDisabled]}
            onPress={async () => {
              if (!attrResponse.trim()) return;
              const entry = {
                id: `attr_${Date.now()}`,
                date: new Date().toISOString(),
                type: 'attribute',
                attribute: attribute.name,
                response: attrResponse.trim(),
              };
              const existing = await Storage.get<any[]>('journal_entries', []);
              await Storage.set('journal_entries', [entry, ...(existing || [])]);
              setAttrResponse('');
              Alert.alert('Saved', `You went deeper into "${attribute.name}" today. That\'s who He is.`);
            }}
            disabled={!attrResponse.trim()}
          >
            <Text style={styles.completeBtnText}>Save Reflection</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      {tab === 'history' && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {history.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📖</Text>
              <Text style={styles.emptyTitle}>No devotionals completed yet</Text>
              <Text style={styles.emptyText}>Start today. Every day you show up is a day you know Him better.</Text>
            </View>
          ) : (
            history.map((entry, i) => (
              <View key={i} style={styles.historyCard}>
                <Text style={styles.historyDate}>{format(new Date(entry.date), 'MMMM d, yyyy')}</Text>
                <Text style={styles.historyTitle}>{entry.title}</Text>
                <Text style={styles.historyResponse} numberOfLines={3}>{entry.response}</Text>
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
  tabText: { color: C.text2, fontSize: 11, fontFamily: 'DMSans-Medium' },
  tabTextActive: { color: C.white },
  content: { padding: SPACING.lg },
  completedBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.green + '15', borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md },
  completedText: { color: C.green, fontSize: 13, fontFamily: 'DMSans-Medium' },
  verseHero: { borderRadius: RADIUS.lg, padding: SPACING.xl, marginBottom: SPACING.lg, alignItems: 'center' },
  verseHeroLabel: { color: C.gold, fontSize: 10, letterSpacing: 2, fontFamily: 'DMSans-SemiBold', marginBottom: 12 },
  verseHeroText: { color: C.white, fontSize: 18, fontFamily: 'Lora-Italic', textAlign: 'center', lineHeight: 30, marginBottom: 12 },
  verseHeroRef: { color: 'rgba(255,255,255,0.5)', fontSize: 13, fontFamily: 'DMSans-SemiBold' },
  devotionalTitle: { color: C.text, fontSize: 22, fontFamily: 'Lora-SemiBold', marginBottom: 6 },
  devotionalDate: { color: C.text3, fontSize: 12, fontFamily: 'DMSans-Regular', marginBottom: SPACING.lg },
  devotionalBody: { marginBottom: SPACING.lg },
  devotionalPara: { color: C.text2, fontSize: 15, lineHeight: 26, fontFamily: 'DMSans-Regular', marginBottom: 16 },
  prayerBlock: { backgroundColor: C.bg2, borderRadius: RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.lg, borderLeftWidth: 4, borderLeftColor: C.gold },
  prayerLabel: { color: C.gold, fontSize: 11, letterSpacing: 1.5, fontFamily: 'DMSans-SemiBold', marginBottom: 10 },
  prayerText: { color: C.text2, fontSize: 14, lineHeight: 24, fontFamily: 'Lora-Italic' },
  responseLabel: { color: C.text2, fontSize: 13, fontFamily: 'DMSans-Medium', marginBottom: 8 },
  responseInput: { backgroundColor: C.surface, borderWidth: 1.5, borderColor: C.border, borderRadius: RADIUS.md, padding: 14, color: C.text, fontSize: 15, fontFamily: 'DMSans-Regular', minHeight: 130, textAlignVertical: 'top', marginBottom: SPACING.md },
  completeBtn: { backgroundColor: C.gold, borderRadius: RADIUS.full, paddingVertical: 14, alignItems: 'center' },
  completeBtnDisabled: { opacity: 0.4 },
  completeBtnText: { color: C.white, fontSize: 15, fontFamily: 'DMSans-SemiBold' },
  completedCard: { backgroundColor: C.bg2, borderRadius: RADIUS.md, padding: SPACING.lg, alignItems: 'center' },
  completedCardText: { color: C.gold, fontSize: 14, fontFamily: 'Lora-Italic', textAlign: 'center', lineHeight: 22 },
  // Attribute tab
  attrIntro: { color: C.text2, fontSize: 14, lineHeight: 22, fontFamily: 'DMSans-Regular', marginBottom: SPACING.lg },
  attrNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.md },
  attrNavBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  attrNavBtnDisabled: { opacity: 0.3 },
  attrNavLabel: { color: C.text3, fontSize: 13, fontFamily: 'DMSans-Regular' },
  attrHero: { borderRadius: RADIUS.lg, padding: SPACING.xl, marginBottom: SPACING.lg, alignItems: 'center' },
  attrName: { color: C.gold, fontSize: 26, fontFamily: 'Lora-SemiBold', marginBottom: 16 },
  attrVerse: { color: C.white, fontSize: 15, fontFamily: 'Lora-Italic', textAlign: 'center', lineHeight: 26, marginBottom: 10 },
  attrVerseRef: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: 'DMSans-SemiBold' },
  attrReflection: { color: C.text2, fontSize: 15, lineHeight: 26, fontFamily: 'DMSans-Regular', marginBottom: SPACING.lg },
  attrQuestionCard: { backgroundColor: C.bg2, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md, borderLeftWidth: 3, borderLeftColor: C.gold },
  attrQuestionLabel: { color: C.text3, fontSize: 10, letterSpacing: 2, fontFamily: 'DMSans-SemiBold', marginBottom: 8 },
  attrQuestion: { color: C.text, fontSize: 15, fontFamily: 'Lora-Italic', lineHeight: 24 },
  attrInput: { backgroundColor: C.surface, borderWidth: 1.5, borderColor: C.border, borderRadius: RADIUS.md, padding: 14, color: C.text, fontSize: 15, fontFamily: 'DMSans-Regular', minHeight: 110, textAlignVertical: 'top', marginBottom: SPACING.md },
  // History
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { color: C.text, fontSize: 18, fontFamily: 'Lora-SemiBold', marginBottom: 8 },
  emptyText: { color: C.text3, fontSize: 14, textAlign: 'center', lineHeight: 22, fontFamily: 'DMSans-Regular' },
  historyCard: { backgroundColor: C.surface, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: C.border },
  historyDate: { color: C.text3, fontSize: 11, fontFamily: 'DMSans-Regular', marginBottom: 4 },
  historyTitle: { color: C.text, fontSize: 14, fontFamily: 'DMSans-SemiBold', marginBottom: 8 },
  historyResponse: { color: C.text2, fontSize: 13, lineHeight: 20, fontFamily: 'DMSans-Regular' },
});
