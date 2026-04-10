import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColors } from '../constants/theme';
import { getLevelInfo, getXPProgress } from '../utils/xp';

interface XPBarProps { xp: number; compact?: boolean; }

export function XPBar({ xp, compact }: XPBarProps) {
  const C = useThemeColors();
  const level = getLevelInfo(xp);
  const prog = getXPProgress(xp);
  const pct = Math.min(Math.max(prog.progress * 100, 0), 100);

  if (compact) {
    return (
      <View style={styles.compact}>
        <View style={[styles.bar, { backgroundColor: C.border }]}>
          <View style={[styles.fill, { width: `${pct}%` as any, backgroundColor: C.gold }]} />
        </View>
        <Text style={[styles.xpText, { color: C.text3 }]}>{xp} XP</Text>
      </View>
    );
  }

  return (
    <View>
      <View style={styles.labelRow}>
        <Text style={[styles.levelLabel, { color: C.gold }]}>{level.name}</Text>
        <Text style={[styles.xpLabel, { color: C.text3 }]}>{xp} XP</Text>
      </View>
      <View style={[styles.bar, { backgroundColor: C.border }]}>
        <View style={[styles.fill, { width: `${pct}%` as any, backgroundColor: C.gold }]} />
      </View>
      {prog.next && (
        <Text style={[styles.nextLabel, { color: C.text3 }]}>{prog.remaining} XP to {prog.next.name}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  compact: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  levelLabel: { fontSize: 13, fontFamily: 'DMSans-Medium' },
  xpLabel: { fontSize: 12, fontFamily: 'DMSans-Regular' },
  bar: { height: 6, borderRadius: 3, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3 },
  nextLabel: { fontSize: 11, marginTop: 4, fontFamily: 'DMSans-Regular' },
  xpText: { fontSize: 11, fontFamily: 'DMSans-Regular' },
});
