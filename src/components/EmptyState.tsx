import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColors, SPACING } from '../constants/theme';

interface EmptyStateProps { emoji?: string; title: string; subtitle?: string; }

export function EmptyState({ emoji = '🙏', title, subtitle }: EmptyStateProps) {
  const C = useThemeColors();
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.title, { color: C.text }]}>{title}</Text>
      {subtitle && <Text style={[styles.subtitle, { color: C.text3 }]}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', padding: SPACING.xxl },
  emoji: { fontSize: 48, marginBottom: 16 },
  title: { fontSize: 16, fontFamily: 'DMSans-SemiBold', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, fontFamily: 'DMSans-Regular', textAlign: 'center', lineHeight: 22 },
});
