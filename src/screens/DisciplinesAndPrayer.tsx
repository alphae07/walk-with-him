import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, useThemeColors } from '../constants/theme';
import { Storage, UserProfile, defaultProfile } from '../utils/storage';
import { awardXP } from '../utils/xp';
import { PRAYER_CATEGORIES } from '../constants/data';

// ── DISCIPLINES ────────────────────────────────────────────
export function DisciplinesScreen() {
  const C = useThemeColors();
  const styles = getStyles(C);
  const navigation = useNavigation<any>();
  const [activeFast, setActiveFast] = useState<any>(null);
  const [completedDisciplines, setCompletedDisciplines] = useState<string[]>([]);

  useFocusEffect(useCallback(() => {
    Storage.get<any>('active_fast', null).then(f => setActiveFast(f));
    Storage.get<string[]>('completed_disciplines', []).then(d => setCompletedDisciplines(d || []));
  }, []));

  const startFast = async () => {
    const fast = { startedAt: new Date().toISOString(), type: 'standard' };
    await Storage.set('active_fast', fast);
    setActiveFast(fast);
    Alert.alert('Fast Started', 'Your fast has begun. Pray specifically during this time. God hears every prayer when we fast.');
  };

  const completeFast = async () => {
    Alert.alert(
      'Complete Fast',
      'Did you complete your fast?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Complete It',
          onPress: async () => {
            await Storage.set('active_fast', null);
            setActiveFast(null);
            const p = await Storage.get<UserProfile>('profile', defaultProfile);
            if (p) {
              const result = await awardXP('fastCompleted', p);
              await Storage.set('profile', result.profile);
            }
            Alert.alert('Fast Completed! +25 XP', '"Is not this the kind of fasting I have chosen: to loose the chains of injustice?" — Isaiah 58:6');
          }
        }
      ]
    );
  };

  const completeRetreat = async () => {
    if (completedDisciplines.includes('retreat_today')) return;
    Alert.alert('Prayer Retreat', 'You blocked 2+ hours to be alone with God today?', [
      { text: 'Not yet', style: 'cancel' },
      {
        text: 'Yes, completed',
        onPress: async () => {
          const today = new Date().toISOString().split('T')[0];
          const updated = [...completedDisciplines, `retreat_${today}`];
          await Storage.set('completed_disciplines', updated);
          setCompletedDisciplines(updated);
          const p = await Storage.get<UserProfile>('profile', defaultProfile);
          if (p) {
            const result = await awardXP('prayerRetreat', p);
            await Storage.set('profile', result.profile);
          }
          Alert.alert('Retreat Complete! +35 XP', '"But when you pray, go into your room, close the door and pray to your Father, who is unseen." — Matthew 6:6');
        }
      }
    ]);
  };

  const completeSilence = async () => {
    const today = new Date().toISOString().split('T')[0];
    if (completedDisciplines.includes(`silence_${today}`)) {
      Alert.alert('Already Done', 'You\'ve completed your hour of silence today. See you tomorrow.');
      return;
    }
    Alert.alert('Hour of Silence', 'One full hour — no phone, no music, no noise. Just you and God. Ready to begin?', [
      { text: 'Not yet', style: 'cancel' },
      {
        text: 'I\'m ready',
        onPress: async () => {
          const updated = [...completedDisciplines, `silence_${today}`];
          await Storage.set('completed_disciplines', updated);
          setCompletedDisciplines(updated);
          const p = await Storage.get<UserProfile>('profile', defaultProfile);
          if (p) {
            const result = await awardXP('hourOfSilence', p);
            await Storage.set('profile', result.profile);
          }
          Alert.alert('Silence Complete! +20 XP', '"Be still, and know that I am God." — Psalm 46:10');
        }
      }
    ]);
  };

  const today = new Date().toISOString().split('T')[0];
  const retreatDone = completedDisciplines.includes(`retreat_${today}`);
  const silenceDone = completedDisciplines.includes(`silence_${today}`);

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: C.bg}]} edges={['top']}>
      <View style={[styles.navBar, {backgroundColor: C.bg, borderBottomColor: C.border + "60"}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={C.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Spiritual Disciplines</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.introCard}>
          <Text style={styles.introText}>
            Spiritual disciplines aren't about earning God's love. They're about positioning yourself to receive what He wants to give you. Grace + effort = transformation.
          </Text>
        </View>

        {/* Fasting */}
        <View style={styles.disciplineCard}>
          <View style={styles.disciplineHeader}>
            <Text style={styles.disciplineEmoji}>🍽️</Text>
            <View style={styles.disciplineHeaderInfo}>
              <Text style={styles.disciplineTitle}>Fasting</Text>
              <Text style={styles.disciplineXP}>+25 XP on completion</Text>
            </View>
            {activeFast ? (
              <View style={styles.activeBadge}><Text style={styles.activeBadgeText}>ACTIVE</Text></View>
            ) : null}
          </View>
          <Text style={styles.disciplineDesc}>
            Fasting realigns your hunger for God above your hunger for everything else. Choose a meal, a day, or a period — and use that time to pray instead.
          </Text>
          <Text style={styles.scriptureRef}>"When you fast, do not look somber..." — Matthew 6:17</Text>
          {activeFast ? (
            <View style={styles.fastActiveInfo}>
              <Text style={styles.fastStarted}>Started: {new Date(activeFast.startedAt).toLocaleString()}</Text>
              <TouchableOpacity style={styles.completeBtn} onPress={completeFast}>
                <Text style={styles.completeBtnText}>Mark as Completed</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.startBtn} onPress={startFast}>
              <Text style={styles.startBtnText}>Begin a Fast</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Prayer Retreat */}
        <View style={styles.disciplineCard}>
          <View style={styles.disciplineHeader}>
            <Text style={styles.disciplineEmoji}>🏕️</Text>
            <View style={styles.disciplineHeaderInfo}>
              <Text style={styles.disciplineTitle}>Prayer Retreat</Text>
              <Text style={styles.disciplineXP}>+35 XP</Text>
            </View>
            {retreatDone && <View style={styles.doneBadge}><Text style={styles.doneBadgeText}>DONE TODAY</Text></View>}
          </View>
          <Text style={styles.disciplineDesc}>
            Block 2+ hours. Put your phone in another room. Bring your Bible and a journal. Just you and God — no agenda except to be with Him.
          </Text>
          <Text style={styles.scriptureRef}>"Very early in the morning, while it was still dark, Jesus got up, left the house and went off to a solitary place, where he prayed." — Mark 1:35</Text>
          <TouchableOpacity style={[styles.startBtn, retreatDone && styles.startBtnDone]} onPress={completeRetreat} disabled={retreatDone}>
            <Text style={styles.startBtnText}>{retreatDone ? 'Completed Today ✓' : 'Log Prayer Retreat'}</Text>
          </TouchableOpacity>
        </View>

        {/* Hour of Silence */}
        <View style={styles.disciplineCard}>
          <View style={styles.disciplineHeader}>
            <Text style={styles.disciplineEmoji}>🤫</Text>
            <View style={styles.disciplineHeaderInfo}>
              <Text style={styles.disciplineTitle}>Hour of Silence</Text>
              <Text style={styles.disciplineXP}>+20 XP</Text>
            </View>
            {silenceDone && <View style={styles.doneBadge}><Text style={styles.doneBadgeText}>DONE TODAY</Text></View>}
          </View>
          <Text style={styles.disciplineDesc}>
            No phone. No music. No podcast. No noise. Just one hour of complete quiet — listening for God's still, small voice. Most people have never done this once.
          </Text>
          <Text style={styles.scriptureRef}>"After the earthquake came a fire, but the Lord was not in the fire. And after the fire came a gentle whisper." — 1 Kings 19:12</Text>
          <TouchableOpacity style={[styles.startBtn, silenceDone && styles.startBtnDone]} onPress={completeSilence} disabled={silenceDone}>
            <Text style={styles.startBtnText}>{silenceDone ? 'Completed Today ✓' : 'Begin Hour of Silence'}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── PRAYER BUILDER ─────────────────────────────────────────
export function PrayerBuilderScreen() {
  const C = useThemeColors();
  const styles = getStyles(C);
  const navigation = useNavigation<any>();
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [current, setCurrent] = useState('');
  const [done, setDone] = useState(false);

  const cat = PRAYER_CATEGORIES[step];

  const handleNext = async () => {
    const updated = { ...responses, [cat.id]: current };
    setResponses(updated);
    setCurrent('');
    if (step < PRAYER_CATEGORIES.length - 1) {
      setStep(s => s + 1);
    } else {
      setDone(true);
      const entry = {
        id: `prayer_${Date.now()}`,
        date: new Date().toISOString(),
        type: 'prayer',
        responses: updated,
      };
      const existing = await Storage.get<any[]>('prayer_history', []);
      await Storage.set('prayer_history', [entry, ...(existing || [])]);
    }
  };

  const reset = () => {
    setStep(0);
    setResponses({});
    setCurrent('');
    setDone(false);
  };

  if (done) {
    return (
      <SafeAreaView style={[styles.container, {backgroundColor: C.bg}]} edges={['top']}>
        <View style={[styles.navBar, {backgroundColor: C.bg, borderBottomColor: C.border + "60"}]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={C.text} />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Prayer Complete</Text>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.prayerDoneEmoji}>🙏</Text>
          <Text style={styles.prayerDoneTitle}>Amen.</Text>
          <Text style={styles.prayerDoneSubtitle}>Your ACTS prayer is complete and saved.</Text>
          {PRAYER_CATEGORIES.map(c => (
            <View key={c.id} style={styles.prayerSummary}>
              <View style={[styles.prayerSummaryHeader, { borderLeftColor: c.color }]}>
                <Text style={styles.prayerSummaryIcon}>{c.icon}</Text>
                <Text style={[styles.prayerSummaryLabel, { color: c.color }]}>{c.label}</Text>
              </View>
              <Text style={styles.prayerSummaryText}>{responses[c.id] || '—'}</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.startBtn} onPress={reset}>
            <Text style={styles.startBtnText}>Pray Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.startBtn, { backgroundColor: C.bg3, marginTop: 10 }]} onPress={() => navigation.goBack()}>
            <Text style={[styles.startBtnText, { color: C.text }]}>Back</Text>
          </TouchableOpacity>
          <View style={{ height: 32 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: C.bg}]} edges={['top']}>
      <View style={[styles.navBar, {backgroundColor: C.bg, borderBottomColor: C.border + "60"}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={C.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Prayer Builder</Text>
        <Text style={styles.stepCount}>{step + 1}/4</Text>
      </View>

      {/* Progress */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${((step + 1) / 4) * 100}%`, backgroundColor: cat.color }]} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={[styles.catCard, { borderColor: cat.color + '60' }]}>
            <Text style={styles.catEmoji}>{cat.icon}</Text>
            <Text style={[styles.catLabel, { color: cat.color }]}>{cat.label}</Text>
            <Text style={styles.catPrompt}>{cat.prompt}</Text>
          </View>
          <Text style={styles.formLabel}>Write your {cat.label.toLowerCase()}:</Text>
          <TextInput
            style={styles.prayerInput}
            value={current}
            onChangeText={setCurrent}
            multiline
            numberOfLines={6}
            placeholder="Be specific. Be honest. Be bold."
            placeholderTextColor={C.text3}
            textAlignVertical="top"
          />
          <TouchableOpacity style={[styles.startBtn, { backgroundColor: cat.color }]} onPress={handleNext}>
            <Text style={styles.startBtnText}>
              {step < 3 ? `Next: ${PRAYER_CATEGORIES[step + 1].label} →` : 'Complete Prayer 🙏'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getStyles = (C: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  navTitle: { color: C.text, fontSize: 16, fontFamily: 'DMSans-SemiBold' },
  stepCount: { color: C.gold, fontSize: 14, fontFamily: 'DMSans-SemiBold' },
  progressBar: { height: 3, backgroundColor: C.border, marginHorizontal: SPACING.lg, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  content: { padding: SPACING.lg },
  introCard: { backgroundColor: C.bg2, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.lg, borderLeftWidth: 3, borderLeftColor: C.gold },
  introText: { color: C.text2, fontSize: 13, lineHeight: 20, fontFamily: 'DMSans-Regular' },
  disciplineCard: { backgroundColor: C.surface, borderRadius: RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: C.border },
  disciplineHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: SPACING.md },
  disciplineEmoji: { fontSize: 32 },
  disciplineHeaderInfo: { flex: 1 },
  disciplineTitle: { color: C.text, fontSize: 17, fontFamily: 'DMSans-SemiBold' },
  disciplineXP: { color: C.gold, fontSize: 12, fontFamily: 'DMSans-Medium' },
  disciplineDesc: { color: C.text2, fontSize: 14, lineHeight: 22, fontFamily: 'DMSans-Regular', marginBottom: SPACING.sm },
  scriptureRef: { color: C.gold, fontSize: 12, fontFamily: 'Lora-Italic', lineHeight: 18, marginBottom: SPACING.md },
  activeBadge: { backgroundColor: C.green + '20', paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.full },
  activeBadgeText: { color: C.green, fontSize: 10, fontFamily: 'DMSans-SemiBold' },
  doneBadge: { backgroundColor: C.gold + '20', paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.full },
  doneBadgeText: { color: C.gold, fontSize: 10, fontFamily: 'DMSans-SemiBold' },
  startBtn: { backgroundColor: C.gold, borderRadius: RADIUS.full, paddingVertical: 13, alignItems: 'center' },
  startBtnDone: { backgroundColor: C.border },
  startBtnText: { color: C.white, fontSize: 14, fontFamily: 'DMSans-SemiBold' },
  completeBtn: { backgroundColor: C.green, borderRadius: RADIUS.full, paddingVertical: 12, alignItems: 'center', marginTop: SPACING.sm },
  completeBtnText: { color: C.white, fontSize: 14, fontFamily: 'DMSans-SemiBold' },
  fastActiveInfo: { marginTop: SPACING.sm },
  fastStarted: { color: C.text3, fontSize: 12, fontFamily: 'DMSans-Regular', marginBottom: 8 },
  // Prayer builder
  catCard: { borderWidth: 2, borderRadius: RADIUS.lg, padding: SPACING.lg, alignItems: 'center', marginBottom: SPACING.lg },
  catEmoji: { fontSize: 44, marginBottom: 8 },
  catLabel: { fontSize: 22, fontFamily: 'Lora-SemiBold', marginBottom: 12 },
  catPrompt: { color: C.text2, fontSize: 14, textAlign: 'center', lineHeight: 22, fontFamily: 'DMSans-Regular' },
  formLabel: { color: C.text2, fontSize: 13, fontFamily: 'DMSans-Medium', marginBottom: 8 },
  prayerInput: { backgroundColor: C.surface, borderWidth: 1.5, borderColor: C.border, borderRadius: RADIUS.md, padding: 14, color: C.text, fontSize: 15, fontFamily: 'DMSans-Regular', minHeight: 160, textAlignVertical: 'top', marginBottom: SPACING.lg },
  prayerDoneEmoji: { fontSize: 56, textAlign: 'center', marginBottom: 16 },
  prayerDoneTitle: { color: C.text, fontSize: 28, fontFamily: 'Lora-SemiBold', textAlign: 'center', marginBottom: 8 },
  prayerDoneSubtitle: { color: C.text3, fontSize: 14, textAlign: 'center', fontFamily: 'DMSans-Regular', marginBottom: SPACING.xl },
  prayerSummary: { backgroundColor: C.surface, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: C.border },
  prayerSummaryHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, borderLeftWidth: 3, paddingLeft: 10, marginBottom: 8 },
  prayerSummaryIcon: { fontSize: 18 },
  prayerSummaryLabel: { fontSize: 14, fontFamily: 'DMSans-SemiBold' },
  prayerSummaryText: { color: C.text2, fontSize: 13, lineHeight: 20, fontFamily: 'DMSans-Regular' },
});
