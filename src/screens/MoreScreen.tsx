import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Storage, UserProfile, defaultProfile } from '../utils/storage';
import { getLevelInfo } from '../utils/xp';

const MENU = [
  { title: 'Your Walk', items: [
    { icon: '👤', label: 'Profile & Stats', route: 'Profile', color: COLORS.gold },
    { icon: '⚙️', label: 'Settings', route: 'Settings', color: '#4A90D9' },
  ]},
  { title: 'Spiritual Life', items: [
    { icon: '📖', label: 'Daily Devotional', route: 'Devotional', color: '#C8922A' },
    { icon: '🔍', label: 'Deep Reflection', route: 'Reflection', color: '#7C3AED' },
    { icon: '🌟', label: 'Gratitude', route: 'Gratitude', color: '#FF9800' },
    { icon: '🙏', label: 'Prayer Wall', route: 'PrayerWall', color: '#2E8B5A' },
    { icon: '📕', label: 'Bible Reading Log', route: 'BibleLog', color: '#2E8B5A' },
    { icon: '👁', label: 'I Saw God Today', route: 'GodSightings', color: '#7C3AED' },
    { icon: '🧭', label: 'Purpose Journal', route: 'Purpose', color: '#E91E8C' },
    { icon: '🙏', label: 'Prayer Builder', route: 'PrayerBuilder', color: '#C8922A' },
    { icon: '💪', label: 'Disciplines', route: 'Disciplines', color: '#FF5722' },
    { icon: '🎵', label: 'Worship', route: 'Worship', color: '#2563EB' },
  ]},
  { title: 'Community & Support', items: [
    { icon: '✍️', label: 'Give a Testimony', route: 'Testimony', color: '#2E8B5A' },
    { icon: '💡', label: 'Suggestions', route: 'Suggestions', color: '#4A90D9' },
    { icon: '📩', label: 'Contact the Builder', route: 'Contact', color: '#7C3AED' },
    { icon: '💝', label: 'Sponsor / Donate', route: 'Donate', color: COLORS.gold },
  ]},
  { title: 'App', items: [
    { icon: 'ℹ️', label: 'About Walk With Him', route: 'About', color: '#4A90D9' },
  ]},
];

export default function MoreScreen() {
  const navigation = useNavigation<any>();
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);

  useFocusEffect(useCallback(() => {
    Storage.get<UserProfile>('profile', defaultProfile).then(p => p && setProfile(p));
  }, []));

  const exportData = async () => {
    try {
      const data = await Storage.exportAll();
      const json = JSON.stringify(data, null, 2);
      const path = FileSystem.documentDirectory + 'walk_with_him_backup.json';
      await FileSystem.writeAsStringAsync(path, json);
      await Sharing.shareAsync(path, { mimeType: 'application/json', dialogTitle: 'Export Your Data' });
    } catch { Alert.alert('Export Failed', 'Could not export data.'); }
  };

  const importData = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/json' });
      if (result.canceled) return;
      const json = await FileSystem.readAsStringAsync(result.assets[0].uri);
      await Storage.importAll(JSON.parse(json));
      Alert.alert('Restored!', 'Your data has been imported. Restart the app.');
    } catch { Alert.alert('Import Failed', 'Could not read the backup file.'); }
  };

  const shareApp = () => {
    Share.share({ message: 'I\'ve been using Walk With Him — a gamified app to build a real relationship with God. Not religion, a relationship. Download it and try it.', title: 'Walk With Him' });
  };

  const levelInfo = getLevelInfo(profile.xp);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}><Text style={styles.title}>More</Text></View>

        <TouchableOpacity style={styles.profileCard} onPress={() => navigation.navigate('Profile')} activeOpacity={0.88}>
          <View style={styles.avatar}><Text style={styles.avatarEmoji}>{levelInfo.emoji}</Text></View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileLevel}>{levelInfo.name} · Level {profile.level}</Text>
            <Text style={styles.profileXP}>{profile.xp} XP · 🔥 {profile.streak} day streak</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.text3} />
        </TouchableOpacity>

        {MENU.map(section => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title.toUpperCase()}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, i) => (
                <TouchableOpacity key={item.route + item.label} style={[styles.menuItem, i < section.items.length - 1 && styles.menuItemBorder]} onPress={() => navigation.navigate(item.route)}>
                  <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                    <Text style={styles.menuIconEmoji}>{item.icon}</Text>
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={16} color={COLORS.text3} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DATA & BACKUP</Text>
          <View style={styles.sectionCard}>
            {[
              { emoji: '📤', label: 'Export Data (JSON)', onPress: exportData, color: COLORS.green },
              { emoji: '📥', label: 'Import Data', onPress: importData, color: COLORS.blue },
              { emoji: '🔗', label: 'Share the App', onPress: shareApp, color: COLORS.gold },
            ].map((item, i) => (
              <TouchableOpacity key={item.label} style={[styles.menuItem, i < 2 && styles.menuItemBorder]} onPress={item.onPress}>
                <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                  <Text style={styles.menuIconEmoji}>{item.emoji}</Text>
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={16} color={COLORS.text3} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>"See him more clearly, love him more dearly, follow him more nearly, day by day."</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Walk With Him v1.0.0</Text>
          <Text style={styles.footerText}>Built with love by Ayomide Emmanuel Alao</Text>
          <Text style={styles.footerText}>A lover of Christ 🤍</Text>
        </View>
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm, paddingBottom: SPACING.md },
  title: { color: COLORS.text, fontSize: 24, fontFamily: 'Lora-SemiBold' },
  profileCard: { marginHorizontal: SPACING.lg, marginBottom: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md, flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1, borderColor: COLORS.border },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: COLORS.bg3, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.gold },
  avatarEmoji: { fontSize: 26 },
  profileInfo: { flex: 1 },
  profileName: { color: COLORS.text, fontSize: 17, fontFamily: 'Lora-SemiBold', marginBottom: 2 },
  profileLevel: { color: COLORS.gold, fontSize: 12, fontFamily: 'DMSans-Medium', marginBottom: 2 },
  profileXP: { color: COLORS.text3, fontSize: 12, fontFamily: 'DMSans-Regular' },
  section: { marginBottom: SPACING.md, paddingHorizontal: SPACING.lg },
  sectionTitle: { color: COLORS.text3, fontSize: 11, fontFamily: 'DMSans-SemiBold', letterSpacing: 1, marginBottom: SPACING.sm },
  sectionCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: SPACING.md },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  menuIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  menuIconEmoji: { fontSize: 18 },
  menuLabel: { flex: 1, color: COLORS.text, fontSize: 14, fontFamily: 'DMSans-Regular' },
  quoteCard: { marginHorizontal: SPACING.lg, marginBottom: SPACING.lg, backgroundColor: COLORS.bg2, borderRadius: RADIUS.lg, padding: SPACING.lg, borderLeftWidth: 3, borderLeftColor: COLORS.gold },
  quoteText: { color: COLORS.gold, fontSize: 14, fontFamily: 'Lora-Italic', lineHeight: 22, textAlign: 'center' },
  footer: { alignItems: 'center', gap: 4, paddingHorizontal: SPACING.lg },
  footerText: { color: COLORS.text3, fontSize: 12, fontFamily: 'DMSans-Regular' },
});
