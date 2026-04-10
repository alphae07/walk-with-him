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
import { Storage, UserProfile, defaultProfile } from '../utils/storage';
import { awardXP } from '../utils/xp';
import { format } from 'date-fns';

const GRATITUDE_PROMPTS = [
  "What's one small thing that happened today that you almost missed?",
  "Name something about your body that works well and that you never thank God for.",
  "Who is someone in your life that you take for granted? What do they do for you?",
  "What has God protected you from this week that you don't even know about?",
  "What ability or gift do you have that you didn't earn?",
  "What was the last moment you felt completely at peace? Thank God for that moment.",
  "What prayer did God answer this year that you've forgotten to be grateful for?",
  "Name one way your life is better than it was a year ago.",
];

export default function GratitudeScreen() {
  const C = useThemeColors();
  const styles = getStyles(C);
  const navigation = useNavigation<any>();
  const [entries, setEntries] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [prompt, setPrompt] = useState('');
  const [tab, setTab] = useState<'add' | 'history'>('add');
  const [todayCount, setTodayCount] = useState(0);

  useFocusEffect(useCallback(() => {
    const dayI = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    setPrompt(GRATITUDE_PROMPTS[dayI % GRATITUDE_PROMPTS.length]);
    Storage.get<any[]>('gratitude_entries', []).then(e => {
      const all = e || [];
      setEntries(all);
      const today = new Date().toISOString().split('T')[0];
      setTodayCount(all.filter(x => x.date.startsWith(today)).length);
    });
  }, []));

  const save = async () => {
    if (!text.trim()) return;
    const entry = {
      id: `grat_${Date.now()}`,
      date: new Date().toISOString(),
      text: text.trim(),
      prompt,
    };
    const updated = [entry, ...entries];
    await Storage.set('gratitude_entries', updated);
    setEntries(updated);
    setTodayCount(c => c + 1);
    setText('');

    if (todayCount === 0) {
      const p = await Storage.get<UserProfile>('profile', defaultProfile);
      if (p) {
        await Storage.set('profile', (await awardXP('godSighting', p)).profile);
      }
    }
  };

  const refreshPrompt = () => {
    setPrompt(GRATITUDE_PROMPTS[Math.floor(Math.random() * GRATITUDE_PROMPTS.length)]);
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: C.bg}]} edges={['top']}>
      <View style={[styles.navBar, {backgroundColor: C.bg, borderBottomColor: C.border + "60"}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={C.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Gratitude</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.tabs}>
        {(['add', 'history'] as const).map(t => (
          <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'add' ? '🌟 Add Entry' : `✨ History (${entries.length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'add' && (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            <LinearGradient colors={['#0A1628', '#1A2E4A']} style={styles.hero}>
              <Text style={styles.heroEmoji}>🙏</Text>
              <Text style={styles.heroText}>
                "Taste and see that the Lord is good; blessed is the one who takes refuge in him."
              </Text>
              <Text style={styles.heroRef}>— Psalm 34:8</Text>
            </LinearGradient>

            {todayCount > 0 && (
              <View style={styles.todayBadge}>
                <Text style={styles.todayBadgeText}>
                  {todayCount} gratitude {todayCount === 1 ? 'entry' : 'entries'} today
                </Text>
              </View>
            )}

            <View style={styles.promptCard}>
              <Text style={styles.promptLabel}>PROMPT FOR TODAY</Text>
              <Text style={styles.promptText}>{prompt}</Text>
              <TouchableOpacity style={styles.refreshBtn} onPress={refreshPrompt}>
                <Ionicons name="refresh" size={14} color={C.gold} />
                <Text style={styles.refreshText}>New prompt</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>What are you grateful for?</Text>
            <TextInput
              style={styles.input}
              value={text}
              onChangeText={setText}
              multiline
              numberOfLines={4}
              placeholder="Be specific. The more specific, the more you'll notice."
              placeholderTextColor={C.text3}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={[styles.saveBtn, !text.trim() && styles.saveBtnDisabled]}
              onPress={save}
              disabled={!text.trim()}
            >
              <Text style={styles.saveBtnText}>Save Gratitude</Text>
            </TouchableOpacity>

            <View style={styles.infoCard}>
              <Text style={styles.infoText}>
                Research shows that people who write 3 specific gratitudes per day for 21 days experience measurable increases in wellbeing and happiness. But more than research — it's biblical. Gratitude trains your eyes to see God everywhere.
              </Text>
            </View>

            <View style={{ height: 32 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      )}

      {tab === 'history' && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {entries.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🌟</Text>
              <Text style={styles.emptyTitle}>Start counting blessings</Text>
              <Text style={styles.emptySubtitle}>When you start naming them, you realise you can't stop.</Text>
            </View>
          ) : (
            entries.map(e => (
              <View key={e.id} style={styles.entryCard}>
                <Text style={styles.entryDate}>{format(new Date(e.date), 'MMM d, yyyy • h:mm a')}</Text>
                <Text style={styles.entryText}>{e.text}</Text>
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
  hero: { borderRadius: RADIUS.lg, padding: SPACING.xl, alignItems: 'center', marginBottom: SPACING.lg },
  heroEmoji: { fontSize: 40, marginBottom: 12 },
  heroText: { color: C.white, fontSize: 15, fontFamily: 'Lora-Italic', textAlign: 'center', lineHeight: 26, marginBottom: 10 },
  heroRef: { color: C.gold, fontSize: 12, fontFamily: 'DMSans-SemiBold' },
  todayBadge: { backgroundColor: C.green + '20', borderRadius: RADIUS.md, padding: SPACING.sm, alignItems: 'center', marginBottom: SPACING.md },
  todayBadgeText: { color: C.green, fontSize: 13, fontFamily: 'DMSans-SemiBold' },
  promptCard: { backgroundColor: C.bg2, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md, borderLeftWidth: 3, borderLeftColor: C.gold },
  promptLabel: { color: C.text3, fontSize: 10, letterSpacing: 2, fontFamily: 'DMSans-SemiBold', marginBottom: 8 },
  promptText: { color: C.text2, fontSize: 14, fontFamily: 'Lora-Italic', lineHeight: 22, marginBottom: 10 },
  refreshBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start' },
  refreshText: { color: C.gold, fontSize: 12, fontFamily: 'DMSans-Medium' },
  inputLabel: { color: C.text2, fontSize: 13, fontFamily: 'DMSans-Medium', marginBottom: 8 },
  input: { backgroundColor: C.surface, borderWidth: 1.5, borderColor: C.border, borderRadius: RADIUS.md, padding: 14, color: C.text, fontSize: 15, fontFamily: 'DMSans-Regular', minHeight: 120, textAlignVertical: 'top', marginBottom: SPACING.md },
  saveBtn: { backgroundColor: C.gold, borderRadius: RADIUS.full, paddingVertical: 14, alignItems: 'center', marginBottom: SPACING.md },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: { color: C.white, fontSize: 15, fontFamily: 'DMSans-SemiBold' },
  infoCard: { backgroundColor: C.surface, borderRadius: RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: C.border },
  infoText: { color: C.text3, fontSize: 12, lineHeight: 20, fontFamily: 'DMSans-Regular' },
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { color: C.text, fontSize: 18, fontFamily: 'Lora-SemiBold', marginBottom: 8 },
  emptySubtitle: { color: C.text3, fontSize: 14, textAlign: 'center', lineHeight: 22, fontFamily: 'DMSans-Regular' },
  entryCard: { backgroundColor: C.surface, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: C.border },
  entryDate: { color: C.text3, fontSize: 11, fontFamily: 'DMSans-Regular', marginBottom: 6 },
  entryText: { color: C.text2, fontSize: 14, lineHeight: 22, fontFamily: 'DMSans-Regular' },
});
