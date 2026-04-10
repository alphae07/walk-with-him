import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Dimensions, Animated, KeyboardAvoidingView, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors, SPACING, RADIUS } from '../constants/theme';
import {
  QUIZ_QUESTIONS, FILL_BLANK_VERSES, GODS_NAMES,
  WORD_SCRAMBLE_VERSES, FRUITS_OF_SPIRIT, PRAYER_CATEGORIES
} from '../constants/data';
import { Storage, UserProfile, defaultProfile } from '../utils/storage';
import { awardXP } from '../utils/xp';
import { GameHeader, GameResult } from '../components/GameComponents';

const { width } = Dimensions.get('window');

const GAMES = [
  { id: 'quiz',    emoji: '📖', title: 'Bible Quiz',      subtitle: 'Test your Scripture knowledge',       color: '#2563EB' },
  { id: 'fill',    emoji: '✏️', title: 'Fill the Blank',  subtitle: 'Complete the verse from memory',       color: '#7C3AED' },
  { id: 'scramble',emoji: '🔀', title: 'Word Scramble',   subtitle: 'Rebuild the verse word by word',       color: '#2E8B5A' },
  { id: 'names',   emoji: '🏛', title: 'Who Is God?',     subtitle: "Learn God's Hebrew names",             color: '#C8922A' },
  { id: 'prayer',  emoji: '🙏', title: 'Prayer Builder',  subtitle: 'ACTS model — guided prayer',           color: '#E91E8C' },
  { id: 'fruits',  emoji: '🍇', title: 'Fruit Check',     subtitle: 'Weekly self-assessment of the Spirit', color: '#FF5722' },
];

export default function GamesScreen() {
  const C = useThemeColors();
  const [activeGame, setActiveGame] = useState<string | null>(null);

  if (activeGame === 'quiz')    return <QuizGame    onExit={() => setActiveGame(null)} />;
  if (activeGame === 'fill')    return <FillBlankGame onExit={() => setActiveGame(null)} />;
  if (activeGame === 'scramble')return <ScrambleGame  onExit={() => setActiveGame(null)} />;
  if (activeGame === 'names')   return <NamesGame     onExit={() => setActiveGame(null)} />;
  if (activeGame === 'prayer')  return <PrayerGame    onExit={() => setActiveGame(null)} />;
  if (activeGame === 'fruits')  return <FruitsGame    onExit={() => setActiveGame(null)} />;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bg }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: C.text }]}>Games</Text>
        <Text style={[styles.subtitle, { color: C.text3 }]}>Knowledge that sticks is knowledge you've played with.</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.grid}>
        {GAMES.map(game => (
          <TouchableOpacity
            key={game.id}
            style={[styles.gameCard, { backgroundColor: C.surface, borderColor: C.border }]}
            onPress={() => setActiveGame(game.id)}
            activeOpacity={0.85}>
            <View style={[styles.gameEmojiWrap, { backgroundColor: game.color + '18' }]}>
              <Text style={styles.gameEmoji}>{game.emoji}</Text>
            </View>
            <View style={styles.gameInfo}>
              <Text style={[styles.gameTitle, { color: C.text }]}>{game.title}</Text>
              <Text style={[styles.gameSubtitle, { color: C.text2 }]}>{game.subtitle}</Text>
            </View>
            <TouchableOpacity
              style={[styles.playBtn, { backgroundColor: game.color }]}
              onPress={() => setActiveGame(game.id)}>
              <Text style={styles.playBtnText}>Play →</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── QUIZ GAME ─────────────────────────────────────────────────────────────
function QuizGame({ onExit }: { onExit: () => void }) {
  const C = useThemeColors();
  const [questions] = useState(() => [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 10));
  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 4, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === questions[qi].answer) {
      setScore(s => s + 1);
    } else {
      shake();
    }
  };

  const handleNext = async () => {
    if (qi < questions.length - 1) {
      setQi(qi + 1);
      setSelected(null);
    } else {
      setDone(true);
      if (score >= 6) {
        const p = await Storage.get<UserProfile>('profile', defaultProfile);
        if (p) await Storage.set('profile', (await awardXP('miniGameWon', p)).profile);
      }
    }
  };

  if (done) return <GameResult title="Quiz Complete!" score={score} total={questions.length} xpEarned={score >= 6 ? 60 : 0} onExit={onExit} />;

  const q = questions[qi];
  const progress = (qi + 1) / questions.length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bg }]} edges={['top']}>
      <GameHeader title="Bible Quiz" current={qi + 1} total={questions.length} onExit={onExit} />
      <ScrollView contentContainerStyle={styles.gameContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
          <View style={[styles.questionCard, { backgroundColor: C.surface, borderColor: C.border }]}>
            <Text style={[styles.questionNum, { color: C.text3 }]}>Question {qi + 1} of {questions.length}</Text>
            <Text style={[styles.questionText, { color: C.text }]}>{q.question}</Text>
          </View>

          {q.options.map((opt, i) => {
            let bg = C.surface;
            let borderColor = C.border;
            let textColor = C.text;
            if (selected !== null) {
              if (i === q.answer) { bg = '#2E8B5A'; borderColor = '#2E8B5A'; textColor = '#fff'; }
              else if (i === selected) { bg = '#C0392B'; borderColor = '#C0392B'; textColor = '#fff'; }
            }
            return (
              <TouchableOpacity
                key={i}
                style={[styles.optionBtn, { backgroundColor: bg, borderColor }]}
                onPress={() => handleSelect(i)}
                disabled={selected !== null}
                activeOpacity={0.8}>
                <View style={[styles.optionLetter, { backgroundColor: selected !== null && (i === q.answer || i === selected) ? 'rgba(255,255,255,0.25)' : C.bg3 }]}>
                  <Text style={[styles.optionLetterText, { color: selected !== null && (i === q.answer || i === selected) ? '#fff' : C.text3 }]}>
                    {['A','B','C','D'][i]}
                  </Text>
                </View>
                <Text style={[styles.optionText, { color: textColor, flex: 1 }]}>{opt}</Text>
                {selected !== null && i === q.answer && <Text style={styles.optionCheck}>✓</Text>}
                {selected !== null && i === selected && i !== q.answer && <Text style={styles.optionX}>✗</Text>}
              </TouchableOpacity>
            );
          })}
        </Animated.View>

        {selected !== null && (
          <View style={[styles.explanationCard, { backgroundColor: C.surface, borderColor: C.border, borderLeftColor: selected === q.answer ? '#2E8B5A' : C.gold }]}>
            <Text style={[styles.explanationTitle, { color: C.gold }]}>💡 Did you know?</Text>
            <Text style={[styles.explanationText, { color: C.text2 }]}>{q.explanation}</Text>
            <TouchableOpacity style={[styles.nextBtn, { backgroundColor: C.gold }]} onPress={handleNext}>
              <Text style={styles.nextBtnText}>{qi < questions.length - 1 ? 'Next Question →' : 'See Results'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── FILL THE BLANK ────────────────────────────────────────────────────────
function FillBlankGame({ onExit }: { onExit: () => void }) {
  const C = useThemeColors();
  const [verses] = useState(() => [...FILL_BLANK_VERSES].sort(() => Math.random() - 0.5).slice(0, 8));
  const [vi, setVi] = useState(0);
  const [input, setInput] = useState('');
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const checkAnswer = () => {
    if (!input.trim()) return;
    const isCorrect = input.trim().toLowerCase() === verses[vi].answer.toLowerCase();
    setCorrect(isCorrect);
    setChecked(true);
    if (isCorrect) {
      setScore(s => s + 1);
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: 1.15, duration: 150, useNativeDriver: true }),
        Animated.spring(bounceAnim, { toValue: 1, useNativeDriver: true }),
      ]).start();
    }
  };

  const handleNext = async () => {
    if (vi < verses.length - 1) {
      setVi(vi + 1);
      setInput('');
      setChecked(false);
      setCorrect(false);
      bounceAnim.setValue(1);
    } else {
      setDone(true);
      if (score >= 5) {
        const p = await Storage.get<UserProfile>('profile', defaultProfile);
        if (p) await Storage.set('profile', (await awardXP('miniGameWon', p)).profile);
      }
    }
  };

  if (done) return <GameResult title="Fill the Blank!" score={score} total={verses.length} xpEarned={score >= 5 ? 60 : 0} onExit={onExit} />;

  const v = verses[vi];
  const parts = v.verse.split('___');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bg }]} edges={['top']}>
      <GameHeader title="Fill the Blank" current={vi + 1} total={verses.length} onExit={onExit} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.gameContent} showsVerticalScrollIndicator={false}>
          <View style={[styles.verseContainer, { backgroundColor: C.surface, borderColor: C.border }]}>
            <Text style={[styles.fillRef, { color: C.gold }]}>— {v.ref}</Text>
            <View style={styles.fillVerseRow}>
              <Text style={[styles.fillVersePart, { color: C.text }]}>{parts[0]}</Text>
              <Animated.View style={[styles.fillBlankBox, {
                backgroundColor: checked ? (correct ? '#2E8B5A20' : '#C0392B20') : C.bg3,
                borderColor: checked ? (correct ? '#2E8B5A' : '#C0392B') : C.gold,
                transform: [{ scale: bounceAnim }]
              }]}>
                <Text style={[styles.fillBlankText, {
                  color: checked ? (correct ? '#2E8B5A' : '#C0392B') : (input ? C.text : C.text3)
                }]}>{input || '?'}</Text>
              </Animated.View>
              {parts[1] ? <Text style={[styles.fillVersePart, { color: C.text }]}>{parts[1]}</Text> : null}
            </View>
          </View>

          {checked && (
            <View style={[styles.feedbackCard, { backgroundColor: correct ? '#2E8B5A15' : '#C0392B15', borderColor: correct ? '#2E8B5A' : '#C0392B' }]}>
              <Text style={[styles.feedbackText, { color: correct ? '#2E8B5A' : '#C0392B' }]}>
                {correct ? `✓ Correct! "${v.answer}" — well done!` : `✗ The answer is "${v.answer}"`}
              </Text>
            </View>
          )}

          {/* Letter keyboard */}
          <View style={styles.keyboard}>
            {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => (
              <TouchableOpacity
                key={letter}
                style={[styles.keyBtn, { backgroundColor: C.surface, borderColor: C.border }]}
                onPress={() => !checked && setInput(i => i + letter)}
                disabled={checked}>
                <Text style={[styles.keyBtnText, { color: C.text }]}>{letter}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.keyBtn, styles.deleteKey, { backgroundColor: C.bg3, borderColor: C.border }]}
              onPress={() => !checked && setInput(i => i.slice(0, -1))}
              disabled={checked}>
              <Text style={[styles.keyBtnText, { color: C.text }]}>⌫</Text>
            </TouchableOpacity>
          </View>

          {!checked ? (
            <TouchableOpacity
              style={[styles.checkBtn, { backgroundColor: input.trim() ? '#4A90D9' : C.bg3 }]}
              onPress={checkAnswer}
              disabled={!input.trim()}>
              <Text style={[styles.checkBtnText, { color: input.trim() ? '#fff' : C.text3 }]}>Check Answer</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.nextBtn, { backgroundColor: C.gold }]} onPress={handleNext}>
              <Text style={styles.nextBtnText}>{vi < verses.length - 1 ? 'Next →' : 'See Results'}</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── WORD SCRAMBLE ─────────────────────────────────────────────────────────
function ScrambleGame({ onExit }: { onExit: () => void }) {
  const C = useThemeColors();
  const [vi, setVi] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const totalVerses = WORD_SCRAMBLE_VERSES.length;

  const verse = WORD_SCRAMBLE_VERSES[vi];
  const [shuffled] = useState<string[]>(() => [...verse.words].sort(() => Math.random() - 0.5));
  const [selected, setSelected] = useState<Array<{word: string; idx: number}>>([]);
  const [remaining, setRemaining] = useState(() =>
    shuffled.map((w, i) => ({ word: w, idx: i }))
  );

  const resetVerse = useCallback(() => {
    const fresh = [...verse.words].sort(() => Math.random() - 0.5).map((w, i) => ({ word: w, idx: i }));
    setSelected([]);
    setRemaining(fresh);
    setCorrect(null);
  }, [verse]);

  const addWord = (item: {word: string; idx: number}) => {
    if (correct !== null) return;
    setSelected(s => [...s, item]);
    setRemaining(r => r.filter(x => x.idx !== item.idx));
  };

  const removeWord = (item: {word: string; idx: number}) => {
    if (correct !== null) return;
    setSelected(s => s.filter(x => x.idx !== item.idx));
    setRemaining(r => [...r, item]);
  };

  const checkOrder = async () => {
    const answer = selected.map(x => x.word).join(' ');
    const isCorrect = answer === verse.words.join(' ');
    setCorrect(isCorrect);
    if (isCorrect) {
      setScore(s => s + 1);
      const p = await Storage.get<UserProfile>('profile', defaultProfile);
      if (p) await Storage.set('profile', (await awardXP('miniGameWon', p)).profile);
    }
  };

  const handleNext = () => {
    if (vi < totalVerses - 1) {
      setVi(v => v + 1);
      setSelected([]);
      setRemaining([...WORD_SCRAMBLE_VERSES[vi + 1].words].sort(() => Math.random() - 0.5).map((w, i) => ({ word: w, idx: i })));
      setCorrect(null);
    } else {
      setDone(true);
    }
  };

  if (done) return <GameResult title="Word Scramble!" score={score} total={totalVerses} xpEarned={score >= Math.ceil(totalVerses * 0.6) ? 60 : 0} onExit={onExit} />;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bg }]} edges={['top']}>
      <GameHeader title="Word Scramble" current={vi + 1} total={totalVerses} onExit={onExit} />
      <View style={styles.gameContent}>
        <Text style={[styles.scrambleRef, { color: C.gold }]}>Build: <Text style={{ fontFamily: 'DMSans-SemiBold' }}>{verse.ref}</Text></Text>

        {/* Drop area */}
        <View style={[styles.scrambleTarget, { borderColor: correct === null ? C.border : (correct ? '#2E8B5A' : '#C0392B'), backgroundColor: correct === null ? C.surface : (correct ? '#2E8B5A12' : '#C0392B12') }]}>
          {selected.length === 0 ? (
            <Text style={[styles.scramblePlaceholder, { color: C.text3 }]}>Tap words below to build the verse</Text>
          ) : (
            <View style={styles.scrambleRow}>
              {selected.map((item, i) => (
                <TouchableOpacity key={`sel-${item.idx}-${i}`}
                  style={[styles.scrambleWordSelected, { backgroundColor: correct === null ? C.gold : (correct ? '#2E8B5A' : '#C0392B') }]}
                  onPress={() => removeWord(item)}>
                  <Text style={styles.scrambleWordText}>{item.word}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {correct !== null && (
          <Text style={[styles.scrambleFeedback, { color: correct ? '#2E8B5A' : '#C0392B' }]}>
            {correct ? '🎉 Perfect! +60 XP' : `✗ Correct: "${verse.words.join(' ')}"`}
          </Text>
        )}

        {/* Available words */}
        <View style={styles.scrambleRow}>
          {remaining.map((item) => (
            <TouchableOpacity key={`rem-${item.idx}`}
              style={[styles.scrambleWord, { backgroundColor: C.surface, borderColor: C.border }]}
              onPress={() => addWord(item)}>
              <Text style={[styles.scrambleWordText, { color: C.text }]}>{item.word}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.scrambleBtns}>
          {correct === null ? (
            <>
              <TouchableOpacity
                style={[styles.resetBtn, { borderColor: C.border }]}
                onPress={resetVerse}>
                <Text style={[styles.resetBtnText, { color: C.text3 }]}>↺ Reset</Text>
              </TouchableOpacity>
              {remaining.length === 0 && (
                <TouchableOpacity style={[styles.checkBtn, { backgroundColor: '#4A90D9', flex: 1 }]} onPress={checkOrder}>
                  <Text style={styles.checkBtnText}>Check Verse ✓</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <TouchableOpacity style={[styles.nextBtn, { backgroundColor: C.gold, flex: 1 }]} onPress={handleNext}>
              <Text style={styles.nextBtnText}>{vi < totalVerses - 1 ? 'Next Verse →' : 'See Results'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

// ─── GOD'S NAMES ───────────────────────────────────────────────────────────
function NamesGame({ onExit }: { onExit: () => void }) {
  const C = useThemeColors();
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  const flip = () => {
    Animated.spring(flipAnim, { toValue: flipped ? 0 : 1, useNativeDriver: true, tension: 50, friction: 8 }).start();
    setFlipped(f => !f);
  };

  const goTo = (dir: 1 | -1) => {
    const next = idx + dir;
    if (next < 0 || next >= GODS_NAMES.length) return;
    setIdx(next);
    setFlipped(false);
    flipAnim.setValue(0);
  };

  const frontInterpolate = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const backInterpolate = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });
  const n = GODS_NAMES[idx];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bg }]} edges={['top']}>
      <GameHeader title="Who Is God?" current={idx + 1} total={GODS_NAMES.length} onExit={onExit} />
      <View style={[styles.gameContent, { alignItems: 'center' }]}>
        <Text style={[styles.flipHint, { color: C.text3 }]}>Tap the card to reveal</Text>

        <TouchableOpacity onPress={flip} activeOpacity={0.9} style={styles.flipCardWrap}>
          {/* Front */}
          <Animated.View style={[styles.nameCard, styles.cardFace, { backgroundColor: C.surface, borderColor: C.gold, transform: [{ rotateY: frontInterpolate }], backfaceVisibility: 'hidden' }]}>
            <Text style={[styles.nameCardName, { color: C.gold }]}>{n.name}</Text>
            <View style={[styles.nameCardDivider, { backgroundColor: C.gold + '30' }]} />
            <Text style={[styles.nameCardHint, { color: C.text3 }]}>Tap to reveal meaning</Text>
          </Animated.View>
          {/* Back */}
          <Animated.View style={[styles.nameCard, styles.cardFace, styles.cardBack, { backgroundColor: C.gold + '15', borderColor: C.gold, transform: [{ rotateY: backInterpolate }], backfaceVisibility: 'hidden' }]}>
            <Text style={[styles.nameMeaning, { color: C.text }]}>{n.meaning}</Text>
            <Text style={[styles.nameScripture, { color: C.gold }]}>— {n.scripture}</Text>
            <View style={[styles.nameCardDivider, { backgroundColor: C.gold + '30' }]} />
            <Text style={[styles.nameContext, { color: C.text2 }]}>{n.context}</Text>
          </Animated.View>
        </TouchableOpacity>

        <View style={styles.nameNavRow}>
          <TouchableOpacity
            style={[styles.nameNavBtn, { backgroundColor: C.surface, borderColor: C.border, opacity: idx === 0 ? 0.3 : 1 }]}
            onPress={() => goTo(-1)} disabled={idx === 0}>
            <Text style={[styles.nameNavText, { color: C.text }]}>← Prev</Text>
          </TouchableOpacity>
          <Text style={[styles.nameCounter, { color: C.text3 }]}>{idx + 1} / {GODS_NAMES.length}</Text>
          <TouchableOpacity
            style={[styles.nameNavBtn, { backgroundColor: C.surface, borderColor: C.border, opacity: idx === GODS_NAMES.length - 1 ? 0.3 : 1 }]}
            onPress={() => goTo(1)} disabled={idx === GODS_NAMES.length - 1}>
            <Text style={[styles.nameNavText, { color: C.text }]}>Next →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ─── PRAYER BUILDER ────────────────────────────────────────────────────────
function PrayerGame({ onExit }: { onExit: () => void }) {
  const C = useThemeColors();
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [current, setCurrent] = useState('');
  const [done, setDone] = useState(false);
  const cat = PRAYER_CATEGORIES[step];

  const handleNext = async () => {
    if (!current.trim()) return;
    const updated = { ...responses, [cat.id]: current };
    setResponses(updated);
    setCurrent('');
    if (step < PRAYER_CATEGORIES.length - 1) {
      setStep(s => s + 1);
    } else {
      setDone(true);
      const p = await Storage.get<UserProfile>('profile', defaultProfile);
      if (p) await Storage.set('profile', (await awardXP('miniGameWon', p)).profile);
      // Save to journal
      const entry = {
        id: `prayer_${Date.now()}`, date: new Date().toISOString(),
        content: Object.entries(updated).map(([k, v]) => `${k.toUpperCase()}: ${v}`).join('\n\n'),
        prompt: 'ACTS Prayer', xpEarned: 60, type: 'prayer',
      };
      const existing = await Storage.get<any[]>('journal_entries', []);
      await Storage.set('journal_entries', [entry, ...(existing || [])]);
    }
  };

  if (done) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: C.bg }]} edges={['top']}>
        <ScrollView contentContainerStyle={styles.gameContent}>
          <Text style={[styles.prayerDoneTitle, { color: C.text }]}>🙏 Your ACTS Prayer</Text>
          <Text style={[styles.prayerDoneSub, { color: C.text3 }]}>Saved to your journal.</Text>
          {PRAYER_CATEGORIES.map(c => (
            <View key={c.id} style={[styles.prayerSummaryItem, { backgroundColor: C.surface, borderColor: C.border, borderLeftColor: c.color }]}>
              <Text style={[styles.prayerSummaryLabel, { color: c.color }]}>{c.icon} {c.label}</Text>
              <Text style={[styles.prayerSummaryText, { color: C.text2 }]}>{responses[c.id] || '—'}</Text>
            </View>
          ))}
          <TouchableOpacity style={[styles.nextBtn, { backgroundColor: C.gold }]} onPress={onExit}>
            <Text style={styles.nextBtnText}>Amen. Back to Games</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bg }]} edges={['top']}>
      <GameHeader title="Prayer Builder" current={step + 1} total={4} onExit={onExit} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.gameContent} showsVerticalScrollIndicator={false}>
          <View style={[styles.prayerCatCard, { borderColor: cat.color, backgroundColor: cat.color + '10' }]}>
            <Text style={styles.prayerCatIcon}>{cat.icon}</Text>
            <Text style={[styles.prayerCatLabel, { color: cat.color }]}>{cat.label}</Text>
            <Text style={[styles.prayerCatPrompt, { color: C.text2 }]}>{cat.prompt}</Text>
          </View>

          <View style={styles.prayerSteps}>
            {PRAYER_CATEGORIES.map((c, i) => (
              <View key={c.id} style={[styles.prayerStep, { backgroundColor: i === step ? cat.color : (i < step ? C.green : C.bg3) }]}>
                <Text style={styles.prayerStepText}>{c.icon}</Text>
              </View>
            ))}
          </View>

          <TextInput
            style={[styles.prayerInput, { backgroundColor: C.surface, borderColor: current.trim() ? cat.color : C.border, color: C.text }]}
            value={current}
            onChangeText={setCurrent}
            placeholder={`Write your ${cat.label.toLowerCase()} to God...`}
            placeholderTextColor={C.text3}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            autoFocus
          />

          <TouchableOpacity
            style={[styles.nextBtn, { backgroundColor: current.trim() ? C.gold : C.bg3 }]}
            onPress={handleNext}
            disabled={!current.trim()}>
            <Text style={[styles.nextBtnText, { color: current.trim() ? '#fff' : C.text3 }]}>
              {step < 3 ? `Next: ${PRAYER_CATEGORIES[step + 1].label} →` : 'Complete Prayer 🙏'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── FRUIT CHECK ───────────────────────────────────────────────────────────
function FruitsGame({ onExit }: { onExit: () => void }) {
  const C = useThemeColors();
  const [idx, setIdx] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const scaleAnims = [1,2,3,4,5].map(() => useRef(new Animated.Value(1)).current);

  const rate = async (score: number, btnIdx: number) => {
    Animated.sequence([
      Animated.timing(scaleAnims[btnIdx], { toValue: 1.3, duration: 100, useNativeDriver: true }),
      Animated.spring(scaleAnims[btnIdx], { toValue: 1, useNativeDriver: true }),
    ]).start();

    const updated = [...scores, score];
    setScores(updated);
    if (idx < FRUITS_OF_SPIRIT.length - 1) {
      setTimeout(() => setIdx(i => i + 1), 300);
    } else {
      setDone(true);
      const p = await Storage.get<UserProfile>('profile', defaultProfile);
      if (p) await Storage.set('profile', (await awardXP('miniGameWon', p)).profile);
    }
  };

  if (done) {
    const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: C.bg }]} edges={['top']}>
        <ScrollView contentContainerStyle={styles.gameContent}>
          <Text style={[styles.prayerDoneTitle, { color: C.text }]}>🍇 Your Fruit Report</Text>
          <View style={[styles.avgCard, { backgroundColor: C.surface, borderColor: C.border }]}>
            <Text style={[styles.fruitAvgNum, { color: C.gold }]}>{avg.toFixed(1)}</Text>
            <Text style={[styles.fruitAvgLabel, { color: C.text3 }]}>/ 5 Overall</Text>
          </View>
          {FRUITS_OF_SPIRIT.map((f, i) => (
            <View key={f.fruit} style={styles.fruitResultRow}>
              <Text style={[styles.fruitResultName, { color: C.text, width: 100 }]}>{f.fruit}</Text>
              <View style={[styles.fruitBar, { backgroundColor: C.border, flex: 1 }]}>
                <View style={[styles.fruitBarFill, { width: `${(scores[i] / 5) * 100}%` as any, backgroundColor: scores[i] >= 4 ? C.green : scores[i] >= 2 ? C.gold : C.red }]} />
              </View>
              <Text style={[styles.fruitScore, { color: C.text3 }]}>{scores[i]}/5</Text>
            </View>
          ))}
          <View style={[styles.fruitNote, { backgroundColor: C.surface, borderColor: C.border }]}>
            <Text style={[styles.fruitNoteText, { color: C.gold }]}>
              "The fruit of the Spirit is not one fruit—it's all nine. Grace covers every gap."
            </Text>
            <Text style={[styles.fruitNoteRef, { color: C.text3 }]}>— Galatians 5:22-23</Text>
          </View>
          <TouchableOpacity style={[styles.nextBtn, { backgroundColor: C.gold }]} onPress={onExit}>
            <Text style={styles.nextBtnText}>Back to Games</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const fruit = FRUITS_OF_SPIRIT[idx];
  const COLORS_BY_SCORE = ['#C0392B', '#E67E22', '#F1C40F', '#27AE60', '#2E8B5A'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bg }]} edges={['top']}>
      <GameHeader title="Fruit Check" current={idx + 1} total={FRUITS_OF_SPIRIT.length} onExit={onExit} />
      <View style={styles.gameContent}>
        <View style={[styles.fruitCard, { backgroundColor: C.surface, borderColor: C.border }]}>
          <Text style={[styles.fruitName, { color: C.gold }]}>{fruit.fruit}</Text>
          <Text style={[styles.fruitVerse, { color: C.text3 }]}>{fruit.verse}</Text>
          <Text style={[styles.fruitDef, { color: C.text2 }]}>{fruit.description}</Text>
        </View>
        <View style={[styles.fruitQuestionCard, { backgroundColor: C.bg2, borderColor: C.border }]}>
          <Text style={[styles.fruitQuestion, { color: C.text }]}>"{fruit.question}"</Text>
        </View>
        <Text style={[styles.fruitRateLabel, { color: C.text3 }]}>How would you honestly rate yourself this week?</Text>
        <View style={styles.fruitRateRow}>
          {[1, 2, 3, 4, 5].map((n, i) => (
            <Animated.View key={n} style={{ transform: [{ scale: scaleAnims[i] }] }}>
              <TouchableOpacity
                style={[styles.fruitRateBtn, { backgroundColor: C.surface, borderColor: COLORS_BY_SCORE[i] + '80', borderWidth: 2 }]}
                onPress={() => rate(n, i)}>
                <Text style={[styles.fruitRateBtnText, { color: COLORS_BY_SCORE[i] }]}>{n}</Text>
                <Text style={styles.fruitRateEmoji}>{['😞','😐','🙂','😊','🌟'][i]}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm, paddingBottom: SPACING.md },
  title: { fontSize: 26, fontFamily: 'Lora-SemiBold' },
  subtitle: { fontSize: 13, fontFamily: 'Lora-Italic', marginTop: 4 },
  grid: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm },
  gameCard: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1 },
  gameEmojiWrap: { width: 52, height: 52, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center' },
  gameEmoji: { fontSize: 26 },
  gameInfo: { flex: 1 },
  gameTitle: { fontSize: 16, fontFamily: 'DMSans-SemiBold', marginBottom: 2 },
  gameSubtitle: { fontSize: 12, fontFamily: 'DMSans-Regular' },
  playBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADIUS.full },
  playBtnText: { color: '#FFFFFF', fontSize: 13, fontFamily: 'DMSans-SemiBold' },
  // Game content
  gameContent: { padding: SPACING.lg, paddingBottom: 40 },
  questionCard: { borderRadius: RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.lg, borderWidth: 1 },
  questionNum: { fontSize: 11, fontFamily: 'DMSans-Medium', letterSpacing: 0.5, marginBottom: 8, textTransform: 'uppercase' },
  questionText: { fontSize: 18, fontFamily: 'Lora-SemiBold', lineHeight: 28 },
  optionBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1.5, borderRadius: RADIUS.md, padding: 14, marginBottom: SPACING.sm },
  optionLetter: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  optionLetterText: { fontSize: 12, fontFamily: 'DMSans-SemiBold' },
  optionText: { fontSize: 14, fontFamily: 'DMSans-Regular' },
  optionCheck: { fontSize: 16, color: '#fff' },
  optionX: { fontSize: 16, color: '#fff' },
  explanationCard: { borderRadius: RADIUS.md, padding: SPACING.md, marginTop: SPACING.md, borderWidth: 1, borderLeftWidth: 4 },
  explanationTitle: { fontSize: 12, fontFamily: 'DMSans-SemiBold', marginBottom: 6 },
  explanationText: { fontSize: 14, lineHeight: 22, fontFamily: 'DMSans-Regular', marginBottom: SPACING.md },
  nextBtn: { borderRadius: RADIUS.full, paddingVertical: 14, alignItems: 'center' },
  nextBtnText: { color: '#FFFFFF', fontSize: 15, fontFamily: 'DMSans-SemiBold' },
  checkBtn: { borderRadius: RADIUS.full, paddingVertical: 14, alignItems: 'center', marginTop: SPACING.sm },
  checkBtnText: { color: '#FFFFFF', fontSize: 15, fontFamily: 'DMSans-SemiBold' },
  // Fill blank
  verseContainer: { borderRadius: RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1 },
  fillRef: { fontSize: 12, fontFamily: 'DMSans-SemiBold', marginBottom: 12, letterSpacing: 0.3 },
  fillVerseRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6 },
  fillVersePart: { fontSize: 17, fontFamily: 'Lora-Italic', lineHeight: 26 },
  fillBlankBox: { minWidth: 80, borderRadius: RADIUS.sm, paddingVertical: 6, paddingHorizontal: 12, borderWidth: 2, alignItems: 'center' },
  fillBlankText: { fontSize: 18, fontFamily: 'Lora-SemiBold', letterSpacing: 1 },
  feedbackCard: { borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1.5 },
  feedbackText: { fontSize: 14, fontFamily: 'DMSans-SemiBold', textAlign: 'center' },
  keyboard: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, justifyContent: 'center', marginBottom: SPACING.md, marginTop: SPACING.sm },
  keyBtn: { width: 34, height: 38, borderRadius: 6, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  deleteKey: { width: 50 },
  keyBtnText: { fontSize: 13, fontFamily: 'DMSans-SemiBold' },
  // Scramble
  scrambleRef: { fontSize: 14, fontFamily: 'DMSans-Regular', marginBottom: SPACING.md },
  scrambleTarget: { minHeight: 80, borderWidth: 2, borderRadius: RADIUS.md, borderStyle: 'dashed', padding: SPACING.md, marginBottom: SPACING.md, justifyContent: 'center' },
  scramblePlaceholder: { textAlign: 'center', fontFamily: 'DMSans-Regular', fontSize: 13 },
  scrambleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: SPACING.md },
  scrambleWord: { borderWidth: 1, borderRadius: RADIUS.sm, paddingVertical: 8, paddingHorizontal: 12 },
  scrambleWordSelected: { borderRadius: RADIUS.sm, paddingVertical: 8, paddingHorizontal: 12 },
  scrambleWordText: { color: '#FFFFFF', fontSize: 14, fontFamily: 'DMSans-Medium' },
  scrambleFeedback: { fontSize: 14, fontFamily: 'DMSans-SemiBold', textAlign: 'center', marginBottom: SPACING.md },
  scrambleBtns: { flexDirection: 'row', gap: 10, marginTop: SPACING.sm },
  resetBtn: { paddingVertical: 14, paddingHorizontal: 20, borderRadius: RADIUS.full, borderWidth: 1.5, alignItems: 'center' },
  resetBtnText: { fontSize: 14, fontFamily: 'DMSans-Medium' },
  // Names
  flipHint: { fontSize: 13, fontFamily: 'DMSans-Regular', marginBottom: SPACING.md },
  flipCardWrap: { width: width - 64, height: 220, marginBottom: SPACING.xl },
  nameCard: { width: '100%', height: '100%', borderRadius: 20, borderWidth: 2, padding: SPACING.xl, alignItems: 'center', justifyContent: 'center' },
  cardFace: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  cardBack: {},
  nameCardName: { fontSize: 26, fontFamily: 'Lora-SemiBold', textAlign: 'center', marginBottom: 12 },
  nameCardDivider: { width: 60, height: 1, marginVertical: 12 },
  nameCardHint: { fontSize: 13, fontFamily: 'DMSans-Regular' },
  nameMeaning: { fontSize: 20, fontFamily: 'Lora-SemiBold', textAlign: 'center', marginBottom: 4 },
  nameScripture: { fontSize: 13, fontFamily: 'DMSans-SemiBold', marginBottom: 12 },
  nameContext: { fontSize: 13, textAlign: 'center', lineHeight: 20, fontFamily: 'DMSans-Regular' },
  nameNavRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  nameNavBtn: { borderRadius: RADIUS.md, paddingVertical: 12, paddingHorizontal: 20, borderWidth: 1 },
  nameNavText: { fontSize: 14, fontFamily: 'DMSans-Medium' },
  nameCounter: { fontSize: 14, fontFamily: 'DMSans-Regular' },
  // Prayer
  prayerCatCard: { borderWidth: 2, borderRadius: RADIUS.lg, padding: SPACING.lg, alignItems: 'center', marginBottom: SPACING.md },
  prayerCatIcon: { fontSize: 44, marginBottom: 8 },
  prayerCatLabel: { fontSize: 22, fontFamily: 'Lora-SemiBold', marginBottom: 10 },
  prayerCatPrompt: { fontSize: 14, textAlign: 'center', lineHeight: 22, fontFamily: 'DMSans-Regular' },
  prayerSteps: { flexDirection: 'row', gap: 8, justifyContent: 'center', marginBottom: SPACING.lg },
  prayerStep: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  prayerStepText: { fontSize: 20 },
  prayerInput: { borderWidth: 1.5, borderRadius: RADIUS.md, padding: SPACING.md, fontSize: 15, lineHeight: 24, fontFamily: 'DMSans-Regular', minHeight: 140, marginBottom: SPACING.md },
  prayerDoneTitle: { fontSize: 24, fontFamily: 'Lora-SemiBold', textAlign: 'center', marginBottom: 4 },
  prayerDoneSub: { fontSize: 13, fontFamily: 'DMSans-Regular', textAlign: 'center', marginBottom: SPACING.xl },
  prayerSummaryItem: { borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderLeftWidth: 4 },
  prayerSummaryLabel: { fontSize: 13, fontFamily: 'DMSans-SemiBold', marginBottom: 6 },
  prayerSummaryText: { fontSize: 14, fontFamily: 'DMSans-Regular', lineHeight: 20 },
  // Fruits
  fruitCard: { borderRadius: RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, alignItems: 'center' },
  fruitName: { fontSize: 28, fontFamily: 'Lora-SemiBold', marginBottom: 4 },
  fruitVerse: { fontSize: 12, fontFamily: 'DMSans-Medium', marginBottom: 10 },
  fruitDef: { fontSize: 14, textAlign: 'center', lineHeight: 22, fontFamily: 'DMSans-Regular' },
  fruitQuestionCard: { borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.lg, borderWidth: 1 },
  fruitQuestion: { fontSize: 15, fontFamily: 'Lora-Italic', textAlign: 'center', lineHeight: 24 },
  fruitRateLabel: { fontSize: 13, fontFamily: 'DMSans-Regular', textAlign: 'center', marginBottom: SPACING.md },
  fruitRateRow: { flexDirection: 'row', gap: 10, justifyContent: 'center' },
  fruitRateBtn: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  fruitRateBtnText: { fontSize: 18, fontFamily: 'Lora-SemiBold' },
  fruitRateEmoji: { fontSize: 10 },
  avgCard: { borderRadius: RADIUS.lg, padding: SPACING.lg, alignItems: 'center', borderWidth: 1, marginBottom: SPACING.lg },
  fruitAvgNum: { fontSize: 52, fontFamily: 'Lora-SemiBold' },
  fruitAvgLabel: { fontSize: 14, fontFamily: 'DMSans-Regular' },
  fruitResultRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  fruitResultName: { fontSize: 13, fontFamily: 'DMSans-Medium' },
  fruitBar: { height: 8, borderRadius: 4 },
  fruitBarFill: { height: '100%', borderRadius: 4 },
  fruitScore: { fontSize: 12, fontFamily: 'DMSans-Regular', width: 28 },
  fruitNote: { borderRadius: RADIUS.md, padding: SPACING.md, borderWidth: 1, marginVertical: SPACING.lg },
  fruitNoteText: { fontSize: 14, fontFamily: 'Lora-Italic', lineHeight: 22, textAlign: 'center', marginBottom: 6 },
  fruitNoteRef: { fontSize: 12, fontFamily: 'DMSans-SemiBold', textAlign: 'center' },
});
