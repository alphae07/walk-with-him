import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors, SPACING, RADIUS } from '../constants/theme';

interface GameHeaderProps { title: string; current: number; total: number; onExit: () => void; }

export function GameHeader({ title, current, total, onExit }: GameHeaderProps) {
  const C = useThemeColors();
  const progress = current / total;
  return (
    <View style={[styles.header, { borderBottomColor: C.border + '80' }]}>
      <TouchableOpacity onPress={onExit} style={[styles.exitBtn, { backgroundColor: C.bg3 }]}>
        <Text style={[styles.exitText, { color: C.text2 }]}>✕ Exit</Text>
      </TouchableOpacity>
      <View style={styles.center}>
        <Text style={[styles.title, { color: C.text }]}>{title}</Text>
        <View style={[styles.progBar, { backgroundColor: C.border }]}>
          <View style={[styles.progFill, { width: `${progress * 100}%` as any, backgroundColor: C.gold }]} />
        </View>
      </View>
      <Text style={[styles.counter, { color: C.text3 }]}>{current}/{total}</Text>
    </View>
  );
}

interface GameResultProps { title: string; score: number; total: number; xpEarned: number; onExit: () => void; message?: string; }

export function GameResult({ title, score, total, xpEarned, onExit, message }: GameResultProps) {
  const C = useThemeColors();
  const percent = Math.round((score / total) * 100);
  const emoji = percent >= 80 ? '🏆' : percent >= 60 ? '💪' : '📖';
  const note = message ?? (
    percent >= 80 ? 'Outstanding! The Word is working in you.' :
    percent >= 60 ? 'Good work. Keep studying. The more you know Him, the more you love Him.' :
    "Don't be discouraged. Every question is a chance to learn."
  );

  return (
    <SafeAreaView style={[styles.resultContainer, { backgroundColor: C.bg }]} edges={['top']}>
      <View style={styles.resultContent}>
        <Text style={styles.resultEmoji}>{emoji}</Text>
        <Text style={[styles.resultTitle, { color: C.text }]}>{title}</Text>
        <Text style={[styles.resultScore, { color: C.gold }]}>{score}/{total}</Text>
        <Text style={[styles.resultPercent, { color: C.text2 }]}>{percent}% correct</Text>
        {xpEarned > 0 && <Text style={[styles.resultXP, { color: C.green }]}>+{xpEarned} XP earned! 🎉</Text>}
        <View style={[styles.resultNote, { backgroundColor: C.surface, borderColor: C.border }]}>
          <Text style={[styles.resultNoteText, { color: C.text2 }]}>{note}</Text>
        </View>
        <TouchableOpacity style={[styles.doneBtn, { backgroundColor: C.gold }]} onPress={onExit}>
          <Text style={styles.doneBtnText}>Back to Games</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderBottomWidth: 1, gap: 8 },
  exitBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: RADIUS.sm },
  exitText: { fontSize: 12, fontFamily: 'DMSans-Medium' },
  center: { flex: 1, alignItems: 'center', gap: 4 },
  title: { fontSize: 14, fontFamily: 'DMSans-SemiBold' },
  progBar: { width: '100%', height: 4, borderRadius: 2, overflow: 'hidden' },
  progFill: { height: '100%', borderRadius: 2 },
  counter: { fontSize: 12, fontFamily: 'DMSans-Regular', width: 32, textAlign: 'right' },
  resultContainer: { flex: 1 },
  resultContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl },
  resultEmoji: { fontSize: 72, marginBottom: 16 },
  resultTitle: { fontSize: 24, fontFamily: 'Lora-SemiBold', textAlign: 'center', marginBottom: 8 },
  resultScore: { fontSize: 52, fontFamily: 'Lora-SemiBold', textAlign: 'center' },
  resultPercent: { fontSize: 16, fontFamily: 'DMSans-Regular', textAlign: 'center', marginBottom: 8 },
  resultXP: { fontSize: 18, fontFamily: 'DMSans-SemiBold', textAlign: 'center', marginBottom: SPACING.lg },
  resultNote: { borderRadius: RADIUS.md, padding: SPACING.md, borderWidth: 1, marginBottom: SPACING.xl, width: '100%' },
  resultNoteText: { fontSize: 14, textAlign: 'center', lineHeight: 22, fontFamily: 'DMSans-Regular' },
  doneBtn: { width: '100%', borderRadius: RADIUS.full, paddingVertical: 15, alignItems: 'center' },
  doneBtnText: { color: '#FFFFFF', fontSize: 15, fontFamily: 'DMSans-SemiBold' },
});
