import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

// ⚠️  Replace with your actual Paystack PUBLIC key before building
const PAYSTACK_PUBLIC_KEY = 'pk_live_2d97871e3b2082766dfadeea229d64d8d2a8389e';

const DONATION_AMOUNTS = [5000, 10000, 20000, 50000, 100000, 500000];

const TIERS = [
  { id: 'seed',   label: 'Seed Partner',    amount: 5000,  emoji: '🌱', perks: 'Name in app credits. Monthly prayer for you.' },
  { id: 'branch', label: 'Branch Partner',  amount: 10000,  emoji: '🌿', perks: 'Seed perks + feature suggestions get priority.' },
  { id: 'tree',   label: 'Tree Partner',    amount: 20000, emoji: '🌳', perks: 'Branch perks + personal shoutout in updates.' },
  { id: 'pillar', label: 'Kingdom Pillar',  amount: 100000, emoji: '🏛', perks: 'Tree perks + featured in About page permanently.' },
];

type Mode = 'overview' | 'one-time' | 'sponsor' | 'pay';

export default function DonateScreen() {
  const navigation = useNavigation<any>();
  const [mode, setMode] = useState<Mode>('overview');
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedTier, setSelectedTier] = useState<(typeof TIERS)[0] | null>(null);
  const [email, setEmail] = useState('');
  const [payHtml, setPayHtml] = useState('');

  const getAmount = () =>
    mode === 'sponsor' ? (selectedTier?.amount ?? 0) : (selectedAmount || parseInt(customAmount) || 0);

  const startPayment = () => {
    const amount = getAmount();
    if (!email.trim()) { Alert.alert('Email Required', 'Enter your email to continue.'); return; }
    if (amount < 100) { Alert.alert('Invalid Amount', 'Minimum is ₦100.'); return; }

    const ref = `wwh_${Date.now()}`;
    const label = mode === 'sponsor' ? `Sponsor: ${selectedTier?.label}` : 'Walk With Him Donation';
    const html = `<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{margin:0;background:#0A1628;display:flex;align-items:center;justify-content:center;height:100vh;color:#F0EDE6;font-family:sans-serif;font-size:16px;text-align:center;padding:20px;box-sizing:border-box}p{opacity:.6}</style>
</head><body><div><p>Opening payment gateway…</p><p style="font-size:13px;margin-top:12px">Do not close this screen</p></div>
<script src="https://js.paystack.co/v1/inline.js"></script>
<script>
window.onload=function(){
  PaystackPop.setup({
    key:'${PAYSTACK_PUBLIC_KEY}',
    email:'${email.replace(/'/g,"\\'")}',
    amount:${amount * 100},
    currency:'NGN',
    ref:'${ref}',
    metadata:{custom_fields:[{display_name:'Purpose',variable_name:'purpose',value:'${label.replace(/'/g,"\\'")}'}]},
    onClose:function(){window.ReactNativeWebView.postMessage(JSON.stringify({event:'closed'}))},
    callback:function(r){window.ReactNativeWebView.postMessage(JSON.stringify({event:'success',reference:r.reference}))}
  }).openIframe();
};
</script></body></html>`;
    setPayHtml(html);
    setMode('pay');
  };

  const onWebMessage = (e: any) => {
    try {
      const data = JSON.parse(e.nativeEvent.data);
      if (data.event === 'success') {
        setMode('overview');
        Alert.alert('🙏 Thank You!',
          mode === 'sponsor'
            ? `You are now a ${selectedTier?.label}! Your support keeps this ministry alive.`
            : 'Your donation has been received. You just invested in someone\'s walk with God — that\'s eternal.',
          [{ text: 'Amen 🙏' }]);
        setEmail(''); setSelectedAmount(0); setCustomAmount(''); setSelectedTier(null);
      } else if (data.event === 'closed') {
        setMode(selectedTier ? 'sponsor' : 'one-time');
      }
    } catch {}
  };

  // ── PAY SCREEN ─────────────────────────────────────────
  if (mode === 'pay') {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.nav}>
          <TouchableOpacity onPress={() => setMode(selectedTier ? 'sponsor' : 'one-time')}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Complete Payment</Text>
          <View style={{ width: 24 }} />
        </View>
        <WebView
          source={{ html: payHtml }}
          onMessage={onWebMessage}
          style={{ flex: 1 }}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
        />
      </SafeAreaView>
    );
  }

  // ── OVERVIEW ───────────────────────────────────────────
  if (mode === 'overview') {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.nav}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Support the App</Text>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <LinearGradient colors={['#0A1628', '#1A2E4A']} style={styles.hero}>
            <Text style={styles.heroEmoji}>💝</Text>
            <Text style={styles.heroTitle}>If This App Has Blessed You</Text>
            <Text style={styles.heroSub}>
              Walk With Him is free and will always be free. But keeping it alive — building, improving, and reaching more people — takes real resources. If God has moved through this app, consider giving back.
            </Text>
          </LinearGradient>
          <View style={styles.pad}>
            {[
              { emoji: '🎁', title: 'One-Time Donation', sub: 'Give any amount. A one-time thank-you gift.', next: 'one-time' as Mode },
              { emoji: '🏛', title: 'Monthly Sponsorship', sub: 'Choose a tier and support the app every month.', next: 'sponsor' as Mode },
            ].map(item => (
              <TouchableOpacity key={item.next} style={styles.modeCard} onPress={() => setMode(item.next)}>
                <Text style={styles.modeEmoji}>{item.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modeTitle}>{item.title}</Text>
                  <Text style={styles.modeSub}>{item.sub}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.gold} />
              </TouchableOpacity>
            ))}
            <View style={styles.whereCard}>
              <Text style={styles.whereTitle}>Where It Goes</Text>
              <Text style={styles.whereText}>Server costs, API fees, new features, and spreading the app to people who need it. This is not a business. This is a ministry.</Text>
            </View>
          </View>
          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── ONE-TIME ────────────────────────────────────────────
  if (mode === 'one-time') {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.nav}>
          <TouchableOpacity onPress={() => setMode('overview')}>
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.navTitle}>One-Time Donation</Text>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.pad}>
          <Text style={styles.label}>Choose amount (₦)</Text>
          <View style={styles.amtGrid}>
            {DONATION_AMOUNTS.map(a => (
              <TouchableOpacity key={a} style={[styles.amtBtn, selectedAmount === a && styles.amtBtnActive]}
                onPress={() => { setSelectedAmount(a); setCustomAmount(''); }}>
                <Text style={[styles.amtText, selectedAmount === a && styles.amtTextActive]}>
                  ₦{a.toLocaleString()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.label}>Or enter custom amount</Text>
          <TextInput style={styles.input} value={customAmount}
            onChangeText={v => { setCustomAmount(v); setSelectedAmount(0); }}
            placeholder="e.g. 3500" placeholderTextColor={COLORS.text3} keyboardType="numeric" />
          <Text style={styles.label}>Your email</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail}
            placeholder="your@email.com" placeholderTextColor={COLORS.text3}
            keyboardType="email-address" autoCapitalize="none" />
          <TouchableOpacity
            style={[styles.payBtn, (!getAmount() || !email.trim()) && styles.payBtnDis]}
            onPress={startPayment} disabled={!getAmount() || !email.trim()}>
            <Text style={styles.payBtnTxt}>Donate ₦{getAmount().toLocaleString()} →</Text>
          </TouchableOpacity>
          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── SPONSOR ─────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.nav}>
        <TouchableOpacity onPress={() => setMode('overview')}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Monthly Sponsorship</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.pad}>
        <Text style={styles.sponsorIntro}>Choose a tier and give monthly. Every sponsor is prayed for by name.</Text>
        {TIERS.map(tier => (
          <TouchableOpacity key={tier.id}
            style={[styles.tierCard, selectedTier?.id === tier.id && styles.tierCardActive]}
            onPress={() => setSelectedTier(tier)}>
            <View style={styles.tierHeader}>
              <Text style={styles.tierEmoji}>{tier.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.tierLabel}>{tier.label}</Text>
                <Text style={styles.tierAmt}>₦{tier.amount.toLocaleString()}/month</Text>
              </View>
              {selectedTier?.id === tier.id && <Ionicons name="checkmark-circle" size={22} color={COLORS.gold} />}
            </View>
            <Text style={styles.tierPerks}>{tier.perks}</Text>
          </TouchableOpacity>
        ))}
        {selectedTier && (
          <>
            <Text style={styles.label}>Your email</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail}
              placeholder="your@email.com" placeholderTextColor={COLORS.text3}
              keyboardType="email-address" autoCapitalize="none" />
            <TouchableOpacity
              style={[styles.payBtn, !email.trim() && styles.payBtnDis]}
              onPress={startPayment} disabled={!email.trim()}>
              <Text style={styles.payBtnTxt}>Become a {selectedTier.label} →</Text>
            </TouchableOpacity>
          </>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  navTitle: { color: COLORS.text, fontSize: 16, fontFamily: 'DMSans-SemiBold' },
  hero: { padding: SPACING.xl, alignItems: 'center' },
  heroEmoji: { fontSize: 52, marginBottom: 16 },
  heroTitle: { color: COLORS.white, fontSize: 22, fontFamily: 'Lora-SemiBold', textAlign: 'center', marginBottom: 12 },
  heroSub: { color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 22, textAlign: 'center', fontFamily: 'DMSans-Regular' },
  pad: { padding: SPACING.lg },
  modeCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  modeEmoji: { fontSize: 32 },
  modeTitle: { color: COLORS.text, fontSize: 16, fontFamily: 'DMSans-SemiBold', marginBottom: 4 },
  modeSub: { color: COLORS.text2, fontSize: 13, fontFamily: 'DMSans-Regular' },
  whereCard: { backgroundColor: COLORS.bg2, borderRadius: RADIUS.md, padding: SPACING.lg, borderLeftWidth: 3, borderLeftColor: COLORS.gold },
  whereTitle: { color: COLORS.text, fontSize: 15, fontFamily: 'DMSans-SemiBold', marginBottom: 8 },
  whereText: { color: COLORS.text2, fontSize: 13, lineHeight: 20, fontFamily: 'DMSans-Regular' },
  label: { color: COLORS.text2, fontSize: 13, fontFamily: 'DMSans-Medium', marginBottom: 10, marginTop: 4 },
  amtGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: SPACING.lg },
  amtBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: RADIUS.md, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  amtBtnActive: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  amtText: { color: COLORS.text2, fontSize: 14, fontFamily: 'DMSans-Medium' },
  amtTextActive: { color: COLORS.white },
  input: { backgroundColor: COLORS.surface, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: 14, color: COLORS.text, fontSize: 15, fontFamily: 'DMSans-Regular', marginBottom: SPACING.md },
  payBtn: { backgroundColor: COLORS.gold, borderRadius: RADIUS.full, paddingVertical: 15, alignItems: 'center', marginTop: SPACING.sm },
  payBtnDis: { opacity: 0.4 },
  payBtnTxt: { color: COLORS.white, fontSize: 16, fontFamily: 'DMSans-SemiBold' },
  sponsorIntro: { color: COLORS.text2, fontSize: 13, lineHeight: 20, fontFamily: 'DMSans-Regular', marginBottom: SPACING.lg },
  tierCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1.5, borderColor: COLORS.border },
  tierCardActive: { borderColor: COLORS.gold },
  tierHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: SPACING.sm },
  tierEmoji: { fontSize: 28 },
  tierLabel: { color: COLORS.text, fontSize: 16, fontFamily: 'DMSans-SemiBold' },
  tierAmt: { color: COLORS.gold, fontSize: 14, fontFamily: 'DMSans-Medium' },
  tierPerks: { color: COLORS.text2, fontSize: 13, fontFamily: 'DMSans-Regular', lineHeight: 18 },
});
