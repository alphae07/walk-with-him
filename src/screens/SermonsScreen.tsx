import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { SERMONS } from '../constants/data';

const CATEGORIES = ['All', 'Intimacy', 'Prayer', 'Holy Spirit', 'Faith', 'Kingdom', 'Grace', 'Identity', 'Purpose', 'Wisdom', 'Revival', 'Discipleship', 'Healing', 'Devotional', 'Prophetic'];
const PREACHERS = ['All', 'Apostle Joshua Selman', 'Pastor E.A. Adeboye', 'Pastor Chris Oyakhilome', 'Pastor David Ibiyeomie', 'Sam Adeyemi', 'Femi Lazarus', 'Pastor Tobi Adegboyega', 'Touré Roberts', 'Steven Furtick', 'Francis Chan'];

export default function SermonsScreen() {
  const navigation = useNavigation<any>();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPreacher, setSelectedPreacher] = useState('All');

  const filtered = SERMONS.filter(s => {
    const catMatch = selectedCategory === 'All' || s.category === selectedCategory;
    const preacherMatch = selectedPreacher === 'All' || s.preacher === selectedPreacher;
    return catMatch && preacherMatch;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Sermons</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Category Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={styles.filterContent}>
        {CATEGORIES.map(c => (
          <TouchableOpacity
            key={c}
            style={[styles.chip, selectedCategory === c && styles.chipActive]}
            onPress={() => setSelectedCategory(c)}
          >
            <Text style={[styles.chipText, selectedCategory === c && styles.chipTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Preacher Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={styles.filterContent}>
        {PREACHERS.map(p => (
          <TouchableOpacity
            key={p}
            style={[styles.chip, styles.chipSmall, selectedPreacher === p && styles.chipActive]}
            onPress={() => setSelectedPreacher(p)}
          >
            <Text style={[styles.chipText, styles.chipTextSmall, selectedPreacher === p && styles.chipTextActive]}>
              {p === 'All' ? 'All Preachers' : p.split(' ').slice(-1)[0]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        <Text style={styles.resultsCount}>{filtered.length} sermon{filtered.length !== 1 ? 's' : ''}</Text>
        {filtered.map(sermon => (
          <TouchableOpacity
            key={sermon.id}
            style={styles.sermonCard}
            onPress={() => Linking.openURL(sermon.url)}
            activeOpacity={0.85}
          >
            <View style={styles.sermonLeft}>
              <Text style={styles.sermonEmoji}>{sermon.thumbnail}</Text>
            </View>
            <View style={styles.sermonInfo}>
              <Text style={styles.sermonTitle}>{sermon.title}</Text>
              <Text style={styles.sermonPreacher}>{sermon.preacher}</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{sermon.category}</Text>
              </View>
            </View>
            <View style={styles.playBtn}>
              <Ionicons name="play" size={16} color={COLORS.gold} />
            </View>
          </TouchableOpacity>
        ))}
        <View style={styles.discoverCard}>
          <Text style={styles.discoverTitle}>🔍 Discover More</Text>
          <Text style={styles.discoverText}>
            Search YouTube for your favourite preacher. God can speak through anyone He chooses — stay open.
          </Text>
          <TouchableOpacity
            style={styles.discoverBtn}
            onPress={() => Linking.openURL('https://www.youtube.com/results?search_query=christian+sermon+2024')}
          >
            <Text style={styles.discoverBtnText}>Search YouTube →</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  navTitle: { color: COLORS.text, fontSize: 16, fontFamily: 'DMSans-SemiBold' },
  filterRow: { maxHeight: 50 },
  filterContent: { paddingHorizontal: SPACING.lg, gap: 8, paddingBottom: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADIUS.full, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  chipSmall: { paddingHorizontal: 10, paddingVertical: 6 },
  chipActive: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  chipText: { color: COLORS.text2, fontSize: 13, fontFamily: 'DMSans-Medium' },
  chipTextSmall: { fontSize: 11 },
  chipTextActive: { color: COLORS.white },
  list: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md },
  resultsCount: { color: COLORS.text3, fontSize: 12, fontFamily: 'DMSans-Regular', marginBottom: SPACING.md },
  sermonCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  sermonLeft: { width: 48, height: 48, borderRadius: RADIUS.md, backgroundColor: COLORS.bg3, alignItems: 'center', justifyContent: 'center' },
  sermonEmoji: { fontSize: 24 },
  sermonInfo: { flex: 1 },
  sermonTitle: { color: COLORS.text, fontSize: 14, fontFamily: 'DMSans-SemiBold', marginBottom: 3 },
  sermonPreacher: { color: COLORS.text3, fontSize: 12, fontFamily: 'DMSans-Regular', marginBottom: 6 },
  categoryBadge: { backgroundColor: COLORS.gold + '20', paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full, alignSelf: 'flex-start' },
  categoryBadgeText: { color: COLORS.gold, fontSize: 10, fontFamily: 'DMSans-SemiBold' },
  playBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.gold + '20', alignItems: 'center', justifyContent: 'center' },
  discoverCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.lg, marginTop: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  discoverTitle: { color: COLORS.text, fontSize: 16, fontFamily: 'DMSans-SemiBold', marginBottom: 8 },
  discoverText: { color: COLORS.text2, fontSize: 13, lineHeight: 20, fontFamily: 'DMSans-Regular', marginBottom: SPACING.md },
  discoverBtn: { backgroundColor: COLORS.gold, borderRadius: RADIUS.full, paddingVertical: 10, paddingHorizontal: 20, alignSelf: 'flex-start' },
  discoverBtnText: { color: COLORS.white, fontSize: 13, fontFamily: 'DMSans-SemiBold' },
});
