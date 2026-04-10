import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Switch, Alert, KeyboardAvoidingView, Platform, Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import { useThemeColors, SPACING, RADIUS } from '../constants/theme';
import { Storage, UserProfile, defaultProfile } from '../utils/storage';
import { setupAllNotifications } from '../services/notifications';
import { RINGTONE_OPTIONS } from './CallOverlayScreen';

export default function SettingsScreen() {
  const navigation = useNavigation<any>();
  const C = useThemeColors();
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [showRingtone, setShowRingtone] = useState(false);
  const [previewSound, setPreviewSound] = useState<Audio.Sound | null>(null);

  useFocusEffect(useCallback(() => {
    Storage.get<UserProfile>('profile', defaultProfile).then(p => {
      if (p) { setProfile(p); setName(p.name); }
    });
    return () => { previewSound?.stopAsync().catch(() => {}); };
  }, []));

  const update = (changes: Partial<UserProfile>) => setProfile(prev => ({ ...prev, ...changes }));

  const save = async () => {
    setSaving(true);
    try {
      const updated = { ...profile, name: name.trim() || profile.name };
      await Storage.set('profile', updated);
      await setupAllNotifications(updated);
      Alert.alert('Saved ✓', 'Your settings have been updated.');
    } finally { setSaving(false); }
  };

  const resetData = () => {
    Alert.alert('Reset All Data', 'This will permanently delete ALL your journal entries, progress, XP, and streak. This cannot be undone.',
      [{ text: 'Cancel', style: 'cancel' },
       { text: 'Reset Everything', style: 'destructive', onPress: async () => {
          await Storage.set('profile', defaultProfile);
          const keys = await Storage.getAllKeys();
          for (const k of keys) if (k !== 'profile') await Storage.remove(k);
          Alert.alert('Reset', 'All data cleared. Restart the app.');
        }}
      ]);
  };

  const pickCustomRingtone = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'audio/*', copyToCacheDirectory: true });
      if (result.canceled) return;
      const uri = result.assets[0].uri;
      update({ ringtone: 'custom', customRingtoneUri: uri });
      Alert.alert('Ringtone Set ✓', `Custom ringtone selected: ${result.assets[0].name}`);
    } catch (e) {
      Alert.alert('Error', 'Could not load audio file. Please try a different file.');
    }
  };

  const previewRingtone = async (id: string) => {
    if (previewSound) { await previewSound.stopAsync(); await previewSound.unloadAsync(); setPreviewSound(null); }
    // For built-in tones we just play a short vibration preview since we can't bundle audio
    // For custom, play the file
    if (id === 'custom' && profile.customRingtoneUri) {
      try {
        await Audio.setAudioModeAsync({ allowsRecordingIOS: false, playsInSilentModeIOS: false });
        const { sound } = await Audio.Sound.createAsync({ uri: profile.customRingtoneUri }, { shouldPlay: true, volume: 1 });
        setPreviewSound(sound);
        sound.setOnPlaybackStatusUpdate(s => { if (s.isLoaded && s.didJustFinish) { sound.unloadAsync(); setPreviewSound(null); } });
      } catch { Alert.alert('Preview Error', 'Could not play this audio file.'); }
    }
  };

  const S = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <View style={styles.settingRow}><Text style={[styles.settingLabel, { color: C.text }]}>{label}</Text>{children}</View>
  );

  const SliderRow = ({ label, value, min, max, step = 1, onChange }: any) => (
    <View style={styles.settingBlock}>
      <View style={styles.settingRowInner}>
        <Text style={[styles.settingLabel, { color: C.text }]}>{label}</Text>
        <Text style={[styles.settingValue, { color: C.gold }]}>{value}</Text>
      </View>
      <View style={styles.stepRow}>
        {Array.from({ length: (max - min) / step + 1 }, (_, i) => min + i * step).map(v => (
          <TouchableOpacity key={v}
            style={[styles.stepBtn, { backgroundColor: C.bg2, borderColor: C.border }, value === v && { backgroundColor: C.gold, borderColor: C.gold }]}
            onPress={() => onChange(v)}>
            <Text style={[styles.stepBtnText, { color: C.text2 }, value === v && { color: '#fff' }]}>{v}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const HourRow = ({ label, value, onChange }: any) => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const fmt = (h: number) => `${h === 0 ? 12 : h > 12 ? h - 12 : h}${h < 12 ? 'am' : 'pm'}`;
    return (
      <View style={styles.settingBlock}>
        <View style={styles.settingRowInner}>
          <Text style={[styles.settingLabel, { color: C.text }]}>{label}</Text>
          <Text style={[styles.settingValue, { color: C.gold }]}>{fmt(value)}</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
          {hours.map(h => (
            <TouchableOpacity key={h}
              style={[styles.hourBtn, { backgroundColor: C.bg2, borderColor: C.border }, value === h && { backgroundColor: C.gold, borderColor: C.gold }]}
              onPress={() => onChange(h)}>
              <Text style={[styles.hourBtnText, { color: C.text2 }, value === h && { color: '#fff' }]}>{fmt(h)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const currentRingtone = RINGTONE_OPTIONS.find(r => r.id === profile.ringtone) || RINGTONE_OPTIONS[0];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bg }]} edges={['top']}>
      <View style={[styles.navBar, { borderBottomColor: C.border + '60' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={C.text} />
        </TouchableOpacity>
        <Text style={[styles.navTitle, { color: C.text }]}>Settings</Text>
        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: C.gold }, saving && styles.saveBtnDisabled]} onPress={save} disabled={saving}>
          <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save'}</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

          {/* Personal */}
          <Text style={[styles.sectionTitle, { color: C.text3 }]}>PERSONAL</Text>
          <View style={[styles.card, { backgroundColor: C.surface, borderColor: C.border }]}>
            <Text style={[styles.settingLabel, { color: C.text }]}>Your Name</Text>
            <TextInput style={[styles.nameInput, { borderColor: C.border, color: C.text }]}
              value={name} onChangeText={setName}
              placeholder="Enter your name" placeholderTextColor={C.text3} />
          </View>

          {/* Calls */}
          <Text style={[styles.sectionTitle, { color: C.text3 }]}>GOD IS CALLING</Text>
          <View style={[styles.card, { backgroundColor: C.surface, borderColor: C.border }]}>
            <SliderRow label="Calls per day" value={profile.callsPerDay} min={1} max={5}
              onChange={(v: number) => update({ callsPerDay: v })} />
            <View style={[styles.divider, { backgroundColor: C.border }]} />
            <HourRow label="Call window start" value={profile.callWindowStart}
              onChange={(v: number) => update({ callWindowStart: v })} />
            <View style={[styles.divider, { backgroundColor: C.border }]} />
            <HourRow label="Call window end" value={profile.callWindowEnd}
              onChange={(v: number) => update({ callWindowEnd: v })} />
          </View>

          {/* Ringtone */}
          <Text style={[styles.sectionTitle, { color: C.text3 }]}>RINGTONE</Text>
          <View style={[styles.card, { backgroundColor: C.surface, borderColor: C.border }]}>
            <TouchableOpacity style={styles.ringtoneRow} onPress={() => setShowRingtone(true)}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.settingLabel, { color: C.text }]}>Call Ringtone</Text>
                <Text style={[styles.settingHint, { color: C.text3 }]}>{currentRingtone.label} — {currentRingtone.desc}</Text>
              </View>
              <Ionicons name="musical-notes-outline" size={20} color={C.gold} />
              <Ionicons name="chevron-forward" size={16} color={C.text3} />
            </TouchableOpacity>
            {profile.ringtone === 'custom' && profile.customRingtoneUri && (
              <View style={[styles.customRingtoneInfo, { borderTopColor: C.border }]}>
                <Ionicons name="checkmark-circle" size={16} color={C.green} />
                <Text style={[styles.settingHint, { color: C.green, flex: 1 }]}>Custom ringtone loaded</Text>
                <TouchableOpacity onPress={() => update({ ringtone: 'heavenly', customRingtoneUri: undefined })}>
                  <Ionicons name="close-circle" size={18} color={C.text3} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Reminders */}
          <Text style={[styles.sectionTitle, { color: C.text3 }]}>DAILY REMINDERS</Text>
          <View style={[styles.card, { backgroundColor: C.surface, borderColor: C.border }]}>
            <View style={styles.switchRow}>
              <View>
                <Text style={[styles.settingLabel, { color: C.text }]}>Morning reminder</Text>
                <Text style={[styles.settingHint, { color: C.text3 }]}>Start your day with God</Text>
              </View>
              <Switch value={profile.morningReminder} onValueChange={v => update({ morningReminder: v })}
                trackColor={{ true: C.gold, false: C.border }} thumbColor={C.white} />
            </View>
            {profile.morningReminder && (
              <HourRow label="Morning hour" value={profile.morningHour} onChange={(v: number) => update({ morningHour: v })} />
            )}
            <View style={[styles.divider, { backgroundColor: C.border }]} />
            <View style={styles.switchRow}>
              <View>
                <Text style={[styles.settingLabel, { color: C.text }]}>Midday check-in</Text>
                <Text style={[styles.settingHint, { color: C.text3 }]}>Pause in the middle of your day</Text>
              </View>
              <Switch value={profile.middayReminder} onValueChange={v => update({ middayReminder: v })}
                trackColor={{ true: C.gold, false: C.border }} thumbColor={C.white} />
            </View>
            <View style={[styles.divider, { backgroundColor: C.border }]} />
            <View style={styles.switchRow}>
              <View>
                <Text style={[styles.settingLabel, { color: C.text }]}>Evening reflection</Text>
                <Text style={[styles.settingHint, { color: C.text3 }]}>End your day with God</Text>
              </View>
              <Switch value={profile.eveningReminder} onValueChange={v => update({ eveningReminder: v })}
                trackColor={{ true: C.gold, false: C.border }} thumbColor={C.white} />
            </View>
            {profile.eveningReminder && (
              <HourRow label="Evening hour" value={profile.eveningHour} onChange={(v: number) => update({ eveningHour: v })} />
            )}
          </View>

          {/* Notifications */}
          <Text style={[styles.sectionTitle, { color: C.text3 }]}>NOTIFICATIONS</Text>
          <View style={[styles.card, { backgroundColor: C.surface, borderColor: C.border }]}>
            <View style={styles.switchRow}>
              <View>
                <Text style={[styles.settingLabel, { color: C.text }]}>Enable all notifications</Text>
                <Text style={[styles.settingHint, { color: C.text3 }]}>Calls, reminders, streak warnings</Text>
              </View>
              <Switch value={profile.notificationsEnabled} onValueChange={v => update({ notificationsEnabled: v })}
                trackColor={{ true: C.gold, false: C.border }} thumbColor={C.white} />
            </View>
            <View style={[styles.divider, { backgroundColor: C.border }]} />
            <View style={styles.switchRow}>
              <View>
                <Text style={[styles.settingLabel, { color: C.text }]}>Streak & penalty warnings</Text>
                <Text style={[styles.settingHint, { color: C.text3 }]}>Get notified before losing your streak</Text>
              </View>
              <Switch value={profile.penaltyWarnings} onValueChange={v => update({ penaltyWarnings: v })}
                trackColor={{ true: C.gold, false: C.border }} thumbColor={C.white} />
            </View>
          </View>

          {/* Danger */}
          <Text style={[styles.sectionTitle, { color: C.text3 }]}>DANGER ZONE</Text>
          <TouchableOpacity style={[styles.dangerBtn, { borderColor: C.red + '40', backgroundColor: C.red + '10' }]} onPress={resetData}>
            <Ionicons name="trash-outline" size={18} color={C.red} />
            <Text style={[styles.dangerBtnText, { color: C.red }]}>Reset All Data</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Ringtone Picker Modal */}
      <Modal visible={showRingtone} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: C.bg }]} edges={['top', 'bottom']}>
          <View style={[styles.modalHeader, { borderBottomColor: C.border }]}>
            <Text style={[styles.modalTitle, { color: C.text }]}>Choose Ringtone</Text>
            <TouchableOpacity onPress={() => { previewSound?.stopAsync(); setShowRingtone(false); }}>
              <Ionicons name="close" size={24} color={C.text} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: SPACING.lg }}>
            <Text style={[styles.modalNote, { color: C.text3 }]}>The call will vibrate with your selected pattern. Upload a custom audio file to add a sound.</Text>

            {RINGTONE_OPTIONS.filter(r => r.id !== 'custom').map(r => (
              <TouchableOpacity key={r.id}
                style={[styles.ringtoneOption, { backgroundColor: C.surface, borderColor: profile.ringtone === r.id ? C.gold : C.border }]}
                onPress={() => { update({ ringtone: r.id }); previewRingtone(r.id); }}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.ringtoneLabel, { color: C.text }]}>{r.label}</Text>
                  <Text style={[styles.ringtoneDesc, { color: C.text3 }]}>{r.desc}</Text>
                </View>
                <View style={styles.ringtoneRight}>
                  {profile.ringtone === r.id && <Ionicons name="checkmark-circle" size={22} color={C.gold} />}
                </View>
              </TouchableOpacity>
            ))}

            <View style={[styles.divider, { backgroundColor: C.border, marginVertical: SPACING.md }]} />
            <Text style={[styles.sectionTitle, { color: C.text3, marginBottom: SPACING.sm }]}>CUSTOM RINGTONE</Text>
            <TouchableOpacity
              style={[styles.uploadBtn, { backgroundColor: C.surface, borderColor: C.border }]}
              onPress={async () => {
                await pickCustomRingtone();
                setShowRingtone(false);
              }}>
              <Ionicons name="musical-note-outline" size={22} color={C.gold} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.ringtoneLabel, { color: C.text }]}>Upload from Phone</Text>
                <Text style={[styles.ringtoneDesc, { color: C.text3 }]}>Supports MP3, AAC, WAV, OGG</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={C.text3} />
            </TouchableOpacity>

            {profile.ringtone === 'custom' && profile.customRingtoneUri && (
              <TouchableOpacity
                style={[styles.ringtoneOption, { backgroundColor: C.surface, borderColor: C.gold }]}
                onPress={() => { update({ ringtone: 'custom' }); previewRingtone('custom'); }}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.ringtoneLabel, { color: C.gold }]}>✓ Custom File Loaded</Text>
                  <Text style={[styles.ringtoneDesc, { color: C.text3 }]}>Tap to preview</Text>
                </View>
                <Ionicons name="play-circle-outline" size={24} color={C.gold} />
              </TouchableOpacity>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderBottomWidth: 1 },
  navTitle: { fontSize: 16, fontFamily: 'DMSans-SemiBold' },
  saveBtn: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: RADIUS.full },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: { color: '#FFFFFF', fontSize: 13, fontFamily: 'DMSans-SemiBold' },
  content: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm },
  sectionTitle: { fontSize: 11, fontFamily: 'DMSans-SemiBold', letterSpacing: 1, marginBottom: SPACING.sm, marginTop: SPACING.lg },
  card: { borderRadius: RADIUS.lg, padding: SPACING.lg, borderWidth: 1 },
  nameInput: { borderWidth: 1, borderRadius: RADIUS.md, padding: 14, fontSize: 16, fontFamily: 'DMSans-Regular', marginTop: 8 },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  settingRowInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  settingBlock: { marginBottom: SPACING.sm },
  settingLabel: { fontSize: 14, fontFamily: 'DMSans-Medium' },
  settingHint: { fontSize: 12, fontFamily: 'DMSans-Regular', marginTop: 2 },
  settingValue: { fontSize: 14, fontFamily: 'DMSans-SemiBold' },
  divider: { height: 1, marginVertical: SPACING.md },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  stepBtn: { width: 44, height: 36, borderRadius: RADIUS.sm, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  stepBtnText: { fontSize: 14, fontFamily: 'DMSans-Medium' },
  hourBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: RADIUS.sm, marginRight: 8, borderWidth: 1 },
  hourBtnText: { fontSize: 12, fontFamily: 'DMSans-Medium' },
  ringtoneRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  customRingtoneInfo: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: SPACING.md, marginTop: SPACING.sm, borderTopWidth: 1 },
  dangerBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: RADIUS.md, padding: SPACING.md, borderWidth: 1 },
  dangerBtnText: { fontSize: 14, fontFamily: 'DMSans-Medium' },
  modalContainer: { flex: 1 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.lg, borderBottomWidth: 1 },
  modalTitle: { fontSize: 18, fontFamily: 'Lora-SemiBold' },
  modalNote: { fontSize: 13, fontFamily: 'DMSans-Regular', lineHeight: 20, marginBottom: SPACING.lg },
  ringtoneOption: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1.5 },
  ringtoneLabel: { fontSize: 14, fontFamily: 'DMSans-SemiBold', marginBottom: 2 },
  ringtoneDesc: { fontSize: 12, fontFamily: 'DMSans-Regular' },
  ringtoneRight: { width: 28 },
  uploadBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: RADIUS.md, padding: SPACING.md, borderWidth: 1, marginBottom: SPACING.sm },
});
