import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors, RADIUS, SPACING } from '../constants/theme';

interface VerseCardProps {
  text: string; ref_: string;
  collected?: boolean; onCollect?: () => void;
  showCollect?: boolean;
}

export function VerseCard({ text, ref_, collected, onCollect, showCollect }: VerseCardProps) {
  const C = useThemeColors();
  const Wrapper = onCollect ? TouchableOpacity : View;
  return (
    <Wrapper onPress={onCollect} activeOpacity={0.88} style={styles.container}>
      <LinearGradient colors={C.isDark ? ['#1A2E4A','#0F1E38'] : ['#F0EDE6','#E8E4DC']} style={styles.inner}>
        {showCollect && (
          <View style={styles.header}>
            <Text style={[styles.headerLabel, { color: C.gold }]}>✨ Verse of the Day</Text>
            {collected
              ? <Text style={[styles.badge, { color: C.green }]}>✓ +5 XP</Text>
              : <Text style={[styles.tapHint, { color: C.text3 }]}>Tap to collect</Text>
            }
          </View>
        )}
        <Text style={[styles.verse, { color: C.text }]}>"{text}"</Text>
        <Text style={[styles.ref, { color: C.gold }]}>— {ref_}</Text>
      </LinearGradient>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: RADIUS.lg, overflow: 'hidden', marginBottom: SPACING.md },
  inner: { padding: SPACING.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  headerLabel: { fontSize: 12, fontFamily: 'DMSans-SemiBold', letterSpacing: 0.5 },
  badge: { fontSize: 12, fontFamily: 'DMSans-Medium' },
  tapHint: { fontSize: 11, fontFamily: 'DMSans-Regular' },
  verse: { fontSize: 16, fontFamily: 'Lora-Italic', lineHeight: 26, marginBottom: 10 },
  ref: { fontSize: 13, fontFamily: 'DMSans-SemiBold' },
});
