import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors, SPACING, RADIUS } from '../constants/theme';
import { Storage, UserProfile, defaultProfile } from '../utils/storage';
import { getLevelInfo, getXPProgress, LEVELS } from '../utils/xp';

const { width } = Dimensions.get('window');

function safeDate(dateStr: string | undefined): string {
  if (!dateStr) return 'your first day';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'your first day';
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  } catch { return 'your first day'; }
}

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const C = useThemeColors();
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [journalCount, setJournalCount] = useState(0);
  const [sightingCount, setSightingCount] = useState(0);

  useFocusEffect(useCallback(() => {
    Storage.get<UserProfile>('profile', defaultProfile).then(p => { if (p) setProfile(p); });
    Storage.get<any[]>('journal_entries', []).then(e => setJournalCount((e || []).length));
    Storage.get<any[]>('god_sightings', []).then(e => setSightingCount((e || []).length));
  }, []));

  const levelInfo = getLevelInfo(profile?.xp ?? 0);
  const xpProgress = getXPProgress(profile?.xp ?? 0);

  const STATS = [
    { label: 'Day Streak', value: profile?.streak ?? 0, emoji: '🔥' },
    { label: 'Calls Answered', value: profile?.callsAnswered ?? 0, emoji: '📞' },
    { label: 'Calls Declined', value: profile?.callsDeclined ?? 0, emoji: '🙈' },
    { label: 'Journal Entries', value: journalCount, emoji: '✍️' },
    { label: 'God Sightings', value: sightingCount, emoji: '👁' },
    { label: 'Chapters Read', value: profile?.totalChaptersRead ?? 0, emoji: '📖' },
  ];

  const progressWidth = Math.min(Math.max(xpProgress.progress * 100, 0), 100);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bg }]} edges={['top']}>
      <View style={[styles.navBar, { borderBottomColor: C.border + '60' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={C.text} />
        </TouchableOpacity>
        <Text style={[styles.navTitle, { color: C.text }]}>Your Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={22} color={C.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <LinearGradient colors={['#0A1628', '#1A2E4A']} style={styles.hero}>
          <View style={[styles.avatarWrap, { borderColor: C.gold }]}>
            <Text style={styles.avatarEmoji}>{levelInfo.emoji}</Text>
          </View>
          <Text style={styles.heroName}>{profile?.name ?? 'Friend'}</Text>
          <Text style={[styles.heroLevel, { color: C.gold }]}>{levelInfo.name} · Level {levelInfo.level}</Text>
          <Text style={styles.heroJoined}>Walking since {safeDate(profile?.joinedAt)}</Text>

          {/* XP Bar */}
          <View style={styles.xpWrap}>
            <View style={styles.xpLabelRow}>
              <Text style={styles.xpLabel}>{profile?.xp ?? 0} XP</Text>
              {xpProgress.next && <Text style={styles.xpLabel}>{xpProgress.next.minXP} XP</Text>}
            </View>
            <View style={styles.xpBar}>
              <View style={[styles.xpFill, { width: `${progressWidth}%` as any }]} />
            </View>
            {xpProgress.next ? (
              <Text style={styles.xpNext}>{xpProgress.remaining} XP to {xpProgress.next.name} {xpProgress.next.emoji}</Text>
            ) : (
              <Text style={styles.xpNext}>🏆 Maximum level reached!</Text>
            )}
          </View>
        </LinearGradient>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {STATS.map(stat => (
            <View key={stat.label} style={[styles.statCard, { backgroundColor: C.surface, borderColor: C.border }]}>
              <Text style={styles.statEmoji}>{stat.emoji}</Text>
              <Text style={[styles.statValue, { color: C.text }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: C.text3 }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Level Map */}
        <View style={styles.levelSection}>
          <Text style={[styles.levelSectionTitle, { color: C.text }]}>🏔 Your Journey</Text>
          {LEVELS.map(level => {
            const isUnlocked = (profile?.level ?? 1) >= level.level;
            const isCurrent = (profile?.level ?? 1) === level.level;
            return (
              <View key={level.level}
                style={[styles.levelRow,
                  { borderBottomColor: C.border },
                  isCurrent && { backgroundColor: C.surface + 'CC', borderRadius: RADIUS.md, paddingHorizontal: 10, marginHorizontal: -10 },
                ]}>
                <View style={[styles.levelDot,
                  { backgroundColor: C.bg3 },
                  isUnlocked && { backgroundColor: C.bg2, borderWidth: 1, borderColor: C.border },
                  isCurrent && { borderWidth: 2, borderColor: C.gold },
                ]}>
                  <Text style={styles.levelDotText}>{isUnlocked ? level.emoji : '🔒'}</Text>
                </View>
                <View style={styles.levelInfo}>
                  <Text style={[styles.levelName, { color: isUnlocked ? C.text : C.text3 }]}>{level.name}</Text>
                  <Text style={[styles.levelXP, { color: C.text3 }]}>
                    {level.minXP === 0 ? 'Start' : `${level.minXP.toLocaleString()} XP`}
                  </Text>
                </View>
                {isCurrent && (
                  <View style={[styles.currentBadge, { backgroundColor: C.gold }]}>
                    <Text style={styles.currentBadgeText}>YOU ARE HERE</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderBottomWidth: 1 },
  navTitle: { fontSize: 16, fontFamily: 'DMSans-SemiBold' },
  hero: { padding: SPACING.xl, alignItems: 'center' },
  avatarWrap: { width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center', borderWidth: 3, marginBottom: SPACING.md },
  avatarEmoji: { fontSize: 44 },
  heroName: { color: '#F0EDE6', fontSize: 24, fontFamily: 'Lora-SemiBold', marginBottom: 4 },
  heroLevel: { fontSize: 14, fontFamily: 'DMSans-Medium', marginBottom: 4 },
  heroJoined: { color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'DMSans-Regular', marginBottom: SPACING.lg },
  xpWrap: { width: '100%' },
  xpLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  xpLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontFamily: 'DMSans-Regular' },
  xpBar: { height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden', marginBottom: 6 },
  xpFill: { height: '100%', backgroundColor: '#C8922A', borderRadius: 4 },
  xpNext: { color: '#F5E6C8', fontSize: 12, textAlign: 'center', fontFamily: 'DMSans-Regular' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg },
  statCard: { width: (width - 32 - 20) / 3, borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center', borderWidth: 1 },
  statEmoji: { fontSize: 22, marginBottom: 6 },
  statValue: { fontSize: 20, fontFamily: 'Lora-SemiBold', marginBottom: 4 },
  statLabel: { fontSize: 10, fontFamily: 'DMSans-Regular', textAlign: 'center' },
  levelSection: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl },
  levelSectionTitle: { fontSize: 16, fontFamily: 'DMSans-SemiBold', marginBottom: SPACING.md },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12, borderBottomWidth: 1 },
  levelDot: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  levelDotText: { fontSize: 20 },
  levelInfo: { flex: 1 },
  levelName: { fontSize: 14, fontFamily: 'DMSans-Medium' },
  levelXP: { fontSize: 11, fontFamily: 'DMSans-Regular' },
  currentBadge: { borderRadius: RADIUS.full, paddingHorizontal: 8, paddingVertical: 4 },
  currentBadgeText: { color: '#FFFFFF', fontSize: 9, fontFamily: 'DMSans-SemiBold', letterSpacing: 0.5 },
});
