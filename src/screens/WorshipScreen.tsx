import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Linking, Dimensions, Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { WORSHIP_SONGS, getSongsForMood, WorshipSong } from '../services/api';

const { width } = Dimensions.get('window');

const MOODS = [
  { id: 'anxious', label: 'Anxious', emoji: '😰' },
  { id: 'grateful', label: 'Grateful', emoji: '🙏' },
  { id: 'broken', label: 'Broken', emoji: '💔' },
  { id: 'seeking', label: 'Seeking', emoji: '🔍' },
  { id: 'adoring', label: 'Adoring', emoji: '✨' },
  { id: 'surrendering', label: 'Surrendering', emoji: '🤲' },
  { id: 'fighting', label: 'In Battle', emoji: '⚔️' },
  { id: 'still', label: 'Still', emoji: '🕊' },
];

export default function WorshipScreen() {
  const navigation = useNavigation<any>();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [expandedSong, setExpandedSong] = useState<string | null>(null);

  const displaySongs = selectedMood
    ? getSongsForMood(selectedMood)
    : WORSHIP_SONGS;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Worship</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={['#0A1628', '#1A2E4A']} style={styles.hero}>
          <Text style={styles.heroEmoji}>🎵</Text>
          <Text style={styles.heroTitle}>Worship is a Weapon</Text>
          <Text style={styles.heroSubtitle}>
            These songs aren't background music. They are declarations. Each one is chosen because it builds something real in your relationship with God — not just a feeling, but a truth that settles deeper every time you sing it.
          </Text>
        </LinearGradient>

        {/* Mood Selector */}
        <View style={styles.moodSection}>
          <Text style={styles.sectionTitle}>How are you right now?</Text>
          <Text style={styles.sectionSubtitle}>Choose your soul's current posture and get songs for exactly that moment.</Text>
          <View style={styles.moodGrid}>
            {MOODS.map(mood => (
              <TouchableOpacity
                key={mood.id}
                style={[styles.moodChip, selectedMood === mood.id && styles.moodChipActive]}
                onPress={() => setSelectedMood(selectedMood === mood.id ? null : mood.id)}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text style={[styles.moodLabel, selectedMood === mood.id && styles.moodLabelActive]}>
                  {mood.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Songs */}
        <View style={styles.songsSection}>
          <Text style={styles.sectionTitle}>
            {selectedMood
              ? `Songs for when you're ${MOODS.find(m => m.id === selectedMood)?.label.toLowerCase()}`
              : 'All Songs'}
          </Text>

          {displaySongs.map(song => (
            <SongCard
              key={song.id}
              song={song}
              expanded={expandedSong === song.id}
              onToggle={() => setExpandedSong(expandedSong === song.id ? null : song.id)}
            />
          ))}
        </View>

        {/* Worship tip */}
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>💡 A Note on Worship</Text>
          <Text style={styles.tipText}>
            Worship isn't about how good your voice sounds. It's about directing your whole attention to God. Even if you can't sing — hum it, play it in the background while you journal, or let the lyrics be your prayer. The point is encounter, not performance.
          </Text>
          <Text style={styles.tipVerse}>
            "God is spirit, and his worshipers must worship in the Spirit and in truth." — John 4:24
          </Text>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function SongCard({ song, expanded, onToggle }: { song: WorshipSong; expanded: boolean; onToggle: () => void }) {
  return (
    <View style={styles.songCard}>
      <TouchableOpacity style={styles.songCardHeader} onPress={onToggle} activeOpacity={0.85}>
        <View style={styles.songIconWrap}>
          <Text style={styles.songIcon}>🎵</Text>
        </View>
        <View style={styles.songInfo}>
          <Text style={styles.songTitle}>{song.title}</Text>
          <Text style={styles.songArtist}>{song.artist}</Text>
        </View>
        <View style={styles.songThemeBadge}>
          <Text style={styles.songThemeText}>{song.theme}</Text>
        </View>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={16} color={COLORS.text3} />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.songExpanded}>
          <View style={styles.songWhyCard}>
            <Text style={styles.songWhyLabel}>WHY THIS SONG</Text>
            <Text style={styles.songWhyText}>{song.why}</Text>
          </View>

          <View style={styles.songLyricCard}>
            <Text style={styles.songLyricLabel}>THEME</Text>
            <Text style={styles.songLyricText}>"{song.lyricTheme}"</Text>
          </View>

          <View style={styles.songContextBadge}>
            <Text style={styles.songContextText}>Best for: {song.emotionalContext}</Text>
          </View>

          <View style={styles.songLinks}>
            <TouchableOpacity
              style={[styles.songLinkBtn, { backgroundColor: '#FF0000' }]}
              onPress={() => Linking.openURL(song.youtubeSearchUrl)}
            >
              <Text style={styles.songLinkIcon}>▶</Text>
              <Text style={styles.songLinkText}>YouTube</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.songLinkBtn, { backgroundColor: '#1DB954' }]}
              onPress={() => Linking.openURL(song.spotifySearchUrl)}
            >
              <Text style={styles.songLinkIcon}>♪</Text>
              <Text style={styles.songLinkText}>Spotify</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  navTitle: { color: COLORS.text, fontSize: 16, fontFamily: 'DMSans-SemiBold' },
  hero: { padding: SPACING.xl, alignItems: 'center' },
  heroEmoji: { fontSize: 48, marginBottom: 12 },
  heroTitle: { color: COLORS.white, fontSize: 22, fontFamily: 'Lora-SemiBold', textAlign: 'center', marginBottom: 12 },
  heroSubtitle: { color: 'rgba(255,255,255,0.65)', fontSize: 14, lineHeight: 22, textAlign: 'center', fontFamily: 'DMSans-Regular' },
  moodSection: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl, paddingBottom: SPACING.md },
  sectionTitle: { color: COLORS.text, fontSize: 18, fontFamily: 'Lora-SemiBold', marginBottom: 6 },
  sectionSubtitle: { color: COLORS.text3, fontSize: 13, fontFamily: 'DMSans-Regular', lineHeight: 18, marginBottom: SPACING.md },
  moodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  moodChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.full,
    borderWidth: 1, borderColor: COLORS.border,
  },
  moodChipActive: { backgroundColor: COLORS.gold + '25', borderColor: COLORS.gold },
  moodEmoji: { fontSize: 16 },
  moodLabel: { color: COLORS.text2, fontSize: 13, fontFamily: 'DMSans-Medium' },
  moodLabelActive: { color: COLORS.gold },
  songsSection: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg },
  songCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border,
    overflow: 'hidden',
  },
  songCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: SPACING.md },
  songIconWrap: { width: 44, height: 44, borderRadius: RADIUS.md, backgroundColor: COLORS.bg2, alignItems: 'center', justifyContent: 'center' },
  songIcon: { fontSize: 20 },
  songInfo: { flex: 1 },
  songTitle: { color: COLORS.text, fontSize: 14, fontFamily: 'DMSans-SemiBold', marginBottom: 3 },
  songArtist: { color: COLORS.text3, fontSize: 12, fontFamily: 'DMSans-Regular' },
  songThemeBadge: { backgroundColor: COLORS.gold + '20', paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full },
  songThemeText: { color: COLORS.gold, fontSize: 10, fontFamily: 'DMSans-SemiBold' },
  songExpanded: { padding: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border },
  songWhyCard: { backgroundColor: COLORS.bg2, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, borderLeftWidth: 3, borderLeftColor: COLORS.gold },
  songWhyLabel: { color: COLORS.text3, fontSize: 9, letterSpacing: 1.5, fontFamily: 'DMSans-SemiBold', marginBottom: 6 },
  songWhyText: { color: COLORS.text2, fontSize: 13, lineHeight: 20, fontFamily: 'DMSans-Regular' },
  songLyricCard: { backgroundColor: COLORS.bg3, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm },
  songLyricLabel: { color: COLORS.text3, fontSize: 9, letterSpacing: 1.5, fontFamily: 'DMSans-SemiBold', marginBottom: 6 },
  songLyricText: { color: COLORS.text, fontSize: 13, fontFamily: 'Lora-Italic', lineHeight: 20 },
  songContextBadge: { backgroundColor: COLORS.blue + '15', borderRadius: RADIUS.sm, paddingHorizontal: 10, paddingVertical: 6, alignSelf: 'flex-start', marginBottom: SPACING.md },
  songContextText: { color: COLORS.blue, fontSize: 11, fontFamily: 'DMSans-Medium' },
  songLinks: { flexDirection: 'row', gap: 10 },
  songLinkBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: RADIUS.md },
  songLinkIcon: { color: COLORS.white, fontSize: 14 },
  songLinkText: { color: COLORS.white, fontSize: 13, fontFamily: 'DMSans-SemiBold' },
  tipCard: { margin: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  tipTitle: { color: COLORS.text, fontSize: 15, fontFamily: 'DMSans-SemiBold', marginBottom: 8 },
  tipText: { color: COLORS.text2, fontSize: 13, lineHeight: 22, fontFamily: 'DMSans-Regular', marginBottom: 12 },
  tipVerse: { color: COLORS.gold, fontSize: 12, fontFamily: 'Lora-Italic', lineHeight: 18 },
});
