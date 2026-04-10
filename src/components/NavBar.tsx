import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors, SPACING } from '../constants/theme';

interface NavBarProps {
  title: string;
  onBack?: () => void;
  rightIcon?: string;
  rightLabel?: string;
  onRight?: () => void;
  rightColor?: string;
}

export function NavBar({ title, onBack, rightIcon, rightLabel, onRight, rightColor }: NavBarProps) {
  const C = useThemeColors();
  return (
    <View style={[styles.nav, { borderBottomColor: C.border + '60' }]}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="chevron-back" size={24} color={C.text} />
        </TouchableOpacity>
      ) : <View style={{ width: 24 }} />}
      <Text style={[styles.title, { color: C.text }]}>{title}</Text>
      {onRight ? (
        <TouchableOpacity onPress={onRight} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          {rightIcon
            ? <Ionicons name={rightIcon as any} size={22} color={rightColor ?? C.text} />
            : <Text style={[styles.rightLabel, { color: rightColor ?? C.gold }]}>{rightLabel}</Text>
          }
        </TouchableOpacity>
      ) : <View style={{ width: 24 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderBottomWidth: 1 },
  title: { fontSize: 16, fontFamily: 'DMSans-SemiBold' },
  rightLabel: { fontSize: 14, fontFamily: 'DMSans-SemiBold' },
});
