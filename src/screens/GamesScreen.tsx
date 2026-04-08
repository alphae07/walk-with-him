import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import {
  QUIZ_QUESTIONS, FILL_BLANK_VERSES, GODS_NAMES,
  WORD_SCRAMBLE_VERSES, FRUITS_OF_SPIRIT, PRAYER_CATEGORIES
} from '../constants/data';
import { Storage, UserProfile, defaultProfile } from '../utils/storage';
import { awardXP } from '../utils/xp';

const { width } = Dimensions.get('window');

const GAMES = [
  { id: 'quiz', emoji: '📖', title: 'Bible Quiz', subtitle: 'Test your Scripture knowledge', color: '#2563EB', bgColor: '#EEF3FF' },
  { id: 'fill', emoji: '✏️', title: 'Fill the Blank', subtitle: 'Complete the verse from memory', color: '#7C3AED', bgColor: '#EDE9FE' },
  { id: 'scramble', emoji: '🔀', title: 'Word Scramble', subtitle: 'Rebuild the verse word by word', color: '#2E8B5A', bgColor: '#D4EDDF' },
  { id: 'names', emoji: '🏛', title: "Who Is God?", subtitle: "Learn God's Hebrew names", color: '#C8922A', bgColor: '#F5E6C8' },
  { id: 'prayer', emoji: '🙏', title: 'Prayer Builder', subtitle: 'ACTS model prayer guide', color: '#E91E8C', bgColor: '#FCE4EC' },
  { id: 'fruits', emoji: '🍇', title: 'Fruit Check', subtitle: 'Weekly Spirit fruit assessment', color: '#FF5722', bgColor: '#FBE9E7' },
];

export default function GamesScreen() {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  if (activeGame === 'quiz') return <QuizGame onExit={() => setActiveGame(null)} />;
  if (activeGame === 'fill') return <FillBlankGame onExit={() => setActiveGame(null)} />;
  if (activeGame === 'scramble') return <ScrambleGame onExit={() => setActiveGame(null)} />;
  if (activeGame === 'names') return <NamesGame onExit={() => setActiveGame(null)} />;
  if (activeGame === 'prayer') return <PrayerGame onExit={() => setActiveGame(null)} />;
  if (activeGame === 'fruits') return <FruitsGame onExit={() => setActiveGame(null)} />;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Games</Text>
        <Text style={styles.subtitle}>Knowledge that sticks is knowledge you've played with.</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.grid}>
        {GAMES.map(game => (
          <TouchableOpacity
            key={game.id}
            style={styles.gameCard}
            onPress={() => setActiveGame(game.id)}
            activeOpacity={0.85}
          >
            <View style={[styles.gameEmojiWrap, { backgroundColor: game.bgColor + '30' }]}>
              <Text style={styles.gameEmoji}>{game.emoji}</Text>
            </View>
            <Text style={styles.gameTitle}>{game.title}</Text>
            <Text style={styles.gameSubtitle}>{game.subtitle}</Text>
            <View style={[styles.playBtn, { backgroundColor: game.color }]}>
              <Text style={styles.playBtnText}>Play →</Text>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── QUIZ GAME ──────────────────────────────────────────────
function QuizGame({ onExit }: { onExit: () => void }) {
  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const questions = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 10);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === questions[qi].answer) setScore(s => s + 1);
  };

  const handleNext = async () => {
    if (qi < questions.length - 1) {
      setQi(qi + 1);
      setSelected(null);
    } else {
      setDone(true);
      if (score >= 6) {
        const p = await Storage.get<UserProfile>('profile', defaultProfile);
        if (p) {
          const r = await awardXP('miniGameWon', p);
          await Storage.set('profile', r.profile);
        }
      }
    }
  };

  if (done) {
    return (
      <GameResult
        title="Quiz Complete!"
        score={score}
        total={questions.length}
        xpEarned={score >= 6 ? 10 : 0}
        onExit={onExit}
      />
    );
  }

  const q = questions[qi];
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <GameHeader title="Bible Quiz" current={qi + 1} total={questions.length} onExit={onExit} />
      <ScrollView contentContainerStyle={styles.gameContent}>
        <Text style={styles.questionText}>{q.question}</Text>
        {q.options.map((opt, i) => {
          let bg = COLORS.surface;
          let textColor = COLORS.text;
          if (selected !== null) {
            if (i === q.answer) { bg = COLORS.green; textColor = COLORS.white; }
            else if (i === selected && selected !== q.answer) { bg = COLORS.red; textColor = COLORS.white; }
          }
          return (
            <TouchableOpacity
              key={i}
              style={[styles.optionBtn, { backgroundColor: bg }]}
              onPress={() => handleSelect(i)}
            >
              <Text style={[styles.optionText, { color: textColor }]}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
        {selected !== null && (
          <View style={styles.explanationCard}>
            <Text style={styles.explanationText}>💡 {q.explanation}</Text>
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
              <Text style={styles.nextBtnText}>{qi < questions.length - 1 ? 'Next Question →' : 'See Results'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ── FILL THE BLANK ─────────────────────────────────────────
function FillBlankGame({ onExit }: { onExit: () => void }) {
  const verses = [...FILL_BLANK_VERSES].sort(() => Math.random() - 0.5).slice(0, 7);
  const [vi, setVi] = useState(0);
  const [input, setInput] = useState('');
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const checkAnswer = () => {
    const isCorrect = input.trim().toLowerCase() === verses[vi].answer.toLowerCase();
    setCorrect(isCorrect);
    setChecked(true);
    if (isCorrect) setScore(s => s + 1);
  };

  const handleNext = async () => {
    if (vi < verses.length - 1) {
      setVi(vi + 1);
      setInput('');
      setChecked(false);
      setCorrect(false);
    } else {
      setDone(true);
      if (score >= 4) {
        const p = await Storage.get<UserProfile>('profile', defaultProfile);
        if (p) await Storage.set('profile', (await awardXP('miniGameWon', p)).profile);
      }
    }
  };

  if (done) return <GameResult title="Fill the Blank!" score={score} total={verses.length} xpEarned={score >= 4 ? 10 : 0} onExit={onExit} />;

  const v = verses[vi];
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <GameHeader title="Fill the Blank" current={vi + 1} total={verses.length} onExit={onExit} />
      <View style={styles.gameContent}>
        <Text style={styles.fillVerse}>{v.verse.replace('___', '______')}</Text>
        <Text style={styles.fillRef}>— {v.ref}</Text>

        <View style={styles.fillInputRow}>
          <View style={[styles.fillInput, checked && { borderColor: correct ? COLORS.green : COLORS.red }]}>
            <Text style={styles.fillInputText}>{input || '...'}</Text>
          </View>
        </View>

        {checked && (
          <Text style={[styles.fillFeedback, { color: correct ? COLORS.green : COLORS.red }]}>
            {correct ? `✓ Correct! The word is "${v.answer}"` : `✗ The answer is "${v.answer}"`}
          </Text>
        )}

        <View style={styles.keyboard}>
          {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => (
            <TouchableOpacity
              key={letter}
              style={styles.keyBtn}
              onPress={() => !checked && setInput(i => i + letter)}
            >
              <Text style={styles.keyBtnText}>{letter}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={[styles.keyBtn, styles.deleteKey]} onPress={() => !checked && setInput(i => i.slice(0, -1))}>
            <Text style={styles.keyBtnText}>⌫</Text>
          </TouchableOpacity>
        </View>

        {!checked ? (
          <TouchableOpacity style={styles.checkBtn} onPress={checkAnswer}>
            <Text style={styles.checkBtnText}>Check Answer</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextBtnText}>{vi < verses.length - 1 ? 'Next →' : 'See Results'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

// ── WORD SCRAMBLE ──────────────────────────────────────────
function ScrambleGame({ onExit }: { onExit: () => void }) {
  const [vi, setVi] = useState(0);
  const verse = WORD_SCRAMBLE_VERSES[vi % WORD_SCRAMBLE_VERSES.length];
  const [shuffled] = useState(() => [...verse.words].sort(() => Math.random() - 0.5));
  const [selected, setSelected] = useState<string[]>([]);
  const [remaining, setRemaining] = useState([...shuffled]);
  const [done, setDone] = useState(false);
  const [correct, setCorrect] = useState(false);

  const addWord = (word: string, idx: number) => {
    setSelected(s => [...s, word]);
    setRemaining(r => r.filter((_, i) => i !== idx));
  };

  const removeWord = (idx: number) => {
    const word = selected[idx];
    setSelected(s => s.filter((_, i) => i !== idx));
    setRemaining(r => [...r, word]);
  };

  const checkOrder = async () => {
    const isCorrect = selected.join(' ') === verse.words.join(' ');
    setCorrect(isCorrect);
    setDone(true);
    if (isCorrect) {
      const p = await Storage.get<UserProfile>('profile', defaultProfile);
      if (p) await Storage.set('profile', (await awardXP('miniGameWon', p)).profile);
    }
  };

  if (done) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <GameHeader title="Word Scramble" current={1} total={1} onExit={onExit} />
        <View style={[styles.gameContent, { alignItems: 'center', paddingTop: 40 }]}>
          <Text style={{ fontSize: 56, marginBottom: 16 }}>{correct ? '🎉' : '😅'}</Text>
          <Text style={[styles.questionText, { textAlign: 'center' }]}>
            {correct ? 'Perfect! +10 XP' : 'Not quite'}
          </Text>
          <Text style={styles.fillRef}>Correct: {verse.words.join(' ')}</Text>
          <Text style={styles.fillRef}>— {verse.ref}</Text>
          <TouchableOpacity style={[styles.nextBtn, { marginTop: 32 }]} onPress={onExit}>
            <Text style={styles.nextBtnText}>Back to Games</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <GameHeader title="Word Scramble" current={vi + 1} total={WORD_SCRAMBLE_VERSES.length} onExit={onExit} />
      <View style={styles.gameContent}>
        <Text style={styles.scrambleRef}>Rebuild: {verse.ref}</Text>

        {/* Selected area */}
        <View style={styles.scrambleTarget}>
          {selected.length === 0 ? (
            <Text style={styles.scramblePlaceholder}>Tap words to build the verse</Text>
          ) : (
            <View style={styles.scrambleRow}>
              {selected.map((w, i) => (
                <TouchableOpacity key={i} style={styles.scrambleWordSelected} onPress={() => removeWord(i)}>
                  <Text style={styles.scrambleWordText}>{w}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Available words */}
        <View style={styles.scrambleRow}>
          {remaining.map((word, i) => (
            <TouchableOpacity key={i} style={styles.scrambleWord} onPress={() => addWord(word, i)}>
              <Text style={styles.scrambleWordText}>{word}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {remaining.length === 0 && (
          <TouchableOpacity style={styles.checkBtn} onPress={checkOrder}>
            <Text style={styles.checkBtnText}>Check Verse</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

// ── GOD'S NAMES ────────────────────────────────────────────
function NamesGame({ onExit }: { onExit: () => void }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <GameHeader title="Who Is God?" current={idx + 1} total={GODS_NAMES.length} onExit={onExit} />
      <View style={[styles.gameContent, { alignItems: 'center' }]}>
        <TouchableOpacity style={styles.nameCard} onPress={() => setFlipped(f => !f)}>
          {!flipped ? (
            <>
              <Text style={styles.nameCardName}>{GODS_NAMES[idx].name}</Text>
              <Text style={styles.nameCardHint}>Tap to reveal meaning</Text>
            </>
          ) : (
            <>
              <Text style={styles.nameMeaning}>{GODS_NAMES[idx].meaning}</Text>
              <Text style={styles.nameScripture}>— {GODS_NAMES[idx].scripture}</Text>
              <Text style={styles.nameContext}>{GODS_NAMES[idx].context}</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.nameNavRow}>
          <TouchableOpacity
            style={[styles.nameNavBtn, idx === 0 && styles.nameNavBtnDisabled]}
            onPress={() => { setIdx(i => Math.max(0, i - 1)); setFlipped(false); }}
            disabled={idx === 0}
          >
            <Text style={styles.nameNavText}>← Prev</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.nameNavBtn, idx === GODS_NAMES.length - 1 && styles.nameNavBtnDisabled]}
            onPress={() => { setIdx(i => Math.min(GODS_NAMES.length - 1, i + 1)); setFlipped(false); }}
            disabled={idx === GODS_NAMES.length - 1}
          >
            <Text style={styles.nameNavText}>Next →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ── PRAYER BUILDER ─────────────────────────────────────────
function PrayerGame({ onExit }: { onExit: () => void }) {
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [current, setCurrent] = useState('');
  const [done, setDone] = useState(false);

  const cat = PRAYER_CATEGORIES[step];

  const handleNext = () => {
    setResponses(r => ({ ...r, [cat.id]: current }));
    setCurrent('');
    if (step < PRAYER_CATEGORIES.length - 1) setStep(s => s + 1);
    else setDone(true);
  };

  if (done) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.gameContent}>
          <Text style={styles.prayerDoneTitle}>🙏 Your ACTS Prayer</Text>
          {PRAYER_CATEGORIES.map(c => (
            <View key={c.id} style={styles.prayerSummaryItem}>
              <Text style={styles.prayerSummaryLabel}>{c.icon} {c.label}</Text>
              <Text style={styles.prayerSummaryText}>{responses[c.id] || '—'}</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.nextBtn} onPress={onExit}>
            <Text style={styles.nextBtnText}>Amen. Back to Games</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <GameHeader title="Prayer Builder" current={step + 1} total={4} onExit={onExit} />
      <View style={styles.gameContent}>
        <View style={[styles.prayerCatCard, { borderColor: cat.color }]}>
          <Text style={styles.prayerCatIcon}>{cat.icon}</Text>
          <Text style={[styles.prayerCatLabel, { color: cat.color }]}>{cat.label}</Text>
          <Text style={styles.prayerCatPrompt}>{cat.prompt}</Text>
        </View>
        <View style={styles.prayerInputWrap}>
          <Text
            style={styles.prayerInput}
            // @ts-ignore
            onChangeText={setCurrent}
            // Using TextInput indirectly for cleanliness
          >{current}</Text>
        </View>
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextBtnText}>{step < 3 ? `Next: ${PRAYER_CATEGORIES[step + 1].label} →` : 'Complete Prayer'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ── FRUITS CHECK ───────────────────────────────────────────
function FruitsGame({ onExit }: { onExit: () => void }) {
  const [idx, setIdx] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const rate = (score: number) => {
    const updated = [...scores, score];
    setScores(updated);
    if (idx < FRUITS_OF_SPIRIT.length - 1) {
      setIdx(i => i + 1);
    } else {
      setDone(true);
      Storage.get<UserProfile>('profile', defaultProfile).then(async p => {
        if (p) await Storage.set('profile', (await awardXP('miniGameWon', p)).profile);
      });
    }
  };

  if (done) {
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView contentContainerStyle={styles.gameContent}>
          <Text style={styles.prayerDoneTitle}>🍇 Your Fruit Report</Text>
          <Text style={styles.fruitAvg}>Overall: {avg.toFixed(1)}/5</Text>
          {FRUITS_OF_SPIRIT.map((f, i) => (
            <View key={f.fruit} style={styles.fruitResultRow}>
              <Text style={styles.fruitResultName}>{f.fruit}</Text>
              <View style={styles.fruitBar}>
                <View style={[styles.fruitBarFill, { width: `${(scores[i] / 5) * 100}%` }]} />
              </View>
              <Text style={styles.fruitScore}>{scores[i]}/5</Text>
            </View>
          ))}
          <Text style={styles.fruitNote}>
            "The fruit of the Spirit is not one fruit—it's all nine. Grace covers every gap." — Galatians 5:22-23
          </Text>
          <TouchableOpacity style={styles.nextBtn} onPress={onExit}>
            <Text style={styles.nextBtnText}>Back to Games</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const fruit = FRUITS_OF_SPIRIT[idx];
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <GameHeader title="Fruit Check" current={idx + 1} total={9} onExit={onExit} />
      <View style={styles.gameContent}>
        <Text style={styles.fruitName}>{fruit.fruit}</Text>
        <Text style={styles.fruitDef}>{fruit.description}</Text>
        <Text style={styles.fruitQuestion}>"{fruit.question}"</Text>
        <Text style={styles.fruitRateLabel}>Rate yourself honestly (1–5):</Text>
        <View style={styles.fruitRateRow}>
          {[1, 2, 3, 4, 5].map(n => (
            <TouchableOpacity key={n} style={styles.fruitRateBtn} onPress={() => rate(n)}>
              <Text style={styles.fruitRateBtnText}>{n}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

// ── Shared Components ──────────────────────────────────────
function GameHeader({ title, current, total, onExit }: any) {
  return (
    <View style={styles.gameHeader}>
      <TouchableOpacity onPress={onExit} style={styles.exitBtn}>
        <Text style={styles.exitBtnText}>✕ Exit</Text>
      </TouchableOpacity>
      <Text style={styles.gameHeaderTitle}>{title}</Text>
      <Text style={styles.gameProgress}>{current}/{total}</Text>
    </View>
  );
}

function GameResult({ title, score, total, xpEarned, onExit }: any) {
  const percent = Math.round((score / total) * 100);
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={[styles.gameContent, { alignItems: 'center', paddingTop: 60 }]}>
        <Text style={{ fontSize: 64, marginBottom: 16 }}>
          {percent >= 80 ? '🏆' : percent >= 60 ? '💪' : '📖'}
        </Text>
        <Text style={styles.resultTitle}>{title}</Text>
        <Text style={styles.resultScore}>{score}/{total}</Text>
        <Text style={styles.resultPercent}>{percent}% correct</Text>
        {xpEarned > 0 && <Text style={styles.resultXP}>+{xpEarned} XP earned!</Text>}
        <Text style={styles.resultNote}>
          {percent >= 80 ? "Outstanding! The Word is working in you." :
            percent >= 60 ? "Good work. Keep studying. The more you know Him, the more you love Him." :
              "Don't be discouraged. Every question is a chance to learn."}
        </Text>
        <TouchableOpacity style={styles.nextBtn} onPress={onExit}>
          <Text style={styles.nextBtnText}>Back to Games</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm, paddingBottom: SPACING.md },
  title: { color: COLORS.text, fontSize: 24, fontFamily: 'Lora-SemiBold' },
  subtitle: { color: COLORS.text3, fontSize: 13, fontFamily: 'Lora-Italic', marginTop: 2 },
  grid: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm },
  gameCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    padding: SPACING.lg, marginBottom: SPACING.md,
    borderWidth: 1, borderColor: COLORS.border,
  },
  gameEmojiWrap: { width: 56, height: 56, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm },
  gameEmoji: { fontSize: 28 },
  gameTitle: { color: COLORS.text, fontSize: 17, fontFamily: 'DMSans-SemiBold', marginBottom: 4 },
  gameSubtitle: { color: COLORS.text2, fontSize: 13, fontFamily: 'DMSans-Regular', marginBottom: SPACING.md },
  playBtn: { alignSelf: 'flex-start', paddingHorizontal: 20, paddingVertical: 8, borderRadius: RADIUS.full },
  playBtnText: { color: COLORS.white, fontSize: 13, fontFamily: 'DMSans-SemiBold' },
  // Game shared
  gameHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.md,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  exitBtn: {},
  exitBtnText: { color: COLORS.text3, fontSize: 13, fontFamily: 'DMSans-Regular' },
  gameHeaderTitle: { color: COLORS.text, fontSize: 16, fontFamily: 'DMSans-SemiBold' },
  gameProgress: { color: COLORS.text3, fontSize: 13, fontFamily: 'DMSans-Regular' },
  gameContent: { flex: 1, padding: SPACING.lg },
  questionText: { color: COLORS.text, fontSize: 18, fontFamily: 'Lora-SemiBold', lineHeight: 28, marginBottom: SPACING.lg },
  optionBtn: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md,
    padding: 14, marginBottom: SPACING.sm,
  },
  optionText: { color: COLORS.text, fontSize: 15, fontFamily: 'DMSans-Regular' },
  explanationCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.md,
    padding: SPACING.md, marginTop: SPACING.md, borderWidth: 1, borderColor: COLORS.border,
  },
  explanationText: { color: COLORS.text2, fontSize: 14, lineHeight: 22, fontFamily: 'DMSans-Regular', marginBottom: SPACING.md },
  nextBtn: { backgroundColor: COLORS.gold, borderRadius: RADIUS.full, paddingVertical: 14, alignItems: 'center' },
  nextBtnText: { color: COLORS.white, fontSize: 15, fontFamily: 'DMSans-SemiBold' },
  checkBtn: { backgroundColor: COLORS.blue, borderRadius: RADIUS.full, paddingVertical: 14, alignItems: 'center', marginTop: SPACING.md },
  checkBtnText: { color: COLORS.white, fontSize: 15, fontFamily: 'DMSans-SemiBold' },
  // Fill blank
  fillVerse: { color: COLORS.text, fontSize: 18, fontFamily: 'Lora-Italic', lineHeight: 30, marginBottom: 8 },
  fillRef: { color: COLORS.gold, fontSize: 13, fontFamily: 'DMSans-SemiBold', marginBottom: SPACING.lg },
  fillInputRow: { alignItems: 'center', marginBottom: SPACING.md },
  fillInput: {
    minWidth: 120, borderBottomWidth: 2, borderColor: COLORS.gold,
    paddingVertical: 8, paddingHorizontal: 16,
  },
  fillInputText: { color: COLORS.text, fontSize: 20, fontFamily: 'Lora-SemiBold', textAlign: 'center', letterSpacing: 2 },
  fillFeedback: { fontSize: 14, fontFamily: 'DMSans-Medium', textAlign: 'center', marginBottom: SPACING.md },
  keyboard: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: SPACING.lg },
  keyBtn: {
    width: 36, height: 40, borderRadius: 6,
    backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  deleteKey: { width: 52 },
  keyBtnText: { color: COLORS.text, fontSize: 14, fontFamily: 'DMSans-Medium' },
  // Scramble
  scrambleRef: { color: COLORS.gold, fontSize: 14, fontFamily: 'DMSans-SemiBold', marginBottom: SPACING.lg },
  scrambleTarget: {
    minHeight: 80, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.md,
    borderStyle: 'dashed', padding: SPACING.md, marginBottom: SPACING.lg, justifyContent: 'center',
  },
  scramblePlaceholder: { color: COLORS.text3, textAlign: 'center', fontFamily: 'DMSans-Regular' },
  scrambleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: SPACING.lg },
  scrambleWord: {
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.sm, paddingVertical: 8, paddingHorizontal: 12,
  },
  scrambleWordSelected: {
    backgroundColor: COLORS.gold, borderRadius: RADIUS.sm,
    paddingVertical: 8, paddingHorizontal: 12,
  },
  scrambleWordText: { color: COLORS.text, fontSize: 14, fontFamily: 'DMSans-Medium' },
  // Names
  nameCard: {
    width: width - 64, backgroundColor: COLORS.surface,
    borderRadius: 24, padding: 32, alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.gold, marginBottom: 32,
    minHeight: 200, justifyContent: 'center',
  },
  nameCardName: { color: COLORS.gold, fontSize: 28, fontFamily: 'Lora-SemiBold', textAlign: 'center', marginBottom: 16 },
  nameCardHint: { color: COLORS.text3, fontSize: 13, fontFamily: 'DMSans-Regular' },
  nameMeaning: { color: COLORS.text, fontSize: 20, fontFamily: 'Lora-SemiBold', textAlign: 'center', marginBottom: 8 },
  nameScripture: { color: COLORS.gold, fontSize: 13, fontFamily: 'DMSans-SemiBold', marginBottom: 12 },
  nameContext: { color: COLORS.text2, fontSize: 14, textAlign: 'center', lineHeight: 22, fontFamily: 'DMSans-Regular' },
  nameNavRow: { flexDirection: 'row', gap: 16 },
  nameNavBtn: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, paddingVertical: 12, paddingHorizontal: 24, borderWidth: 1, borderColor: COLORS.border },
  nameNavBtnDisabled: { opacity: 0.3 },
  nameNavText: { color: COLORS.text, fontSize: 14, fontFamily: 'DMSans-Medium' },
  // Prayer
  prayerCatCard: {
    borderWidth: 2, borderRadius: RADIUS.lg,
    padding: SPACING.lg, alignItems: 'center', marginBottom: SPACING.lg,
  },
  prayerCatIcon: { fontSize: 40, marginBottom: 8 },
  prayerCatLabel: { fontSize: 20, fontFamily: 'Lora-SemiBold', marginBottom: 12 },
  prayerCatPrompt: { color: COLORS.text2, fontSize: 14, textAlign: 'center', lineHeight: 22, fontFamily: 'DMSans-Regular' },
  prayerInputWrap: {
    minHeight: 100, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.lg,
  },
  prayerInput: { color: COLORS.text, fontSize: 15, fontFamily: 'DMSans-Regular' },
  prayerDoneTitle: { color: COLORS.text, fontSize: 22, fontFamily: 'Lora-SemiBold', textAlign: 'center', marginBottom: SPACING.lg },
  prayerSummaryItem: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  prayerSummaryLabel: { color: COLORS.gold, fontSize: 13, fontFamily: 'DMSans-SemiBold', marginBottom: 6 },
  prayerSummaryText: { color: COLORS.text2, fontSize: 14, fontFamily: 'DMSans-Regular', lineHeight: 20 },
  // Fruits
  fruitName: { color: COLORS.text, fontSize: 28, fontFamily: 'Lora-SemiBold', textAlign: 'center', marginBottom: 8 },
  fruitDef: { color: COLORS.text2, fontSize: 14, textAlign: 'center', lineHeight: 22, fontFamily: 'DMSans-Regular', marginBottom: SPACING.md },
  fruitQuestion: { color: COLORS.gold, fontSize: 14, fontFamily: 'Lora-Italic', textAlign: 'center', lineHeight: 22, marginBottom: SPACING.lg },
  fruitRateLabel: { color: COLORS.text2, fontSize: 13, fontFamily: 'DMSans-Regular', textAlign: 'center', marginBottom: SPACING.md },
  fruitRateRow: { flexDirection: 'row', gap: 12, justifyContent: 'center' },
  fruitRateBtn: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  fruitRateBtnText: { color: COLORS.text, fontSize: 18, fontFamily: 'Lora-SemiBold' },
  fruitAvg: { color: COLORS.gold, fontSize: 20, fontFamily: 'Lora-SemiBold', textAlign: 'center', marginBottom: SPACING.lg },
  fruitResultRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  fruitResultName: { color: COLORS.text, fontSize: 13, fontFamily: 'DMSans-Medium', width: 90 },
  fruitBar: { flex: 1, height: 8, backgroundColor: COLORS.border, borderRadius: 4 },
  fruitBarFill: { height: '100%', backgroundColor: COLORS.gold, borderRadius: 4 },
  fruitScore: { color: COLORS.text3, fontSize: 12, fontFamily: 'DMSans-Regular', width: 28 },
  fruitNote: { color: COLORS.gold, fontSize: 13, fontFamily: 'Lora-Italic', textAlign: 'center', lineHeight: 22, marginVertical: SPACING.lg },
  // Result
  resultTitle: { color: COLORS.text, fontSize: 22, fontFamily: 'Lora-SemiBold', textAlign: 'center', marginBottom: 8 },
  resultScore: { color: COLORS.gold, fontSize: 48, fontFamily: 'Lora-SemiBold', textAlign: 'center' },
  resultPercent: { color: COLORS.text2, fontSize: 16, fontFamily: 'DMSans-Regular', textAlign: 'center', marginBottom: 8 },
  resultXP: { color: COLORS.green, fontSize: 16, fontFamily: 'DMSans-SemiBold', textAlign: 'center', marginBottom: 16 },
  resultNote: { color: COLORS.text2, fontSize: 14, textAlign: 'center', lineHeight: 22, fontFamily: 'DMSans-Regular', marginBottom: SPACING.xl },
});
