import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Switch, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { Storage, UserProfile, defaultProfile } from '../utils/storage';
import { setupAllNotifications } from '../services/notifications';

export default function SettingsScreen() {
  const navigation = useNavigation<any>();
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  useFocusEffect(useCallback(() => {
    Storage.get<UserProfile>('profile', defaultProfile).then(p => {
      if (p) { setProfile(p); setName(p.name); }
    });
  }, []));

  const update = (changes: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...changes }));
  };

  const save = async () => {
    setSaving(true);
    try {
      const updated = { ...profile, name: name.trim() || profile.name };
      await Storage.set('profile', updated);
      await setupAllNotifications(updated);
      Alert.alert('Saved', 'Your settings have been updated.');
    } finally {
      setSaving(false);
    }
  };

  const resetData = () => {
    Alert.alert(
      'Reset All Data',
      'This will permanently delete ALL your journal entries, progress, XP, and streak. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Everything', style: 'destructive',
          onPress: async () => {
            await Storage.set('profile', defaultProfile);
            const keys = await Storage.getAllKeys();
            for (const k of keys) if (k !== 'profile') await Storage.remove(k);
            Alert.alert('Reset', 'All data cleared. Restart the app.');
          }
        }
      ]
    );
  };

  const S = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <View style={styles.settingRow}>
      <Text style={styles.settingLabel}>{label}</Text>
      {children}
    </View>
  );

  const SliderRow = ({ label, value, min, max, step = 1, onChange }: any) => (
    <View style={styles.settingBlock}>
      <View style={styles.settingRowInner}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={styles.settingValue}>{value}</Text>
      </View>
      <View style={styles.stepRow}>
        {Array.from({ length: (max - min) / step + 1 }, (_, i) => min + i * step).map(v => (
          <TouchableOpacity
            key={v}
            style={[styles.stepBtn, value === v && styles.stepBtnActive]}
            onPress={() => onChange(v)}
          >
            <Text style={[styles.stepBtnText, value === v && styles.stepBtnTextActive]}>{v}</Text>
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
          <Text style={styles.settingLabel}>{label}</Text>
          <Text style={styles.settingValue}>{fmt(value)}</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
          {hours.map(h => (
            <TouchableOpacity
              key={h}
              style={[styles.hourBtn, value === h && styles.hourBtnActive]}
              onPress={() => onChange(h)}
            >
              <Text style={[styles.hourBtnText, value === h && styles.hourBtnTextActive]}>{fmt(h)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Settings</Text>
        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={save}
          disabled={saving}
        >
          <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save'}</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

          {/* Personal */}
          <Text style={styles.sectionTitle}>PERSONAL</Text>
          <View style={styles.card}>
            <Text style={styles.settingLabel}>Your Name</Text>
            <TextInput
              style={styles.nameInput}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor={COLORS.text3}
            />
          </View>

          {/* Calls */}
          <Text style={styles.sectionTitle}>GOD IS CALLING</Text>
          <View style={styles.card}>
            <SliderRow
              label="Calls per day"
              value={profile.callsPerDay}
              min={1} max={5}
              onChange={(v: number) => update({ callsPerDay: v })}
            />
            <View style={styles.divider} />
            <HourRow
              label="Call window start"
              value={profile.callWindowStart}
              onChange={(v: number) => update({ callWindowStart: v })}
            />
            <View style={styles.divider} />
            <HourRow
              label="Call window end"
              value={profile.callWindowEnd}
              onChange={(v: number) => update({ callWindowEnd: v })}
            />
          </View>

          {/* Reminders */}
          <Text style={styles.sectionTitle}>DAILY REMINDERS</Text>
          <View style={styles.card}>
            <View style={styles.switchRow}>
              <View>
                <Text style={styles.settingLabel}>Morning reminder</Text>
                <Text style={styles.settingHint}>Start your day with God</Text>
              </View>
              <Switch
                value={profile.morningReminder}
                onValueChange={v => update({ morningReminder: v })}
                trackColor={{ true: COLORS.gold, false: COLORS.border }}
                thumbColor={COLORS.white}
              />
            </View>
            {profile.morningReminder && (
              <HourRow label="Morning hour" value={profile.morningHour} onChange={(v: number) => update({ morningHour: v })} />
            )}
            <View style={styles.divider} />
            <View style={styles.switchRow}>
              <View>
                <Text style={styles.settingLabel}>Midday check-in</Text>
                <Text style={styles.settingHint}>Pause in the middle of your day</Text>
              </View>
              <Switch
                value={profile.middayReminder}
                onValueChange={v => update({ middayReminder: v })}
                trackColor={{ true: COLORS.gold, false: COLORS.border }}
                thumbColor={COLORS.white}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.switchRow}>
              <View>
                <Text style={styles.settingLabel}>Evening reflection</Text>
                <Text style={styles.settingHint}>End your day in His presence</Text>
              </View>
              <Switch
                value={profile.eveningReminder}
                onValueChange={v => update({ eveningReminder: v })}
                trackColor={{ true: COLORS.gold, false: COLORS.border }}
                thumbColor={COLORS.white}
              />
            </View>
            {profile.eveningReminder && (
              <HourRow label="Evening hour" value={profile.eveningHour} onChange={(v: number) => update({ eveningHour: v })} />
            )}
          </View>

          {/* Notifications */}
          <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>
          <View style={styles.card}>
            <View style={styles.switchRow}>
              <View>
                <Text style={styles.settingLabel}>Enable all notifications</Text>
                <Text style={styles.settingHint}>Calls, reminders, streak warnings</Text>
              </View>
              <Switch
                value={profile.notificationsEnabled}
                onValueChange={v => update({ notificationsEnabled: v })}
                trackColor={{ true: COLORS.gold, false: COLORS.border }}
                thumbColor={COLORS.white}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.switchRow}>
              <View>
                <Text style={styles.settingLabel}>Streak & penalty warnings</Text>
                <Text style={styles.settingHint}>Get notified before losing your streak</Text>
              </View>
              <Switch
                value={profile.penaltyWarnings}
                onValueChange={v => update({ penaltyWarnings: v })}
                trackColor={{ true: COLORS.gold, false: COLORS.border }}
                thumbColor={COLORS.white}
              />
            </View>
          </View>

          {/* Danger Zone */}
          <Text style={styles.sectionTitle}>DANGER ZONE</Text>
          <TouchableOpacity style={styles.dangerBtn} onPress={resetData}>
            <Ionicons name="trash-outline" size={18} color={COLORS.red} />
            <Text style={styles.dangerBtnText}>Reset All Data</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
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
  saveBtn: { backgroundColor: COLORS.gold, paddingHorizontal: 18, paddingVertical: 8, borderRadius: RADIUS.full },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: { color: COLORS.white, fontSize: 13, fontFamily: 'DMSans-SemiBold' },
  content: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm },
  sectionTitle: { color: COLORS.text3, fontSize: 11, fontFamily: 'DMSans-SemiBold', letterSpacing: 1, marginBottom: SPACING.sm, marginTop: SPACING.lg },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  nameInput: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md,
    padding: 14, color: COLORS.text, fontSize: 16, fontFamily: 'DMSans-Regular',
    marginTop: 8,
  },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  settingRowInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  settingBlock: { marginBottom: SPACING.sm },
  settingLabel: { color: COLORS.text, fontSize: 14, fontFamily: 'DMSans-Medium' },
  settingHint: { color: COLORS.text3, fontSize: 12, fontFamily: 'DMSans-Regular', marginTop: 2 },
  settingValue: { color: COLORS.gold, fontSize: 14, fontFamily: 'DMSans-SemiBold' },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.md },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  stepBtn: {
    width: 44, height: 36, borderRadius: RADIUS.sm,
    backgroundColor: COLORS.bg2, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  stepBtnActive: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  stepBtnText: { color: COLORS.text2, fontSize: 14, fontFamily: 'DMSans-Medium' },
  stepBtnTextActive: { color: COLORS.white },
  hourBtn: {
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: RADIUS.sm,
    backgroundColor: COLORS.bg2, marginRight: 8, borderWidth: 1, borderColor: COLORS.border,
  },
  hourBtnActive: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  hourBtnText: { color: COLORS.text2, fontSize: 12, fontFamily: 'DMSans-Medium' },
  hourBtnTextActive: { color: COLORS.white },
  dangerBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.redLight + '10', borderRadius: RADIUS.md,
    padding: SPACING.md, borderWidth: 1, borderColor: COLORS.red + '40',
  },
  dangerBtnText: { color: COLORS.red, fontSize: 14, fontFamily: 'DMSans-Medium' },
});
