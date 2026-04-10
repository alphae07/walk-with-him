import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColors, RADIUS } from '../constants/theme';
import { getLevelInfo } from '../utils/xp';

interface LevelBadgeProps { xp: number; size?: 'sm' | 'md' | 'lg'; }

export function LevelBadge({ xp, size = 'md' }: LevelBadgeProps) {
  const C = useThemeColors();
  const level = getLevelInfo(xp);
  const dim = size === 'sm' ? 32 : size === 'lg' ? 64 : 44;
  const fontSize = size === 'sm' ? 14 : size === 'lg' ? 30 : 20;
  return (
    <View style={[styles.badge, { width: dim, height: dim, borderRadius: dim/2, backgroundColor: C.gold + '20', borderColor: C.gold, borderWidth: size === 'lg' ? 3 : 2 }]}>
      <Text style={{ fontSize }}>{level.emoji}</Text>
    </View>
  );
}

const styles = StyleSheet.create({ badge: { alignItems: 'center', justifyContent: 'center' } });
