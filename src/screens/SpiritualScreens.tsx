import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, useThemeColors } from '../constants/theme';
import { Storage, UserProfile, BibleLog, GodSighting, PurposeEntry, defaultProfile, PURPOSE_SECTIONS } from '../utils/storage';
import { awardXP } from '../utils/xp';
import { format } from 'date-fns';

// ── BIBLE LOG ──────────────────────────────────────────────
export function BibleLogScreen() {
  const C = useThemeColors();
  const styles = getStyles(C);
  const navigation = useNavigation<any>();
  const [logs, setLogs] = useState<BibleLog[]>([]);
  const [book, setBook] = useState('');
  const [chapter, setChapter] = useState('');
  const [observation, setObservation] = useState('');
  const [tab, setTab] = useState<'log' | 'history'>('log');

  useFocusEffect(useCallback(() => {
    Storage.get<BibleLog[]>('bible_logs', []).then(l => setLogs(l || []));
  }, []));

  const save = async () => {
    if (!book.trim() || !chapter.trim()) {
      Alert.alert('Missing Info', 'Please enter the book and chapter.');
      return;
    }
    const entry: BibleLog = {
      id: `bible_${Date.now()}`,
      date: new Date().toISOString(),
      book: book.trim(),
      chapter: parseInt(chapter) || 1,
      observation: observation.trim(),
    };
    const updated = [entry, ...logs];
    await Storage.set('bible_logs', updated);
    setLogs(updated);

    const p = await Storage.get<UserProfile>('profile', defaultProfile);
    if (p) {
      const result = await awardXP('bibleChapterRead', p);
      await Storage.set('profile', {
        ...result.profile,
        totalChaptersRead: (result.profile.totalChaptersRead || 0) + 1,
      });
      const todayKey = new Date().toISOString().split('T')[0];
      await Storage.set(`today_bible_${todayKey}`, true);
    }

    setBook(''); setChapter(''); setObservation('');
    setTab('history');
    Alert.alert('Logged! +10 XP', `${book} chapter ${chapter} logged.`);
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: C.bg}]} edges={['top']}>
      <NavBar title="Bible Reading Log" onBack={() => navigation.goBack()} />
      <View style={styles.tabs}>
        {(['log', 'history'] as const).map(t => (
          <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'log' ? '📖 Log Chapter' : `📚 History (${logs.length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'log' ? (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.formContent}>
            <Text style={styles.formLabel}>Book of the Bible</Text>
            <TextInput style={styles.input} value={book} onChangeText={setBook} placeholder="e.g. John, Romans, Psalms..." placeholderTextColor={C.text3} />
            <Text style={styles.formLabel}>Chapter Number</Text>
            <TextInput style={styles.input} value={chapter} onChangeText={setChapter} placeholder="e.g. 3" placeholderTextColor={C.text3} keyboardType="numeric" />
            <Text style={styles.formLabel}>What did you notice about God in this chapter?</Text>
            <TextInput
              style={[styles.input, styles.textArea]} value={observation} onChangeText={setObservation}
              placeholder="One thing you saw about God's character, ways, or heart..." placeholderTextColor={C.text3} multiline numberOfLines={4} textAlignVertical="top"
            />
            <TouchableOpacity style={styles.saveBtn} onPress={save}>
              <Text style={styles.saveBtnText}>Log Chapter (+10 XP)</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      ) : (
        <ScrollView contentContainerStyle={styles.listContent}>
          {logs.length === 0 ? (
            <EmptyState emoji="📖" title="No chapters logged yet" subtitle="Start reading. Log what you notice about God." />
          ) : (
            logs.map(log => (
              <View key={log.id} style={styles.logCard}>
                <View style={styles.logCardTop}>
                  <Text style={styles.logBook}>{log.book} {log.chapter}</Text>
                  <Text style={styles.logDate}>{format(new Date(log.date), 'MMM d')}</Text>
                </View>
                {log.observation ? (
                  <Text style={styles.logObservation}>"{log.observation}"</Text>
                ) : null}
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// ── GOD SIGHTINGS ──────────────────────────────────────────
export function GodSightingsScreen() {
  const C = useThemeColors();
  const styles = getStyles(C);
  const navigation = useNavigation<any>();
  const [sightings, setSightings] = useState<GodSighting[]>([]);
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tab, setTab] = useState<'log' | 'history'>('log');

  const CATEGORIES = ['Provision', 'Peace', 'Warning', 'Opened Door', 'Confirmation', 'Protection', 'Answered Prayer', 'Coincidence', 'Other'];

  useFocusEffect(useCallback(() => {
    Storage.get<GodSighting[]>('god_sightings', []).then(s => setSightings(s || []));
  }, []));

  const save = async () => {
    if (!content.trim()) return;
    const entry: GodSighting = {
      id: `sight_${Date.now()}`,
      date: new Date().toISOString(),
      content: content.trim(),
      category,
    };
    const updated = [entry, ...sightings];
    await Storage.set('god_sightings', updated);
    setSightings(updated);

    const p = await Storage.get<UserProfile>('profile', defaultProfile);
    if (p) {
      const result = await awardXP('godSighting', p);
      await Storage.set('profile', { ...result.profile, totalGodSightings: (result.profile.totalGodSightings || 0) + 1 });
      const todayKey = new Date().toISOString().split('T')[0];
      await Storage.set(`today_sighting_${todayKey}`, true);
    }
    setContent(''); setCategory('');
    setTab('history');
    Alert.alert('Logged! +10 XP', 'God sighting recorded. Over time you\'ll see His fingerprints everywhere.');
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: C.bg}]} edges={['top']}>
      <NavBar title="I Saw God Today" onBack={() => navigation.goBack()} />
      <View style={styles.tabs}>
        {(['log', 'history'] as const).map(t => (
          <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'log' ? '👁 Log Sighting' : `✨ History (${sightings.length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'log' ? (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.formContent}>
            <View style={styles.infoCard}>
              <Text style={styles.infoText}>Log any moment where you noticed God at work — peace you didn't expect, a provision, a door that opened, an inner warning. Over time you'll start recognising His fingerprints everywhere.</Text>
            </View>
            <Text style={styles.formLabel}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.md }}>
              {CATEGORIES.map(c => (
                <TouchableOpacity key={c} style={[styles.categoryChip, category === c && styles.categoryChipActive]} onPress={() => setCategory(c)}>
                  <Text style={[styles.categoryChipText, category === c && styles.categoryChipTextActive]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={styles.formLabel}>What happened?</Text>
            <TextInput
              style={[styles.input, styles.textArea]} value={content} onChangeText={setContent}
              placeholder="Describe the moment. Be specific..." placeholderTextColor={C.text3} multiline numberOfLines={5} textAlignVertical="top"
            />
            <TouchableOpacity style={[styles.saveBtn, !content.trim() && styles.saveBtnDisabled]} onPress={save} disabled={!content.trim()}>
              <Text style={styles.saveBtnText}>Log Sighting (+10 XP)</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      ) : (
        <ScrollView contentContainerStyle={styles.listContent}>
          {sightings.length === 0 ? (
            <EmptyState emoji="👁" title="No sightings yet" subtitle="Start looking. Once you start noticing, you can't stop." />
          ) : (
            sightings.map(s => (
              <View key={s.id} style={styles.sightingCard}>
                <View style={styles.logCardTop}>
                  {s.category ? <View style={styles.sightingCategoryBadge}><Text style={styles.sightingCategoryText}>{s.category}</Text></View> : null}
                  <Text style={styles.logDate}>{format(new Date(s.date), 'MMM d, yyyy')}</Text>
                </View>
                <Text style={styles.sightingContent}>{s.content}</Text>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// ── PURPOSE JOURNAL ────────────────────────────────────────
export function PurposeScreen() {
  const C = useThemeColors();
  const styles = getStyles(C);
  const navigation = useNavigation<any>();
  const [entries, setEntries] = useState<Record<string, string>>({});
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  useFocusEffect(useCallback(() => {
    Storage.get<Record<string, string>>('purpose_entries', {}).then(e => setEntries(e || {}));
  }, []));

  const openSection = (key: string) => {
    setDraft(entries[key] || '');
    setActiveSection(key);
  };

  const save = async () => {
    if (!activeSection) return;
    const updated = { ...entries, [activeSection]: draft };
    await Storage.set('purpose_entries', updated);
    setEntries(updated);

    const p = await Storage.get<UserProfile>('profile', defaultProfile);
    if (p) {
      const result = await awardXP('purposeEntry', p);
      await Storage.set('profile', result.profile);
    }
    setActiveSection(null);
  };

  if (activeSection) {
    const section = PURPOSE_SECTIONS.find(s => s.key === activeSection)!;
    return (
      <SafeAreaView style={[styles.container, {backgroundColor: C.bg}]} edges={['top']}>
        <NavBar title={section.label} onBack={() => setActiveSection(null)} rightAction={{ label: 'Save', onPress: save }} />
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.formContent}>
            <View style={styles.purposePromptCard}>
              <Text style={styles.purposePromptLabel}>PRAYER PROMPT</Text>
              <Text style={styles.purposePromptText}>{section.prompt}</Text>
            </View>
            <TextInput
              style={[styles.input, styles.textAreaLarge]} value={draft} onChangeText={setDraft}
              placeholder="Write what you hear, feel, or think God is saying about this area of your life..."
              placeholderTextColor={C.text3} multiline textAlignVertical="top"
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: C.bg}]} edges={['top']}>
      <NavBar title="Purpose Journal" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.listContent}>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>Six sections for the big questions. Each one has a prayer prompt to help you tune in to what God is saying — not just what you're thinking. Ask honestly. Write what you hear.</Text>
        </View>
        {PURPOSE_SECTIONS.map(section => (
          <TouchableOpacity key={section.key} style={styles.purposeSectionCard} onPress={() => openSection(section.key)}>
            <Text style={styles.purposeSectionIcon}>{section.icon}</Text>
            <View style={styles.purposeSectionInfo}>
              <Text style={styles.purposeSectionLabel}>{section.label}</Text>
              <Text style={styles.purposeSectionPreview} numberOfLines={1}>
                {entries[section.key] ? entries[section.key] : 'Not started yet...'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={C.text3} />
          </TouchableOpacity>
        ))}
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Shared Components ──────────────────────────────────────
function NavBar({ title, onBack, rightAction }: { title: string; onBack: () => void; rightAction?: { label: string; onPress: () => void } }) {
  const C = useThemeColors();
  const styles = getStyles(C);
  return (
    <View style={[styles.navBar, {backgroundColor: C.bg, borderBottomColor: C.border + "60"}]}>
      <TouchableOpacity onPress={onBack}>
        <Ionicons name="chevron-back" size={24} color={C.text} />
      </TouchableOpacity>
      <Text style={styles.navTitle}>{title}</Text>
      {rightAction ? (
        <TouchableOpacity style={styles.navRightBtn} onPress={rightAction.onPress}>
          <Text style={styles.navRightBtnText}>{rightAction.label}</Text>
        </TouchableOpacity>
      ) : <View style={{ width: 24 }} />}
    </View>
  );
}

function EmptyState({ emoji, title, subtitle }: { emoji: string; title: string; subtitle: string }) {
  const C = useThemeColors();
  const styles = getStyles(C);
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>{emoji}</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptySubtitle}>{subtitle}</Text>
    </View>
  );
}

const getStyles = (C: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  navTitle: { color: C.text, fontSize: 16, fontFamily: 'DMSans-SemiBold' },
  navRightBtn: { backgroundColor: C.gold, paddingHorizontal: 16, paddingVertical: 8, borderRadius: RADIUS.full },
  navRightBtnText: { color: C.white, fontSize: 13, fontFamily: 'DMSans-SemiBold' },
  tabs: { flexDirection: 'row', paddingHorizontal: SPACING.lg, gap: 8, marginBottom: SPACING.md },
  tab: { flex: 1, paddingVertical: 10, borderRadius: RADIUS.md, backgroundColor: C.surface, alignItems: 'center', borderWidth: 1, borderColor: C.border },
  tabActive: { backgroundColor: C.gold, borderColor: C.gold },
  tabText: { color: C.text2, fontSize: 13, fontFamily: 'DMSans-Medium' },
  tabTextActive: { color: C.white },
  formContent: { padding: SPACING.lg },
  listContent: { padding: SPACING.lg },
  formLabel: { color: C.text2, fontSize: 13, fontFamily: 'DMSans-Medium', marginBottom: 8 },
  input: { backgroundColor: C.surface, borderWidth: 1.5, borderColor: C.border, borderRadius: RADIUS.md, padding: 14, color: C.text, fontSize: 15, fontFamily: 'DMSans-Regular', marginBottom: SPACING.md },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  textAreaLarge: { minHeight: 260, textAlignVertical: 'top' },
  saveBtn: { backgroundColor: C.gold, borderRadius: RADIUS.full, paddingVertical: 14, alignItems: 'center' },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: { color: C.white, fontSize: 15, fontFamily: 'DMSans-SemiBold' },
  logCard: { backgroundColor: C.surface, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: C.border },
  logCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  logBook: { color: C.text, fontSize: 15, fontFamily: 'DMSans-SemiBold' },
  logDate: { color: C.text3, fontSize: 12, fontFamily: 'DMSans-Regular' },
  logObservation: { color: C.text2, fontSize: 13, fontFamily: 'Lora-Italic', lineHeight: 20 },
  infoCard: { backgroundColor: C.bg2, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.lg, borderLeftWidth: 3, borderLeftColor: C.gold },
  infoText: { color: C.text2, fontSize: 13, lineHeight: 20, fontFamily: 'DMSans-Regular' },
  categoryChip: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: RADIUS.full, paddingHorizontal: 14, paddingVertical: 8, marginRight: 8 },
  categoryChipActive: { backgroundColor: C.gold, borderColor: C.gold },
  categoryChipText: { color: C.text2, fontSize: 12, fontFamily: 'DMSans-Medium' },
  categoryChipTextActive: { color: C.white },
  sightingCard: { backgroundColor: C.surface, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: C.border },
  sightingCategoryBadge: { backgroundColor: C.gold + '20', paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full },
  sightingCategoryText: { color: C.gold, fontSize: 11, fontFamily: 'DMSans-SemiBold' },
  sightingContent: { color: C.text2, fontSize: 14, lineHeight: 22, fontFamily: 'DMSans-Regular', marginTop: 6 },
  purposeSectionCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: C.surface, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: C.border },
  purposeSectionIcon: { fontSize: 28, width: 40, textAlign: 'center' },
  purposeSectionInfo: { flex: 1 },
  purposeSectionLabel: { color: C.text, fontSize: 15, fontFamily: 'DMSans-SemiBold', marginBottom: 3 },
  purposeSectionPreview: { color: C.text3, fontSize: 12, fontFamily: 'DMSans-Regular' },
  purposePromptCard: { backgroundColor: C.bg2, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.lg, borderLeftWidth: 3, borderLeftColor: C.gold },
  purposePromptLabel: { color: C.text3, fontSize: 10, letterSpacing: 2, fontFamily: 'DMSans-SemiBold', marginBottom: 8 },
  purposePromptText: { color: C.text2, fontSize: 14, fontFamily: 'Lora-Italic', lineHeight: 22 },
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { color: C.text, fontSize: 18, fontFamily: 'Lora-SemiBold', marginBottom: 8 },
  emptySubtitle: { color: C.text3, fontSize: 14, textAlign: 'center', lineHeight: 22, fontFamily: 'DMSans-Regular' },
});
