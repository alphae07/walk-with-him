import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, Linking, KeyboardAvoidingView, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, useThemeColors } from '../constants/theme';

const BUILDER_EMAIL = 'support@alphae-x.app';
const BUILDER_PHONE = '+2349113216637';

function NavBar({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <View style={[styles.navBar, {backgroundColor: C.bg, borderBottomColor: C.border + "60"}]}>
      <TouchableOpacity onPress={onBack}><Ionicons name="chevron-back" size={24} color={C.text} /></TouchableOpacity>
      <Text style={styles.navTitle}>{title}</Text>
      <View style={{ width: 24 }} />
    </View>
  );
}

// ── SUGGESTIONS ────────────────────────────────────────────
export function SuggestionsScreen() {
  const C = useThemeColors();
  const styles = getStyles(C);
  const navigation = useNavigation<any>();
  const [name, setName] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [category, setCategory] = useState('');
  const [sending, setSending] = useState(false);

  const CATEGORIES = ['New Feature', 'Game Idea', 'Book/Sermon', 'Bug Report', 'UI Improvement', 'Other'];

  const submit = async () => {
    if (!suggestion.trim()) { Alert.alert('Missing Content', 'Please write your suggestion.'); return; }
    setSending(true);
    const subject = `Walk With Him - Suggestion: ${category || 'General'}`;
    const body = `Name: ${name || 'Anonymous'}\nCategory: ${category || 'General'}\n\nSuggestion:\n${suggestion}`;
    const url = `mailto:${BUILDER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    try {
      await Linking.openURL(url);
      setName(''); setSuggestion(''); setCategory('');
      Alert.alert('Sent!', 'Your suggestion has been submitted. Thank you for helping make this app better!');
    } catch {
      Alert.alert('Error', 'Could not open email. Please email us directly at ' + BUILDER_EMAIL);
    } finally { setSending(false); }
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: C.bg}]} edges={['top']}>
      <NavBar title="Suggestions" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.headerCard}>
            <Text style={styles.headerEmoji}>💡</Text>
            <Text style={styles.headerTitle}>Your Idea Could Change Lives</Text>
            <Text style={styles.headerSubtitle}>
              If you've thought "I wish this app had..." — tell me. Every suggestion is read. The best ones get built.
            </Text>
          </View>

          <Text style={styles.label}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow} contentContainerStyle={{ gap: 8 }}>
            {CATEGORIES.map(c => (
              <TouchableOpacity key={c} style={[styles.chip, category === c && styles.chipActive]} onPress={() => setCategory(c)}>
                <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.label}>Your Name (optional)</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Anonymous if blank" placeholderTextColor={C.text3} />

          <Text style={styles.label}>Your Suggestion</Text>
          <TextInput
            style={[styles.input, styles.textArea]} value={suggestion} onChangeText={setSuggestion}
            placeholder="Describe your idea in as much detail as you can. What problem does it solve? What would it look like?"
            placeholderTextColor={C.text3} multiline numberOfLines={7} textAlignVertical="top"
          />

          <TouchableOpacity style={[styles.submitBtn, sending && styles.submitBtnDisabled]} onPress={submit} disabled={sending}>
            <Text style={styles.submitBtnText}>{sending ? 'Opening Email...' : 'Submit Suggestion →'}</Text>
          </TouchableOpacity>

          <Text style={styles.note}>This opens your email app pre-filled. Hit send and you're done.</Text>
          <View style={{ height: 32 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── TESTIMONY ──────────────────────────────────────────────
export function TestimonyScreen() {
  const C = useThemeColors();
  const styles = getStyles(C);
  const navigation = useNavigation<any>();
  const [name, setName] = useState('');
  const [testimony, setTestimony] = useState('');
  const [category, setCategory] = useState('');
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const TESTIMONY_CATEGORIES = ['God Is Calling', 'Journal', 'Bible Reading', 'Games', 'Purpose Journal', 'Sermons', 'Spiritual Disciplines', 'Overall App', 'Something Else'];

  const submit = async () => {
    if (!testimony.trim() || testimony.trim().length < 50) {
      Alert.alert('Too Short', 'Please write at least 50 characters. A real testimony deserves more than a sentence.');
      return;
    }
    setSending(true);
    const subject = `Walk With Him - Testimony`;
    const body = `Name: ${name || 'Anonymous'}\nFeature: ${category || 'General'}\n\nTestimony:\n${testimony}\n\n---\nSent from Walk With Him App`;
    const url = `mailto:${BUILDER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    try {
      await Linking.openURL(url);
      setSubmitted(true);
    } catch {
      Alert.alert('Error', 'Please email your testimony directly to ' + BUILDER_EMAIL);
    } finally { setSending(false); }
  };

  if (submitted) {
    return (
      <SafeAreaView style={[styles.container, {backgroundColor: C.bg}]} edges={['top']}>
        <NavBar title="Testimony" onBack={() => navigation.goBack()} />
        <View style={styles.successContainer}>
          <Text style={styles.successEmoji}>🙌</Text>
          <Text style={styles.successTitle}>Praise God!</Text>
          <Text style={styles.successText}>
            Your testimony has been submitted. Every testimony is a declaration that God is real and active. Thank you for sharing.
          </Text>
          <Text style={styles.successVerse}>
            "They triumphed over him by the blood of the Lamb and by the word of their testimony."{'\n'}— Revelation 12:11
          </Text>
          <TouchableOpacity style={styles.submitBtn} onPress={() => { setSubmitted(false); setName(''); setTestimony(''); setCategory(''); }}>
            <Text style={styles.submitBtnText}>Share Another</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: C.bg}]} edges={['top']}>
      <NavBar title="Give a Testimony" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.headerCard}>
            <Text style={styles.headerEmoji}>🙌</Text>
            <Text style={styles.headerTitle}>How Has God Moved?</Text>
            <Text style={styles.headerSubtitle}>
              Your testimony isn't just encouragement — it's a weapon. It declares the goodness of God and builds faith in others. Don't keep it to yourself.
            </Text>
          </View>

          <View style={styles.verseCard}>
            <Text style={styles.verseText}>"They triumphed over him by the blood of the Lamb and by the word of their testimony."</Text>
            <Text style={styles.verseRef}>— Revelation 12:11</Text>
          </View>

          <Text style={styles.label}>Which feature blessed you? (optional)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow} contentContainerStyle={{ gap: 8 }}>
            {TESTIMONY_CATEGORIES.map(c => (
              <TouchableOpacity key={c} style={[styles.chip, category === c && styles.chipActive]} onPress={() => setCategory(c)}>
                <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.label}>Your Name (optional)</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Anonymous if blank" placeholderTextColor={C.text3} />

          <Text style={styles.label}>Your Testimony</Text>
          <TextInput
            style={[styles.input, styles.textArea]} value={testimony} onChangeText={setTestimony}
            placeholder="What happened? How did God show up? Be specific — the more real the better."
            placeholderTextColor={C.text3} multiline numberOfLines={8} textAlignVertical="top"
          />

          <TouchableOpacity style={[styles.submitBtn, sending && styles.submitBtnDisabled]} onPress={submit} disabled={sending}>
            <Text style={styles.submitBtnText}>{sending ? 'Opening Email...' : 'Submit Testimony 🙏'}</Text>
          </TouchableOpacity>
          <Text style={styles.note}>This opens your email app pre-filled. Hit send to submit.</Text>
          <View style={{ height: 32 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── CONTACT ────────────────────────────────────────────────
export function ContactScreen() {
  const C = useThemeColors();
  const styles = getStyles(C);
  const navigation = useNavigation<any>();

  const contacts = [
    { label: 'Email', value: BUILDER_EMAIL, icon: '📧', action: () => Linking.openURL(`mailto:${BUILDER_EMAIL}`) },
    { label: 'Phone / WhatsApp', value: BUILDER_PHONE, icon: '📱', action: () => Linking.openURL(`https://wa.me/${BUILDER_PHONE.replace('+', '')}`) },
    { label: 'Call', value: BUILDER_PHONE, icon: '📞', action: () => Linking.openURL(`tel:${BUILDER_PHONE}`) },
  ];

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: C.bg}]} edges={['top']}>
      <NavBar title="Contact" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerCard}>
          <Text style={styles.headerEmoji}>👋</Text>
          <Text style={styles.headerTitle}>Get in Touch</Text>
          <Text style={styles.headerSubtitle}>
            Whether you have a question, a prayer request, a partnership idea, or just want to say hello — reach out. Every message is read.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Alphae X</Text>
        <Text style={styles.sectionSubtitle}>Builder · Believer · Available</Text>

        {contacts.map(c => (
          <TouchableOpacity key={c.label} style={styles.contactCard} onPress={c.action}>
            <Text style={styles.contactIcon}>{c.icon}</Text>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>{c.label}</Text>
              <Text style={styles.contactValue}>{c.value}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={C.gold} />
          </TouchableOpacity>
        ))}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Response Times</Text>
          <Text style={styles.infoText}>Emails are typically answered within 24–48 hours. WhatsApp is usually faster. If it's urgent, both works.</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>What Can You Contact Me About?</Text>
          {['Bug reports or app issues', 'Prayer requests — I pray for every one', 'Testimonies (also use the Testimony screen!)', 'Partnership or collaboration', 'Press or media inquiries', 'Just saying thank you 🙏'].map(item => (
            <View key={item} style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (C: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  navTitle: { color: C.text, fontSize: 16, fontFamily: 'DMSans-SemiBold' },
  content: { padding: SPACING.lg },
  headerCard: { backgroundColor: C.bg2, borderRadius: RADIUS.lg, padding: SPACING.xl, alignItems: 'center', marginBottom: SPACING.xl, borderWidth: 1, borderColor: C.border },
  headerEmoji: { fontSize: 52, marginBottom: 12 },
  headerTitle: { color: C.text, fontSize: 20, fontFamily: 'Lora-SemiBold', textAlign: 'center', marginBottom: 10 },
  headerSubtitle: { color: C.text2, fontSize: 14, lineHeight: 22, textAlign: 'center', fontFamily: 'DMSans-Regular' },
  label: { color: C.text2, fontSize: 13, fontFamily: 'DMSans-Medium', marginBottom: 8, marginTop: 4 },
  input: { backgroundColor: C.surface, borderWidth: 1.5, borderColor: C.border, borderRadius: RADIUS.md, padding: 14, color: C.text, fontSize: 15, fontFamily: 'DMSans-Regular', marginBottom: SPACING.md },
  textArea: { minHeight: 160, textAlignVertical: 'top' },
  categoryRow: { maxHeight: 48, marginBottom: SPACING.md },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADIUS.full, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border },
  chipActive: { backgroundColor: C.gold, borderColor: C.gold },
  chipText: { color: C.text2, fontSize: 12, fontFamily: 'DMSans-Medium' },
  chipTextActive: { color: C.white },
  submitBtn: { backgroundColor: C.gold, borderRadius: RADIUS.full, paddingVertical: 15, alignItems: 'center' },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { color: C.white, fontSize: 15, fontFamily: 'DMSans-SemiBold' },
  note: { color: C.text3, fontSize: 12, textAlign: 'center', marginTop: 10, fontFamily: 'DMSans-Regular' },
  verseCard: { backgroundColor: C.bg2, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.lg, borderLeftWidth: 3, borderLeftColor: C.gold },
  verseText: { color: C.gold, fontSize: 13, fontFamily: 'Lora-Italic', lineHeight: 20, marginBottom: 6 },
  verseRef: { color: C.gold, fontSize: 11, fontFamily: 'DMSans-SemiBold' },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  successEmoji: { fontSize: 64, marginBottom: 20 },
  successTitle: { color: C.text, fontSize: 28, fontFamily: 'Lora-SemiBold', marginBottom: 12 },
  successText: { color: C.text2, fontSize: 15, textAlign: 'center', lineHeight: 24, fontFamily: 'DMSans-Regular', marginBottom: 20 },
  successVerse: { color: C.gold, fontSize: 13, fontFamily: 'Lora-Italic', textAlign: 'center', lineHeight: 22, marginBottom: 40 },
  sectionTitle: { color: C.text, fontSize: 18, fontFamily: 'Lora-SemiBold', marginBottom: 4 },
  sectionSubtitle: { color: C.text3, fontSize: 13, fontFamily: 'DMSans-Regular', marginBottom: SPACING.lg },
  contactCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: C.surface, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: C.border },
  contactIcon: { fontSize: 28, width: 40, textAlign: 'center' },
  contactInfo: { flex: 1 },
  contactLabel: { color: C.text3, fontSize: 11, fontFamily: 'DMSans-Medium', marginBottom: 3 },
  contactValue: { color: C.text, fontSize: 14, fontFamily: 'DMSans-Medium' },
  infoCard: { backgroundColor: C.surface, borderRadius: RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: C.border },
  infoTitle: { color: C.text, fontSize: 15, fontFamily: 'DMSans-SemiBold', marginBottom: 10 },
  infoText: { color: C.text2, fontSize: 13, lineHeight: 20, fontFamily: 'DMSans-Regular' },
  bulletRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  bullet: { color: C.gold, fontSize: 14 },
  bulletText: { color: C.text2, fontSize: 13, fontFamily: 'DMSans-Regular', flex: 1, lineHeight: 20 },
});
