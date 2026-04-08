import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { SERMONS, BOOKS_OF_MONTH } from '../constants/data';
import { format } from 'date-fns';

export default function GrowScreen() {
  const navigation = useNavigation<any>();
  const currentMonth = format(new Date(), 'yyyy-MM');
  const book = BOOKS_OF_MONTH[currentMonth];
  const joshuaSermons = SERMONS.filter(s => s.preacher === 'Apostle Joshua Selman');
  const featuredSermons = SERMONS.slice(0, 3);

  const GROW_FEATURES = [
    { emoji: '📖', title: 'Daily Devotional', subtitle: 'Deep reading + reflection every day', route: 'Devotional', color: '#C8922A' },
    { emoji: '✨', title: 'Know Him Deeper', subtitle: "Explore God's character & attributes", route: 'Devotional', color: '#7C3AED' },
    { emoji: '🎵', title: 'Worship', subtitle: 'Songs curated for your soul\'s posture', route: 'Worship', color: '#2563EB' },
    { emoji: '🙏', title: 'Prayer Wall', subtitle: 'Track prayers and testimonies of answered ones', route: 'PrayerWall', color: '#2E8B5A' },
    { emoji: '🔍', title: 'Deep Reflection', subtitle: 'Questions that change how you know God', route: 'Reflection', color: '#E91E8C' },
    { emoji: '🌟', title: 'Gratitude', subtitle: 'Train your eyes to see God everywhere', route: 'Gratitude', color: '#FF9800' },
    { emoji: '🧭', title: 'Purpose Journal', subtitle: 'Identity, calling, marriage, career', route: 'Purpose', color: '#00BCD4' },
    { emoji: '💪', title: 'Disciplines', subtitle: 'Fasting, silence, prayer retreat', route: 'Disciplines', color: '#FF5722' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Grow</Text>
          <Text style={styles.subtitle}>Feed your spirit intentionally. Day by day.</Text>
        </View>

        {/* Book of Month */}
        {book && (
          <TouchableOpacity style={styles.bookCard} onPress={() => navigation.navigate('BookOfMonth')} activeOpacity={0.88}>
            <View style={styles.bookCardTop}>
              <Text style={styles.bookEmoji}>📚</Text>
              <View style={styles.bookBadge}><Text style={styles.bookBadgeText}>Book of the Month</Text></View>
            </View>
            <Text style={styles.bookTitle}>{book.title}</Text>
            <Text style={styles.bookAuthor}>by {book.author}</Text>
            <Text style={styles.bookDesc} numberOfLines={2}>{book.description}</Text>
            <Text style={styles.bookCta}>Submit summary for +30 XP →</Text>
          </TouchableOpacity>
        )}

        {/* Feature Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spiritual Tools</Text>
          <View style={styles.featureGrid}>
            {GROW_FEATURES.map(f => (
              <TouchableOpacity key={f.route + f.title} style={styles.featureCard} onPress={() => navigation.navigate(f.route)} activeOpacity={0.85}>
                <View style={[styles.featureIconWrap, { backgroundColor: f.color + '20' }]}>
                  <Text style={styles.featureEmoji}>{f.emoji}</Text>
                </View>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureSubtitle} numberOfLines={2}>{f.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Joshua Selman */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔥 Apostle Joshua Selman</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Sermons')}>
              <Text style={styles.seeAll}>See all →</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {joshuaSermons.map(s => (
              <TouchableOpacity key={s.id} style={styles.sermonCard} onPress={() => Linking.openURL(s.url)}>
                <Text style={styles.sermonEmoji}>{s.thumbnail}</Text>
                <Text style={styles.sermonTitle} numberOfLines={2}>{s.title}</Text>
                <View style={styles.sermonBadge}><Text style={styles.sermonBadgeText}>{s.category}</Text></View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Other sermons */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🎤 Featured Sermons</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Sermons')}>
              <Text style={styles.seeAll}>All sermons →</Text>
            </TouchableOpacity>
          </View>
          {featuredSermons.map(s => (
            <TouchableOpacity key={s.id} style={styles.sermonRow} onPress={() => Linking.openURL(s.url)}>
              <Text style={styles.sermonRowEmoji}>{s.thumbnail}</Text>
              <View style={styles.sermonRowInfo}>
                <Text style={styles.sermonRowTitle}>{s.title}</Text>
                <Text style={styles.sermonRowPreacher}>{s.preacher}</Text>
              </View>
              <Text style={{ color: COLORS.gold, fontSize: 14 }}>▶</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm, paddingBottom: SPACING.md },
  title: { color: COLORS.text, fontSize: 24, fontFamily: 'Lora-SemiBold' },
  subtitle: { color: COLORS.text3, fontSize: 13, fontFamily: 'Lora-Italic', marginTop: 2 },
  bookCard: { marginHorizontal: SPACING.lg, marginBottom: SPACING.lg, backgroundColor: '#1A2E4A', borderRadius: 20, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.gold + '40' },
  bookCardTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  bookEmoji: { fontSize: 28 },
  bookBadge: { backgroundColor: COLORS.gold + '20', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  bookBadgeText: { color: COLORS.gold, fontSize: 11, fontFamily: 'DMSans-SemiBold' },
  bookTitle: { color: COLORS.white, fontSize: 20, fontFamily: 'Lora-SemiBold', marginBottom: 4 },
  bookAuthor: { color: COLORS.text2, fontSize: 13, fontFamily: 'DMSans-Regular', marginBottom: 10 },
  bookDesc: { color: COLORS.text2, fontSize: 14, lineHeight: 20, fontFamily: 'DMSans-Regular', marginBottom: 12 },
  bookCta: { color: COLORS.gold, fontSize: 13, fontFamily: 'DMSans-SemiBold' },
  section: { marginBottom: SPACING.lg, paddingHorizontal: SPACING.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  sectionTitle: { color: COLORS.text, fontSize: 16, fontFamily: 'DMSans-SemiBold' },
  seeAll: { color: COLORS.gold, fontSize: 13, fontFamily: 'DMSans-Medium' },
  featureGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  featureCard: { width: '47%', backgroundColor: COLORS.surface, borderRadius: 16, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  featureIconWrap: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm },
  featureEmoji: { fontSize: 24 },
  featureTitle: { color: COLORS.text, fontSize: 13, fontFamily: 'DMSans-SemiBold', marginBottom: 4 },
  featureSubtitle: { color: COLORS.text3, fontSize: 11, fontFamily: 'DMSans-Regular', lineHeight: 16 },
  sermonCard: { width: 160, backgroundColor: COLORS.surface, borderRadius: 16, padding: SPACING.md, marginRight: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  sermonEmoji: { fontSize: 28, marginBottom: 8 },
  sermonTitle: { color: COLORS.text, fontSize: 13, fontFamily: 'DMSans-Medium', lineHeight: 18, marginBottom: 8 },
  sermonBadge: { backgroundColor: COLORS.gold + '20', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, alignSelf: 'flex-start' },
  sermonBadgeText: { color: COLORS.gold, fontSize: 10, fontFamily: 'DMSans-SemiBold' },
  sermonRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.surface, borderRadius: 14, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  sermonRowEmoji: { fontSize: 24, width: 36, textAlign: 'center' },
  sermonRowInfo: { flex: 1 },
  sermonRowTitle: { color: COLORS.text, fontSize: 14, fontFamily: 'DMSans-Medium', marginBottom: 3 },
  sermonRowPreacher: { color: COLORS.text3, fontSize: 12, fontFamily: 'DMSans-Regular' },
});
