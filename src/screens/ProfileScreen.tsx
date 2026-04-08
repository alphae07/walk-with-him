import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Storage, UserProfile, defaultProfile } from '../utils/storage';
import { getLevelInfo, getXPProgress, LEVELS } from '../utils/xp';
import { format } from 'date-fns';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [journalCount, setJournalCount] = useState(0);
  const [sightingCount, setSightingCount] = useState(0);

  useFocusEffect(useCallback(() => {
    Storage.get<UserProfile>('profile', defaultProfile).then(p => p && setProfile(p));
    Storage.get<any[]>('journal_entries', []).then(e => setJournalCount((e || []).length));
    Storage.get<any[]>('god_sightings', []).then(e => setSightingCount((e || []).length));
  }, []));

  const levelInfo = getLevelInfo(profile.xp);
  const xpProgress = getXPProgress(profile.xp);

  const STATS = [
    { label: 'Day Streak', value: profile.streak, emoji: '🔥' },
    { label: 'Calls Answered', value: profile.callsAnswered, emoji: '📞' },
    { label: 'Calls Declined', value: profile.callsDeclined, emoji: '🙈' },
    { label: 'Journal Entries', value: journalCount, emoji: '✍️' },
    { label: 'God Sightings', value: sightingCount, emoji: '👁' },
    { label: 'Chapters Read', value: profile.totalChaptersRead, emoji: '📖' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Your Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={22} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <LinearGradient colors={['#0A1628', '#1A2E4A']} style={styles.hero}>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatarEmoji}>{levelInfo.emoji}</Text>
          </View>
          <Text style={styles.heroName}>{profile.name}</Text>
          <Text style={styles.heroLevel}>{levelInfo.name} · Level {levelInfo.level}</Text>
          <Text style={styles.heroJoined}>
            Walking since {format(new Date(profile.joinedAt), 'MMMM d, yyyy')}
          </Text>

          {/* XP Bar */}
          <View style={styles.xpWrap}>
            <View style={styles.xpLabelRow}>
              <Text style={styles.xpLabel}>{profile.xp} XP</Text>
              {xpProgress.next && (
                <Text style={styles.xpLabel}>{xpProgress.next.minXP} XP</Text>
              )}
            </View>
            <View style={styles.xpBar}>
              <View style={[styles.xpFill, { width: `${xpProgress.progress * 100}%` }]} />
            </View>
            {xpProgress.next && (
              <Text style={styles.xpNext}>
                {xpProgress.remaining} XP to {xpProgress.next.name} {xpProgress.next.emoji}
              </Text>
            )}
          </View>
        </LinearGradient>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {STATS.map(stat => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statEmoji}>{stat.emoji}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Level Map */}
        <View style={styles.levelSection}>
          <Text style={styles.levelSectionTitle}>🏔 Your Journey</Text>
          {LEVELS.map(level => {
            const isUnlocked = profile.level >= level.level;
            const isCurrent = profile.level === level.level;
            return (
              <View
                key={level.level}
                style={[styles.levelRow, isCurrent && styles.levelRowCurrent]}
              >
                <View style={[styles.levelDot, isUnlocked && styles.levelDotUnlocked, isCurrent && styles.levelDotCurrent]}>
                  <Text style={styles.levelDotText}>{isUnlocked ? level.emoji : '🔒'}</Text>
                </View>
                <View style={styles.levelInfo}>
                  <Text style={[styles.levelName, isUnlocked && styles.levelNameUnlocked]}>
                    {level.name}
                  </Text>
                  <Text style={styles.levelXP}>
                    {level.minXP === 0 ? 'Start' : `${level.minXP.toLocaleString()} XP`}
                  </Text>
                </View>
                {isCurrent && (
                  <View style={styles.currentBadge}>
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
  container: { flex: 1, backgroundColor: COLORS.bg },
  navBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
  },
  navTitle: { color: COLORS.text, fontSize: 16, fontFamily: 'DMSans-SemiBold' },
  hero: { padding: SPACING.xl, alignItems: 'center' },
  avatarWrap: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: COLORS.bg3, alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: COLORS.gold, marginBottom: SPACING.md,
  },
  avatarEmoji: { fontSize: 44 },
  heroName: { color: COLORS.white, fontSize: 24, fontFamily: 'Lora-SemiBold', marginBottom: 4 },
  heroLevel: { color: COLORS.gold, fontSize: 14, fontFamily: 'DMSans-Medium', marginBottom: 4 },
  heroJoined: { color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'DMSans-Regular', marginBottom: SPACING.lg },
  xpWrap: { width: '100%' },
  xpLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  xpLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontFamily: 'DMSans-Regular' },
  xpBar: { height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden', marginBottom: 6 },
  xpFill: { height: '100%', backgroundColor: COLORS.gold, borderRadius: 4 },
  xpNext: { color: COLORS.goldLight, fontSize: 12, textAlign: 'center', fontFamily: 'DMSans-Regular' },
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 10,
    paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg,
  },
  statCard: {
    width: (width - 32 - 20) / 3,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.md,
    padding: SPACING.md, alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  statEmoji: { fontSize: 22, marginBottom: 6 },
  statValue: { color: COLORS.text, fontSize: 20, fontFamily: 'Lora-SemiBold', marginBottom: 4 },
  statLabel: { color: COLORS.text3, fontSize: 10, fontFamily: 'DMSans-Regular', textAlign: 'center' },
  levelSection: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl },
  levelSectionTitle: { color: COLORS.text, fontSize: 16, fontFamily: 'DMSans-SemiBold', marginBottom: SPACING.md },
  levelRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  levelRowCurrent: { backgroundColor: COLORS.surface + '80', borderRadius: RADIUS.md, paddingHorizontal: 10, marginHorizontal: -10 },
  levelDot: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.bg3, alignItems: 'center', justifyContent: 'center' },
  levelDotUnlocked: { backgroundColor: COLORS.bg2, borderWidth: 1, borderColor: COLORS.border },
  levelDotCurrent: { borderWidth: 2, borderColor: COLORS.gold },
  levelDotText: { fontSize: 20 },
  levelInfo: { flex: 1 },
  levelName: { color: COLORS.text3, fontSize: 14, fontFamily: 'DMSans-Medium' },
  levelNameUnlocked: { color: COLORS.text },
  levelXP: { color: COLORS.text3, fontSize: 11, fontFamily: 'DMSans-Regular' },
  currentBadge: { backgroundColor: COLORS.gold, borderRadius: RADIUS.full, paddingHorizontal: 8, paddingVertical: 4 },
  currentBadgeText: { color: COLORS.white, fontSize: 9, fontFamily: 'DMSans-SemiBold', letterSpacing: 0.5 },
});
