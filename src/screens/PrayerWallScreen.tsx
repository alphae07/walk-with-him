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
import { Storage } from '../utils/storage';
import { format, differenceInDays } from 'date-fns';

interface PrayerRequest {
  id: string;
  request: string;
  category: string;
  dateAdded: string;
  answered: boolean;
  answeredNote?: string;
  dateAnswered?: string;
}

const PRAYER_CATEGORIES = ['Personal', 'Family', 'Career', 'Health', 'Relationships', 'Finances', 'Guidance', 'Others', 'Nation', 'Church'];

export default function PrayerWallScreen() {
  const navigation = useNavigation<any>();
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [tab, setTab] = useState<'active' | 'answered' | 'add'>('active');
  const [request, setRequest] = useState('');
  const [category, setCategory] = useState('Personal');

  useFocusEffect(useCallback(() => {
    Storage.get<PrayerRequest[]>('prayer_requests', []).then(p => setPrayers(p || []));
  }, []));

  const addPrayer = async () => {
    if (!request.trim()) return;
    const p: PrayerRequest = {
      id: `prayer_${Date.now()}`,
      request: request.trim(),
      category,
      dateAdded: new Date().toISOString(),
      answered: false,
    };
    const updated = [p, ...prayers];
    await Storage.set('prayer_requests', updated);
    setPrayers(updated);
    setRequest('');
    setTab('active');
    Alert.alert('Added to Prayer Wall', '"Call to me and I will answer you." — Jeremiah 33:3');
  };

  const markAnswered = (id: string) => {
    Alert.alert(
      'Mark as Answered 🙌',
      'Praise God! Mark this prayer as answered?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Answered!',
          onPress: async () => {
            const updated = prayers.map(p =>
              p.id === id
                ? { ...p, answered: true, answeredNote: 'Answered!', dateAnswered: new Date().toISOString() }
                : p
            );
            await Storage.set('prayer_requests', updated);
            setPrayers(updated);
            Alert.alert('Praise God! 🙏', 'This testimony is recorded. He is faithful.');
          }
        }
      ]
    );
  };

  const deletePrayer = (id: string) => {
    Alert.alert('Remove Prayer', 'Remove this prayer request?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove', style: 'destructive',
        onPress: async () => {
          const updated = prayers.filter(p => p.id !== id);
          await Storage.set('prayer_requests', updated);
          setPrayers(updated);
        }
      }
    ]);
  };

  const active = prayers.filter(p => !p.answered);
  const answered = prayers.filter(p => p.answered);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Prayer Wall</Text>
        <TouchableOpacity onPress={() => setTab('add')}>
          <Ionicons name="add" size={26} color={COLORS.gold} />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{active.length}</Text>
          <Text style={styles.statLabel}>Praying</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={[styles.statNum, { color: COLORS.green }]}>{answered.length}</Text>
          <Text style={styles.statLabel}>Answered</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{prayers.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      <View style={styles.tabs}>
        {(['active', 'answered', 'add'] as const).map(t => (
          <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'active' ? `🙏 Active (${active.length})` : t === 'answered' ? `✅ Answered (${answered.length})` : '+ Add'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'active' && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
          {active.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>🙏</Text>
              <Text style={styles.emptyTitle}>No active prayers</Text>
              <Text style={styles.emptyText}>Add what's on your heart. Bring it to Him.</Text>
            </View>
          ) : (
            active.map(p => (
              <View key={p.id} style={styles.prayerCard}>
                <View style={styles.prayerTop}>
                  <View style={styles.catBadge}>
                    <Text style={styles.catBadgeText}>{p.category}</Text>
                  </View>
                  <Text style={styles.daysWaiting}>
                    {differenceInDays(new Date(), new Date(p.dateAdded))} days
                  </Text>
                </View>
                <Text style={styles.prayerText}>{p.request}</Text>
                <Text style={styles.prayerDate}>Added {format(new Date(p.dateAdded), 'MMM d, yyyy')}</Text>
                <View style={styles.prayerActions}>
                  <TouchableOpacity style={styles.answeredBtn} onPress={() => markAnswered(p.id)}>
                    <Ionicons name="checkmark-circle-outline" size={16} color={COLORS.green} />
                    <Text style={styles.answeredBtnText}>Mark Answered</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deletePrayer(p.id)}>
                    <Ionicons name="trash-outline" size={18} color={COLORS.text3} />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
          <View style={{ height: 24 }} />
        </ScrollView>
      )}

      {tab === 'answered' && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
          {answered.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>✨</Text>
              <Text style={styles.emptyTitle}>No answered prayers yet</Text>
              <Text style={styles.emptyText}>Keep praying. He answers. Sometimes the wait is part of the answer.</Text>
            </View>
          ) : (
            <>
              <LinearGradient colors={['#0A1628', '#1A2E4A']} style={styles.answeredHero}>
                <Text style={styles.answeredHeroText}>He has answered {answered.length} of your prayers.</Text>
                <Text style={styles.answeredHeroSub}>This is your testimony. Don't forget it.</Text>
              </LinearGradient>
              {answered.map(p => (
                <View key={p.id} style={[styles.prayerCard, styles.prayerCardAnswered]}>
                  <View style={styles.prayerTop}>
                    <View style={[styles.catBadge, { backgroundColor: COLORS.green + '20' }]}>
                      <Text style={[styles.catBadgeText, { color: COLORS.green }]}>✓ {p.category}</Text>
                    </View>
                    {p.dateAnswered && (
                      <Text style={styles.daysWaiting}>
                        {differenceInDays(new Date(p.dateAnswered), new Date(p.dateAdded))} days in prayer
                      </Text>
                    )}
                  </View>
                  <Text style={styles.prayerText}>{p.request}</Text>
                  {p.answeredNote && (
                    <View style={styles.answeredNote}>
                      <Text style={styles.answeredNoteLabel}>GOD'S ANSWER</Text>
                      <Text style={styles.answeredNoteText}>"{p.answeredNote}"</Text>
                    </View>
                  )}
                  {p.dateAnswered && (
                    <Text style={styles.prayerDate}>Answered {format(new Date(p.dateAnswered), 'MMM d, yyyy')}</Text>
                  )}
                </View>
              ))}
            </>
          )}
          <View style={{ height: 24 }} />
        </ScrollView>
      )}

      {tab === 'add' && (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
            <View style={styles.addIntro}>
              <Text style={styles.addIntroText}>
                "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God." — Philippians 4:6
              </Text>
            </View>

            <Text style={styles.fieldLabel}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catRow} contentContainerStyle={{ gap: 8 }}>
              {PRAYER_CATEGORIES.map(c => (
                <TouchableOpacity
                  key={c}
                  style={[styles.catChip, category === c && styles.catChipActive]}
                  onPress={() => setCategory(c)}
                >
                  <Text style={[styles.catChipText, category === c && styles.catChipTextActive]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.fieldLabel}>Your prayer request</Text>
            <TextInput
              style={styles.textarea}
              value={request}
              onChangeText={setRequest}
              multiline
              numberOfLines={6}
              placeholder="Be specific. God can handle specific. 'God, please help me' is a start — but 'God, I need wisdom about this specific decision by Friday' is a conversation."
              placeholderTextColor={COLORS.text3}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={[styles.addBtn, !request.trim() && styles.addBtnDisabled]}
              onPress={addPrayer}
              disabled={!request.trim()}
            >
              <Text style={styles.addBtnText}>Add to Prayer Wall</Text>
            </TouchableOpacity>

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
  statsRow: { flexDirection: 'row', paddingHorizontal: SPACING.lg, marginBottom: SPACING.md, backgroundColor: COLORS.surface, marginHorizontal: SPACING.lg, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: SPACING.md },
  statNum: { color: COLORS.text, fontSize: 22, fontFamily: 'Lora-SemiBold' },
  statLabel: { color: COLORS.text3, fontSize: 11, fontFamily: 'DMSans-Regular' },
  statDivider: { width: 1, backgroundColor: COLORS.border, marginVertical: 10 },
  tabs: { flexDirection: 'row', paddingHorizontal: SPACING.lg, gap: 8, marginBottom: SPACING.md },
  tab: { flex: 1, paddingVertical: 10, borderRadius: RADIUS.md, backgroundColor: COLORS.surface, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  tabActive: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  tabText: { color: COLORS.text2, fontSize: 11, fontFamily: 'DMSans-Medium' },
  tabTextActive: { color: COLORS.white },
  list: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm },
  empty: { alignItems: 'center', paddingTop: 50 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { color: COLORS.text, fontSize: 18, fontFamily: 'Lora-SemiBold', marginBottom: 8 },
  emptyText: { color: COLORS.text3, fontSize: 14, textAlign: 'center', lineHeight: 22, fontFamily: 'DMSans-Regular' },
  prayerCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  prayerCardAnswered: { borderColor: COLORS.green + '40' },
  prayerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  catBadge: { backgroundColor: COLORS.gold + '20', paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full },
  catBadgeText: { color: COLORS.gold, fontSize: 10, fontFamily: 'DMSans-SemiBold' },
  daysWaiting: { color: COLORS.text3, fontSize: 11, fontFamily: 'DMSans-Regular' },
  prayerText: { color: COLORS.text, fontSize: 14, lineHeight: 22, fontFamily: 'DMSans-Regular', marginBottom: 8 },
  prayerDate: { color: COLORS.text3, fontSize: 11, fontFamily: 'DMSans-Regular', marginBottom: 10 },
  prayerActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  answeredBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  answeredBtnText: { color: COLORS.green, fontSize: 12, fontFamily: 'DMSans-Medium' },
  answeredHero: { borderRadius: RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, alignItems: 'center' },
  answeredHeroText: { color: COLORS.white, fontSize: 16, fontFamily: 'Lora-SemiBold', textAlign: 'center', marginBottom: 6 },
  answeredHeroSub: { color: 'rgba(255,255,255,0.5)', fontSize: 13, fontFamily: 'Lora-Italic', textAlign: 'center' },
  answeredNote: { backgroundColor: COLORS.green + '10', borderRadius: RADIUS.sm, padding: SPACING.sm, marginBottom: 8, borderLeftWidth: 2, borderLeftColor: COLORS.green },
  answeredNoteLabel: { color: COLORS.green, fontSize: 9, letterSpacing: 1.5, fontFamily: 'DMSans-SemiBold', marginBottom: 4 },
  answeredNoteText: { color: COLORS.text2, fontSize: 13, fontFamily: 'Lora-Italic', lineHeight: 20 },
  addIntro: { backgroundColor: COLORS.bg2, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.lg, borderLeftWidth: 3, borderLeftColor: COLORS.gold },
  addIntroText: { color: COLORS.gold, fontSize: 13, fontFamily: 'Lora-Italic', lineHeight: 20 },
  fieldLabel: { color: COLORS.text2, fontSize: 13, fontFamily: 'DMSans-Medium', marginBottom: 8, marginTop: 4 },
  catRow: { maxHeight: 50, marginBottom: SPACING.md },
  catChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADIUS.full, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  catChipActive: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  catChipText: { color: COLORS.text2, fontSize: 12, fontFamily: 'DMSans-Medium' },
  catChipTextActive: { color: COLORS.white },
  textarea: { backgroundColor: COLORS.surface, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: 14, color: COLORS.text, fontSize: 15, fontFamily: 'DMSans-Regular', minHeight: 150, textAlignVertical: 'top', marginBottom: SPACING.md },
  addBtn: { backgroundColor: COLORS.gold, borderRadius: RADIUS.full, paddingVertical: 14, alignItems: 'center' },
  addBtnDisabled: { opacity: 0.4 },
  addBtnText: { color: COLORS.white, fontSize: 15, fontFamily: 'DMSans-SemiBold' },
});
