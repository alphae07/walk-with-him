import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColors, SPACING, RADIUS } from '../constants/theme';

interface SectionCardProps { children: React.ReactNode; style?: any; }

export function SectionCard({ children, style }: SectionCardProps) {
  const C = useThemeColors();
  return <View style={[styles.card, { backgroundColor: C.surface, borderColor: C.border }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: { borderRadius: RADIUS.lg, padding: SPACING.lg, borderWidth: 1 },
});
