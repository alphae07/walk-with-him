import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColors, RADIUS } from '../constants/theme';

interface StatCardProps { emoji: string; value: string | number; label: string; width?: number; }

export function StatCard({ emoji, value, label, width }: StatCardProps) {
  const C = useThemeColors();
  return (
    <View style={[styles.card, { backgroundColor: C.surface, borderColor: C.border, width }]}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.value, { color: C.text }]}>{value}</Text>
      <Text style={[styles.label, { color: C.text3 }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: RADIUS.md, padding: 12, alignItems: 'center', borderWidth: 1 },
  emoji: { fontSize: 22, marginBottom: 6 },
  value: { fontSize: 20, fontFamily: 'Lora-SemiBold', marginBottom: 4 },
  label: { fontSize: 10, fontFamily: 'DMSans-Regular', textAlign: 'center' },
});
