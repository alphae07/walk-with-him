import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, RefreshControl, ImageBackground
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, RADIUS, SHADOW, useThemeColors } from '../constants/theme';
import { Storage, UserProfile, defaultProfile } from '../utils/storage';
import { getLevelInfo, getXPProgress, MILESTONE_REWARDS } from '../utils/xp';
import { VERSE_OF_DAY, MORNING_PROMPTS, MIDDAY_PROMPTS, EVENING_PROMPTS } from '../constants/data';
import { awardXP } from '../utils/xp';

const { width } = Dimensions.get('window');

function getTimeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { greeting: 'Good morning', prompts: MORNING_PROMPTS, emoji: '🌅' };
  if (h < 17) return { greeting: 'Good afternoon', prompts: MIDDAY_PROMPTS, emoji: '☀️' };
  return { greeting: 'Good evening', prompts: EVENING_PROMPTS, emoji: '🌙' };
}

function getTodayVerse() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return VERSE_OF_DAY[dayOfYear % VERSE_OF_DAY.length];
}

export default function HomeScreen() {
  const C = useThemeColors();
  const styles = getStyles(C);
  const navigation = useNavigation<any>();
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [refreshing, setRefreshing] = useState(false);
  const [verseCollected, setVerseCollected] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [rewardData, setRewardData] = useState<any>(null);

  const { greeting, prompts, emoji } = getTimeGreeting();
  const todayVerse = getTodayVerse();
  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

  const loadProfile = useCallback(async () => {
    const p = await Storage.get<UserProfile>('profile', defaultProfile);
    if (p) setProfile(p);

    const todayKey = new Date().toISOString().split('T')[0];
    const collected = await Storage.get<boolean>(`verse_collected_${todayKey}`, false);
    setVerseCollected(collected || false);
  }, []);

  useFocusEffect(useCallback(() => { loadProfile(); }, [loadProfile]));

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  }, [loadProfile]);

  const collectVerse = async () => {
    if (verseCollected) return;
    const todayKey = new Date().toISOString().split('T')[0];
    await Storage.set(`verse_collected_${todayKey}`, true);
    setVerseCollected(true);

    const result = await awardXP('verseOfDay', profile);
    setProfile(result.profile);

    // Check milestones
    const milestone = MILESTONE_REWARDS.find(m => m.condition(result.profile));
    if (milestone) {
      setRewardData(milestone);
      setShowReward(true);
    }
  };

  const levelInfo = getLevelInfo(profile.xp);
  const xpProgress = getXPProgress(profile.xp);

  const quickActions = [
    { icon: '📖', label: 'Devotional', route: 'Devotional' },
    { icon: '🙏', label: 'Prayer Wall', route: 'PrayerWall' },
    { icon: '🌟', label: 'Gratitude', route: 'Gratitude' },
    { icon: '🔍', label: 'Reflection', route: 'Reflection' },
    { icon: '🎵', label: 'Worship', route: 'Worship' },
    { icon: '👁', label: 'God Sighting', route: 'GodSightings' },
    { icon: '🧭', label: 'Purpose', route: 'Purpose' },
    { icon: '📚', label: 'Book of Month', route: 'BookOfMonth' },
    { icon: '💪', label: 'Disciplines', route: 'Disciplines' },
  ];

  return (
    <View style={[styles.container, {backgroundColor: C.bg}]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.gold} />}
      >
        {/* Header */}
        <LinearGradient colors={[C.bg, C.bg2]} style={styles.header}>
          <SafeAreaView edges={['top']}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.greeting}>{emoji} {greeting},</Text>
                <Text style={styles.userName}>{profile.name}</Text>
              </View>
              <TouchableOpacity
                style={styles.profileBtn}
                onPress={() => navigation.navigate('Profile')}
              >
                <Text style={styles.levelBadge}>{levelInfo.emoji}</Text>
              </TouchableOpacity>
            </View>

            {/* XP Bar */}
            <View style={styles.xpSection}>
              <View style={styles.xpLabelRow}>
                <Text style={styles.levelName}>{levelInfo.name}</Text>
                <Text style={styles.xpText}>{profile.xp} XP</Text>
              </View>
              <View style={styles.xpBarBg}>
                <View style={[styles.xpBarFill, { width: `${xpProgress.progress * 100}%` }]} />
              </View>
              {xpProgress.next && (
                <Text style={styles.xpNext}>
                  {xpProgress.remaining} XP to {xpProgress.next.name}
                </Text>
              )}
            </View>

            {/* Streak */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statEmoji}>🔥</Text>
                <Text style={styles.statValue}>{profile.streak}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statEmoji}>📞</Text>
                <Text style={styles.statValue}>{profile.callsAnswered}</Text>
                <Text style={styles.statLabel}>Calls Answered</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statEmoji}>✍️</Text>
                <Text style={styles.statValue}>{profile.totalJournalEntries}</Text>
                <Text style={styles.statLabel}>Journal Entries</Text>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.content}>
          {/* Verse of the Day */}
          <TouchableOpacity
            style={styles.verseCard}
            onPress={collectVerse}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#1A2E4A', '#0F1E38']}
              style={styles.verseCardInner}
            >
              <View style={styles.verseCardHeader}>
                <Text style={styles.verseCardLabel}>✨ Verse of the Day</Text>
                {verseCollected ? (
                  <View style={styles.collectedBadge}>
                    <Ionicons name="checkmark" size={12} color={C.green} />
                    <Text style={styles.collectedText}>+5 XP</Text>
                  </View>
                ) : (
                  <Text style={styles.tapToCollect}>Tap to collect +5 XP</Text>
                )}
              </View>
              <Text style={styles.verseText}>"{todayVerse.text}"</Text>
              <Text style={styles.verseRef}>— {todayVerse.ref}</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Daily Prompt */}
          <View style={styles.promptCard}>
            <Text style={styles.promptLabel}>💬 For you today</Text>
            <Text style={styles.promptText}>{randomPrompt}</Text>
            <TouchableOpacity
              style={styles.respondBtn}
              onPress={() => navigation.navigate('Journal')}
            >
              <Text style={styles.respondBtnText}>Write a Response →</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.quickGrid}>
            {quickActions.map(action => (
              <TouchableOpacity
                key={action.route}
                style={styles.quickItem}
                onPress={() => navigation.navigate(action.route)}
              >
                <Text style={styles.quickEmoji}>{action.icon}</Text>
                <Text style={styles.quickLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Today's Mission */}
          <View style={styles.missionCard}>
            <Text style={styles.missionTitle}>🎯 Today's Disciplines</Text>
            <DisciplineCheck label="📖 Read at least 1 Bible chapter" storageKey="today_bible" />
            <DisciplineCheck label="✍️ Write a journal entry" storageKey="today_journal" />
            <DisciplineCheck label="👁 Log a God sighting" storageKey="today_sighting" />
            <DisciplineCheck label="📞 Answer a call" storageKey="today_call" />
          </View>

          {/* Bottom spacer */}
          <View style={{ height: 24 }} />
        </View>
      </ScrollView>

      {/* Reward Overlay */}
      {showReward && rewardData && (
        <RewardOverlay data={rewardData} onClose={() => setShowReward(false)} />
      )}
    </View>
  );
}

function DisciplineCheck({ label, storageKey }: { label: string; storageKey: string }) {
  const C = useThemeColors();
  const styles = getStyles(C);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const todayKey = new Date().toISOString().split('T')[0];
    Storage.get<boolean>(`${storageKey}_${todayKey}`, false).then(v => setDone(v || false));
  }, [storageKey]);

  return (
    <View style={styles.disciplineRow}>
      <View style={[styles.disciplineCheck, done && styles.disciplineCheckDone]}>
        {done && <Ionicons name="checkmark" size={12} color={C.white} />}
      </View>
      <Text style={[styles.disciplineLabel, done && styles.disciplineLabelDone]}>{label}</Text>
    </View>
  );
}

function RewardOverlay({ data, onClose }: { data: any; onClose: () => void }) {
  const C = useThemeColors();
  const styles = getStyles(C);
  return (
    <View style={styles.rewardOverlay}>
      <TouchableOpacity style={styles.rewardBackdrop} onPress={onClose} activeOpacity={1} />
      <View style={styles.rewardCard}>
        <Text style={styles.rewardEmoji}>{data.emoji}</Text>
        <Text style={styles.rewardTitle}>{data.title}</Text>
        <Text style={styles.rewardSubtitle}>{data.subtitle}</Text>
        <View style={styles.rewardVerses}>
          {data.verses.map((v: any, i: number) => (
            <View key={i} style={styles.rewardVerseItem}>
              <Text style={styles.rewardVerseText}>"{v.text}"</Text>
              <Text style={styles.rewardVerseRef}>— {v.ref}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity style={styles.rewardCloseBtn} onPress={onClose}>
          <Text style={styles.rewardCloseBtnText}>Receive This 🙏</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const getStyles = (C: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.lg },
  headerTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: SPACING.md, paddingTop: SPACING.sm,
  },
  greeting: { color: C.text2, fontSize: 13, fontFamily: 'DMSans-Regular' },
  userName: { color: C.text, fontSize: 22, fontFamily: 'Lora-SemiBold' },
  profileBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: C.border,
  },
  levelBadge: { fontSize: 22 },
  xpSection: { marginBottom: SPACING.md },
  xpLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  levelName: { color: C.gold, fontSize: 13, fontFamily: 'DMSans-Medium' },
  xpText: { color: C.text2, fontSize: 12, fontFamily: 'DMSans-Regular' },
  xpBarBg: { height: 6, backgroundColor: C.border, borderRadius: 3 },
  xpBarFill: { height: '100%', backgroundColor: C.gold, borderRadius: 3 },
  xpNext: { color: C.text3, fontSize: 11, marginTop: 4, fontFamily: 'DMSans-Regular' },
  statsRow: {
    flexDirection: 'row', backgroundColor: C.surface,
    borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statEmoji: { fontSize: 18, marginBottom: 4 },
  statValue: { color: C.text, fontSize: 18, fontFamily: 'Lora-SemiBold' },
  statLabel: { color: C.text3, fontSize: 11, fontFamily: 'DMSans-Regular', textAlign: 'center' },
  statDivider: { width: 1, height: 40, backgroundColor: C.border },
  content: { paddingHorizontal: SPACING.md, paddingTop: SPACING.md },
  verseCard: { borderRadius: RADIUS.lg, overflow: 'hidden', marginBottom: SPACING.md, ...SHADOW.gold },
  verseCardInner: { padding: SPACING.lg },
  verseCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  verseCardLabel: { color: C.gold, fontSize: 12, fontFamily: 'DMSans-SemiBold', letterSpacing: 0.5 },
  collectedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  collectedText: { color: C.green, fontSize: 12, fontFamily: 'DMSans-Medium' },
  tapToCollect: { color: C.goldLight, fontSize: 11, fontFamily: 'DMSans-Regular', opacity: 0.7 },
  verseText: { color: C.text, fontSize: 16, fontFamily: 'Lora-Italic', lineHeight: 26, marginBottom: 10 },
  verseRef: { color: C.gold, fontSize: 13, fontFamily: 'DMSans-SemiBold' },
  promptCard: {
    backgroundColor: C.surface, borderRadius: RADIUS.lg,
    padding: SPACING.lg, marginBottom: SPACING.md,
    borderWidth: 1, borderColor: C.border,
  },
  promptLabel: { color: C.text3, fontSize: 12, fontFamily: 'DMSans-Medium', marginBottom: 10 },
  promptText: { color: C.text, fontSize: 15, lineHeight: 24, fontFamily: 'Lora-Italic', marginBottom: 16 },
  respondBtn: { alignSelf: 'flex-start' },
  respondBtnText: { color: C.gold, fontSize: 14, fontFamily: 'DMSans-SemiBold' },
  sectionTitle: { color: C.text, fontSize: 16, fontFamily: 'Lora-SemiBold', marginBottom: SPACING.sm },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: SPACING.lg },
  quickItem: {
    width: (width - 32 - 20) / 3,
    backgroundColor: C.surface, borderRadius: RADIUS.md,
    padding: SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: C.border,
  },
  quickEmoji: { fontSize: 24, marginBottom: 6 },
  quickLabel: { color: C.text2, fontSize: 11, fontFamily: 'DMSans-Medium', textAlign: 'center' },
  missionCard: {
    backgroundColor: C.surface, borderRadius: RADIUS.lg,
    padding: SPACING.lg, borderWidth: 1, borderColor: C.border, marginBottom: SPACING.md,
  },
  missionTitle: { color: C.text, fontSize: 15, fontFamily: 'DMSans-SemiBold', marginBottom: SPACING.md },
  disciplineRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  disciplineCheck: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: C.border,
    alignItems: 'center', justifyContent: 'center',
  },
  disciplineCheckDone: { backgroundColor: C.green, borderColor: C.green },
  disciplineLabel: { color: C.text2, fontSize: 14, fontFamily: 'DMSans-Regular', flex: 1 },
  disciplineLabelDone: { color: C.text3, textDecorationLine: 'line-through' },
  // Reward overlay
  rewardOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 9999, alignItems: 'center', justifyContent: 'center' },
  rewardBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.75)' },
  rewardCard: {
    width: width - 48, backgroundColor: C.surface,
    borderRadius: 24, padding: SPACING.xl, alignItems: 'center', zIndex: 1,
    borderWidth: 1, borderColor: C.border,
  },
  rewardEmoji: { fontSize: 64, marginBottom: SPACING.md },
  rewardTitle: { color: C.text, fontSize: 22, fontFamily: 'Lora-SemiBold', textAlign: 'center', marginBottom: 8 },
  rewardSubtitle: { color: C.text2, fontSize: 14, textAlign: 'center', lineHeight: 22, fontFamily: 'DMSans-Regular', marginBottom: SPACING.lg },
  rewardVerses: { backgroundColor: C.bg2, borderRadius: RADIUS.md, padding: SPACING.md, width: '100%', marginBottom: SPACING.lg },
  rewardVerseItem: { marginBottom: 12 },
  rewardVerseText: { color: C.text, fontSize: 13, fontFamily: 'Lora-Italic', lineHeight: 20, marginBottom: 4 },
  rewardVerseRef: { color: C.gold, fontSize: 12, fontFamily: 'DMSans-SemiBold' },
  rewardCloseBtn: { width: '100%', backgroundColor: C.gold, borderRadius: RADIUS.full, paddingVertical: 14, alignItems: 'center' },
  rewardCloseBtnText: { color: C.white, fontSize: 15, fontFamily: 'DMSans-SemiBold' },
});
