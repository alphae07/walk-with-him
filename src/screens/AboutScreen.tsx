import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

export default function AboutScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>About</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <LinearGradient colors={['#0A1628', '#1A2E4A']} style={styles.hero}>
          <Text style={styles.heroEmoji}>✝️</Text>
          <Text style={styles.heroTitle}>Walk With Him</Text>
          <Text style={styles.heroTagline}>Not religion. A relationship.</Text>
          <Text style={styles.heroVersion}>Version 1.0.0</Text>
        </LinearGradient>

        <View style={styles.content}>
          {/* What This Is */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What This Is</Text>
            <Text style={styles.bodyText}>
              Walk With Him is a gamified daily companion built for people who want more than church attendance and memorised prayers. It's for anyone who genuinely wants to <Text style={styles.italic}>know</Text> God — to hear His voice, discover their purpose, live in holiness, and walk with Him through the actual chaos of daily life.
            </Text>
            <Text style={styles.bodyText}>
              It's gamified not to make faith trivial, but because <Text style={styles.bold}>consistency is hard</Text> and our brains respond to streaks, rewards, and consequences. The goal isn't to get addicted to an app. The goal is to build habits that make you more aware of God in your day-to-day life — until those habits become who you are.
            </Text>
            <Text style={styles.bodyText}>
              No pastor required. No perfect routine. Just you, God, and honesty.
            </Text>
          </View>

          {/* Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What's Inside</Text>
            {[
              { emoji: '📞', title: 'God Is Calling', desc: 'Three times a day at random intervals, the app rings like an incoming call. Answer it for +15 XP or decline and lose XP. He\'ll call again.' },
              { emoji: '⚡', title: 'XP & Level System', desc: '10 levels from Seeker to Man After His Heart. You can be promoted and demoted — your level reflects where you actually are.' },
              { emoji: '🎁', title: 'Reward Verses', desc: 'Hit milestones and receive 3 handpicked Bible verses for that exact moment.' },
              { emoji: '✍️', title: 'Journal / Talk to God', desc: 'Write to God with no rules. Random prompts appear if you\'re stuck.' },
              { emoji: '👁', title: 'I Saw God Today', desc: 'Log moments where you noticed God working in your day. Over time you\'ll see His fingerprints everywhere.' },
              { emoji: '📖', title: 'Bible Reading Log', desc: 'Log every chapter you read. Track what you noticed about God.' },
              { emoji: '🧭', title: 'Purpose Journal', desc: 'Six sections for the big questions: identity, calling, relationships, career, location, holiness.' },
              { emoji: '🎮', title: '6 Mini Games', desc: 'Bible Quiz, Fill the Blank, Word Scramble, God\'s Names, Prayer Builder, Fruit Check.' },
              { emoji: '📚', title: 'Books of the Month', desc: 'Curated Christian books from 2024 to 2030. Submit summaries for +30 XP.' },
              { emoji: '🎤', title: 'Sermons', desc: 'Curated sermons from Nigerian and global preachers including Apostle Joshua Selman, Adeboye, and more.' },
            ].map(f => (
              <View key={f.title} style={styles.featureRow}>
                <Text style={styles.featureEmoji}>{f.emoji}</Text>
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>{f.title}</Text>
                  <Text style={styles.featureDesc}>{f.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Purpose */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>A Note on Purpose</Text>
            <Text style={styles.bodyText}>
              This app exists for one person first — a developer, founder, and believer who was tired of Christianity being a routine and wanted it to be a relationship.
            </Text>
            <Text style={styles.bodyText}>
              If it helps you too, that's grace.
            </Text>
            <Text style={styles.bodyText}>
              The whole point isn't to build a streak. It's to build a life where hearing God feels normal, obeying Him feels natural, and knowing Him feels more real than anything else.
            </Text>
            <View style={styles.verseCard}>
              <Text style={styles.verseText}>"You will seek me and find me when you seek me with all your heart."</Text>
              <Text style={styles.verseRef}>— Jeremiah 29:13</Text>
            </View>
          </View>

          {/* Builder */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>The Builder</Text>
            <View style={styles.builderCard}>
              <Text style={styles.builderEmoji}>🙏</Text>
              <Text style={styles.builderName}>Ayomide Emmanuel Alao</Text>
              <Text style={styles.builderDesc}>A lover of Christ. A friend of the Holy Spirit. A son of God.</Text>
              <Text style={styles.builderDesc}>
                Frontend Developer · Founder · Believer. Built this because he needed it — and believed others did too.
              </Text>
            </View>
          </View>

          {/* Social */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Community</Text>
            <TouchableOpacity style={styles.socialBtn} onPress={() => Linking.openURL('https://twitter.com')}>
              <Text style={styles.socialBtnEmoji}>🐦</Text>
              <Text style={styles.socialBtnText}>Follow on X (Twitter)</Text>
            </TouchableOpacity>
          </View>

          {/* License */}
          <Text style={styles.license}>
            MIT License · Free to use, adapt, and share. Don't sell it.{'\n'}
            Built with intention. Dedicated to anyone genuinely hungry for God.
          </Text>

          <View style={{ height: 32 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  navTitle: { color: COLORS.text, fontSize: 16, fontFamily: 'DMSans-SemiBold' },
  hero: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: SPACING.lg },
  heroEmoji: { fontSize: 56, marginBottom: 12 },
  heroTitle: { color: COLORS.white, fontSize: 28, fontFamily: 'Lora-SemiBold', marginBottom: 6 },
  heroTagline: { color: COLORS.gold, fontSize: 15, fontFamily: 'Lora-Italic', marginBottom: 8 },
  heroVersion: { color: 'rgba(255,255,255,0.3)', fontSize: 12, fontFamily: 'DMSans-Regular' },
  content: { padding: SPACING.lg },
  section: { marginBottom: SPACING.xl },
  sectionTitle: { color: COLORS.text, fontSize: 18, fontFamily: 'Lora-SemiBold', marginBottom: SPACING.md },
  bodyText: { color: COLORS.text2, fontSize: 14, lineHeight: 24, fontFamily: 'DMSans-Regular', marginBottom: 12 },
  italic: { fontFamily: 'Lora-Italic' },
  bold: { fontFamily: 'DMSans-SemiBold', color: COLORS.text },
  featureRow: { flexDirection: 'row', gap: 14, marginBottom: SPACING.md },
  featureEmoji: { fontSize: 24, width: 36, marginTop: 2, textAlign: 'center' },
  featureInfo: { flex: 1 },
  featureTitle: { color: COLORS.text, fontSize: 14, fontFamily: 'DMSans-SemiBold', marginBottom: 3 },
  featureDesc: { color: COLORS.text2, fontSize: 13, lineHeight: 20, fontFamily: 'DMSans-Regular' },
  verseCard: { backgroundColor: COLORS.bg2, borderRadius: RADIUS.md, padding: SPACING.md, borderLeftWidth: 3, borderLeftColor: COLORS.gold, marginTop: SPACING.sm },
  verseText: { color: COLORS.gold, fontSize: 14, fontFamily: 'Lora-Italic', lineHeight: 22, marginBottom: 6 },
  verseRef: { color: COLORS.gold, fontSize: 12, fontFamily: 'DMSans-SemiBold' },
  builderCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.xl, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  builderEmoji: { fontSize: 44, marginBottom: 12 },
  builderName: { color: COLORS.text, fontSize: 18, fontFamily: 'Lora-SemiBold', marginBottom: 8 },
  builderDesc: { color: COLORS.text2, fontSize: 13, textAlign: 'center', lineHeight: 20, fontFamily: 'DMSans-Regular', marginBottom: 8 },
  socialBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  socialBtnEmoji: { fontSize: 20 },
  socialBtnText: { color: COLORS.text, fontSize: 14, fontFamily: 'DMSans-Medium' },
  license: { color: COLORS.text3, fontSize: 12, fontFamily: 'DMSans-Regular', textAlign: 'center', lineHeight: 20 },
});
