import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Storage, UserProfile, defaultProfile } from '../utils/storage';
import { awardXP } from '../utils/xp';
import { CALL_PROMPTS } from '../constants/data';
import { format } from 'date-fns';

export default function JournalScreen() {
  const [entries, setEntries] = useState<any[]>([]);
  const [composing, setComposing] = useState(false);
  const [content, setContent] = useState('');
  const [prompt, setPrompt] = useState('');
  const [tab, setTab] = useState<'write' | 'history'>('write');

  const randomPrompt = CALL_PROMPTS[Math.floor(Math.random() * CALL_PROMPTS.length)];

  useFocusEffect(useCallback(() => {
    Storage.get<any[]>('journal_entries', []).then(e => setEntries(e || []));
    setPrompt(randomPrompt);
  }, []));

  const saveEntry = async () => {
    if (!content.trim()) return;

    const entry = {
      id: `journal_${Date.now()}`,
      date: new Date().toISOString(),
      content: content.trim(),
      prompt,
      xpEarned: 20,
      type: 'journal',
    };

    const updated = [entry, ...entries];
    await Storage.set('journal_entries', updated);
    setEntries(updated);

    const profile = await Storage.get<UserProfile>('profile', defaultProfile);
    if (profile) {
      const result = await awardXP('journalEntry', profile);
      await Storage.set('profile', {
        ...result.profile,
        totalJournalEntries: (result.profile.totalJournalEntries || 0) + 1,
      });
      const todayKey = new Date().toISOString().split('T')[0];
      await Storage.set(`today_journal_${todayKey}`, true);
    }

    setContent('');
    setPrompt(CALL_PROMPTS[Math.floor(Math.random() * CALL_PROMPTS.length)]);
    setTab('history');
    Alert.alert('Saved', '+20 XP earned. He heard every word. 🙏');
  };

  const deleteEntry = (id: string) => {
    Alert.alert('Delete Entry', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          const updated = entries.filter(e => e.id !== id);
          await Storage.set('journal_entries', updated);
          setEntries(updated);
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Journal</Text>
        <Text style={styles.headerSub}>Talk to God. No rules.</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(['write', 'history'] as const).map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'write' ? '✍️ Write' : `📚 History (${entries.length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'write' ? (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView style={styles.writeContainer} showsVerticalScrollIndicator={false}>
            {/* Prompt */}
            <View style={styles.promptCard}>
              <Text style={styles.promptLabel}>PROMPT FOR TODAY</Text>
              <Text style={styles.promptText}>"{prompt}"</Text>
              <TouchableOpacity
                style={styles.refreshPrompt}
                onPress={() => setPrompt(CALL_PROMPTS[Math.floor(Math.random() * CALL_PROMPTS.length)])}
              >
                <Ionicons name="refresh" size={14} color={COLORS.gold} />
                <Text style={styles.refreshPromptText}>New prompt</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.writeLabel}>Write anything. He's listening.</Text>
            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={10}
              placeholder="Dear God..."
              placeholderTextColor={COLORS.text3}
              value={content}
              onChangeText={setContent}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={[styles.saveBtn, !content.trim() && styles.saveBtnDisabled]}
              onPress={saveEntry}
              disabled={!content.trim()}
            >
              <Text style={styles.saveBtnText}>Save to Journal (+20 XP)</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      ) : (
        <ScrollView style={styles.historyContainer} showsVerticalScrollIndicator={false}>
          {entries.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📖</Text>
              <Text style={styles.emptyText}>No entries yet.</Text>
              <Text style={styles.emptySubtext}>Start writing. Even one honest sentence is a conversation.</Text>
            </View>
          ) : (
            entries.map(entry => (
              <View key={entry.id} style={styles.entryCard}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryDate}>
                    {format(new Date(entry.date), 'MMM d, yyyy • h:mm a')}
                  </Text>
                  <TouchableOpacity onPress={() => deleteEntry(entry.id)}>
                    <Ionicons name="trash-outline" size={16} color={COLORS.text3} />
                  </TouchableOpacity>
                </View>
                {entry.prompt && (
                  <Text style={styles.entryPromptLabel}>Prompt: "{entry.prompt}"</Text>
                )}
                <Text style={styles.entryContent}>{entry.content}</Text>
              </View>
            ))
          )}
          <View style={{ height: 24 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm, paddingBottom: SPACING.md },
  headerTitle: { color: COLORS.text, fontSize: 24, fontFamily: 'Lora-SemiBold' },
  headerSub: { color: COLORS.text3, fontSize: 13, fontFamily: 'Lora-Italic', marginTop: 2 },
  tabs: { flexDirection: 'row', paddingHorizontal: SPACING.lg, gap: 8, marginBottom: SPACING.md },
  tab: {
    flex: 1, paddingVertical: 10, borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface, alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  tabActive: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  tabText: { color: COLORS.text2, fontSize: 13, fontFamily: 'DMSans-Medium' },
  tabTextActive: { color: COLORS.white },
  writeContainer: { flex: 1, paddingHorizontal: SPACING.lg },
  promptCard: {
    backgroundColor: COLORS.bg2, borderRadius: RADIUS.lg,
    padding: SPACING.lg, marginBottom: SPACING.lg,
    borderLeftWidth: 3, borderLeftColor: COLORS.gold,
  },
  promptLabel: { color: COLORS.text3, fontSize: 10, letterSpacing: 2, fontFamily: 'DMSans-Medium', marginBottom: 8 },
  promptText: { color: COLORS.text, fontSize: 15, fontFamily: 'Lora-Italic', lineHeight: 24, marginBottom: 12 },
  refreshPrompt: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  refreshPromptText: { color: COLORS.gold, fontSize: 12, fontFamily: 'DMSans-Medium' },
  writeLabel: { color: COLORS.text2, fontSize: 13, fontFamily: 'DMSans-Regular', marginBottom: 8 },
  textArea: {
    backgroundColor: COLORS.surface, borderWidth: 1.5, borderColor: COLORS.border,
    borderRadius: RADIUS.md, padding: SPACING.md,
    color: COLORS.text, fontSize: 15, lineHeight: 24,
    fontFamily: 'DMSans-Regular', minHeight: 200, marginBottom: SPACING.lg,
  },
  saveBtn: {
    backgroundColor: COLORS.gold, borderRadius: RADIUS.full,
    paddingVertical: 14, alignItems: 'center', marginBottom: SPACING.xl,
  },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: { color: COLORS.white, fontSize: 15, fontFamily: 'DMSans-SemiBold' },
  historyContainer: { flex: 1, paddingHorizontal: SPACING.lg },
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyText: { color: COLORS.text, fontSize: 18, fontFamily: 'Lora-SemiBold', marginBottom: 8 },
  emptySubtext: { color: COLORS.text3, fontSize: 14, textAlign: 'center', lineHeight: 22, fontFamily: 'DMSans-Regular' },
  entryCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    padding: SPACING.lg, marginBottom: SPACING.md,
    borderWidth: 1, borderColor: COLORS.border,
  },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  entryDate: { color: COLORS.text3, fontSize: 12, fontFamily: 'DMSans-Regular' },
  entryPromptLabel: {
    color: COLORS.gold, fontSize: 12, fontFamily: 'Lora-Italic',
    marginBottom: 8, lineHeight: 18,
  },
  entryContent: { color: COLORS.text2, fontSize: 14, lineHeight: 22, fontFamily: 'DMSans-Regular' },
});
