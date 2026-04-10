import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors, SPACING, RADIUS } from '../constants/theme';
import { Storage, UserProfile, defaultProfile } from '../utils/storage';

const PAYSTACK_PUBLIC_KEY = 'pk_live_2d97871e3b2082766dfadeea229d64d8d2a8389e';

// Currency configs
const CURRENCIES: Record<string, { symbol: string; code: string; label: string; amounts: number[]; toKobo: number }> = {
  USD: { symbol: '$', code: 'USD', label: 'US Dollar', amounts: [3, 5, 10, 20, 50, 100], toKobo: 100 },
  NGN: { symbol: '₦', code: 'NGN', label: 'Nigerian Naira', amounts: [500, 1000, 2000, 5000, 10000, 50000], toKobo: 100 },
  GBP: { symbol: '£', code: 'GBP', label: 'British Pound', amounts: [2, 5, 10, 20, 50, 100], toKobo: 100 },
  EUR: { symbol: '€', code: 'EUR', label: 'Euro', amounts: [3, 5, 10, 25, 50, 100], toKobo: 100 },
  GHS: { symbol: 'GH₵', code: 'GHS', label: 'Ghana Cedi', amounts: [10, 20, 50, 100, 200, 500], toKobo: 100 },
  KES: { symbol: 'KSh', code: 'KES', label: 'Kenyan Shilling', amounts: [100, 300, 500, 1000, 2000, 5000], toKobo: 100 },
  ZAR: { symbol: 'R', code: 'ZAR', label: 'South African Rand', amounts: [20, 50, 100, 200, 500, 1000], toKobo: 100 },
};

// Tiers in USD (Paystack auto-converts or you handle)
const TIERS = [
  { id: 'seed', label: 'Seed Partner', amountUSD: 3, emoji: '🌱', perks: 'Name in app credits. Monthly prayer for you.' },
  { id: 'branch', label: 'Branch Partner', amountUSD: 10, emoji: '🌿', perks: 'Seed perks + feature suggestions get priority.' },
  { id: 'tree', label: 'Tree Partner', amountUSD: 25, emoji: '🌳', perks: 'Branch perks + personal shoutout in updates.' },
  { id: 'pillar', label: 'Kingdom Pillar', amountUSD: 100, emoji: '🏛', perks: 'Tree perks + featured in About page permanently.' },
];

// Approx conversion rates to USD
const USD_RATES: Record<string, number> = { USD: 1, NGN: 0.00065, GBP: 1.27, EUR: 1.09, GHS: 0.067, KES: 0.0077, ZAR: 0.055 };

type Mode = 'overview' | 'one-time' | 'sponsor' | 'pay' | 'currency';

export default function DonateScreen() {
  const navigation = useNavigation<any>();
  const C = useThemeColors();
  const [mode, setMode] = useState<Mode>('overview');
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedTier, setSelectedTier] = useState<typeof TIERS[0] | null>(null);
  const [email, setEmail] = useState('');
  const [payHtml, setPayHtml] = useState('');
  const [currency, setCurrency] = useState('USD');

  useFocusEffect(useCallback(() => {
    Storage.get<UserProfile>('profile', defaultProfile).then(p => {
      if (p?.preferredCurrency) setCurrency(p.preferredCurrency);
    });
  }, []));

  const cur = CURRENCIES[currency];

  const getTierAmount = (tier: typeof TIERS[0]) => {
    const rate = USD_RATES[currency] ? 1 / USD_RATES[currency] : 1;
    return Math.round(tier.amountUSD * rate);
  };

  const getAmount = () =>
    mode === 'sponsor'
      ? (selectedTier ? getTierAmount(selectedTier) : 0)
      : (selectedAmount || parseInt(customAmount) || 0);

  const startPayment = () => {
    const amount = getAmount();
    if (!email.trim()) { Alert.alert('Email Required', 'Enter your email to continue.'); return; }
    if (amount < 1) { Alert.alert('Invalid Amount', 'Please enter a valid amount.'); return; }

    const ref = `wwh_${Date.now()}`;
    const label = mode === 'sponsor' ? `Sponsor: ${selectedTier?.label}` : 'Walk With Him Donation';
    const amountInSubunit = amount * cur.toKobo;

    const html = `<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{margin:0;background:#0A1628;display:flex;align-items:center;justify-content:center;height:100vh;color:#F0EDE6;font-family:sans-serif;font-size:16px;text-align:center;padding:20px;box-sizing:border-box}p{opacity:.6}</style>
</head><body><div><p>Opening payment gateway…</p><p style="font-size:13px;margin-top:12px">Do not close this screen</p></div>
<script src="https://js.paystack.co/v1/inline.js"></script>
<script>
window.onload=function(){
  PaystackPop.setup({
    key:'${PAYSTACK_PUBLIC_KEY}',
    email:'${email.replace(/'/g, "\\'")}',
    amount:${amountInSubunit},
    currency:'${cur.code}',
    ref:'${ref}',
    metadata:{custom_fields:[{display_name:'Purpose',variable_name:'purpose',value:'${label.replace(/'/g, "\\'")}'}]},
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

  if (mode === 'pay') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: C.bg }]} edges={['top']}>
        <View style={[styles.nav, { borderBottomColor: C.border }]}>
          <TouchableOpacity onPress={() => setMode(selectedTier ? 'sponsor' : 'one-time')}>
            <Ionicons name="close" size={24} color={C.text} />
          </TouchableOpacity>
          <Text style={[styles.navTitle, { color: C.text }]}>Complete Payment</Text>
          <View style={{ width: 24 }} />
        </View>
        <WebView source={{ html: payHtml }} onMessage={onWebMessage} style={{ flex: 1 }} javaScriptEnabled domStorageEnabled startInLoadingState />
      </SafeAreaView>
    );
  }

  if (mode === 'currency') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: C.bg }]} edges={['top']}>
        <View style={[styles.nav, { borderBottomColor: C.border }]}>
          <TouchableOpacity onPress={() => setMode('overview')}>
            <Ionicons name="chevron-back" size={24} color={C.text} />
          </TouchableOpacity>
          <Text style={[styles.navTitle, { color: C.text }]}>Select Currency</Text>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView contentContainerStyle={styles.pad}>
          <Text style={[styles.sectionNote, { color: C.text2 }]}>All amounts shown in your chosen currency. Payments processed by Paystack.</Text>
          {Object.values(CURRENCIES).map(c => (
            <TouchableOpacity key={c.code}
              style={[styles.currencyRow, { backgroundColor: C.surface, borderColor: currency === c.code ? C.gold : C.border }]}
              onPress={async () => {
                setCurrency(c.code);
                const p = await Storage.get<UserProfile>('profile', defaultProfile);
                if (p) await Storage.set('profile', { ...p, preferredCurrency: c.code as any });
                setSelectedAmount(0); setCustomAmount('');
                setMode('overview');
              }}>
              <Text style={styles.currencySymbol}>{c.symbol}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.currencyCode, { color: C.text }]}>{c.code}</Text>
                <Text style={[styles.currencyLabel, { color: C.text3 }]}>{c.label}</Text>
              </View>
              {currency === c.code && <Ionicons name="checkmark-circle" size={22} color={C.gold} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (mode === 'overview') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: C.bg }]} edges={['top']}>
        <View style={[styles.nav, { borderBottomColor: C.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={C.text} />
          </TouchableOpacity>
          <Text style={[styles.navTitle, { color: C.text }]}>Support the App</Text>
          <TouchableOpacity onPress={() => setMode('currency')} style={[styles.currencyPill, { backgroundColor: C.surface, borderColor: C.border }]}>
            <Text style={[styles.currencyPillText, { color: C.gold }]}>{cur.symbol} {currency}</Text>
          </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <LinearGradient colors={['#0A1628', '#1A2E4A']} style={styles.hero}>
            <Text style={styles.heroEmoji}>💝</Text>
            <Text style={styles.heroTitle}>If This App Has Blessed You</Text>
            <Text style={styles.heroSub}>Walk With Him is free and will always be free. But keeping it alive — building, improving, and reaching more people — takes real resources. If God has moved through this app, consider giving back.</Text>
          </LinearGradient>
          <View style={styles.pad}>
            {[
              { emoji: '🎁', title: 'One-Time Donation', sub: 'Give any amount. A one-time thank-you gift.', next: 'one-time' as Mode },
              { emoji: '🏛', title: 'Monthly Sponsorship', sub: 'Choose a tier and support the app every month.', next: 'sponsor' as Mode },
            ].map(item => (
              <TouchableOpacity key={item.next} style={[styles.modeCard, { backgroundColor: C.surface, borderColor: C.border }]} onPress={() => setMode(item.next)}>
                <Text style={styles.modeEmoji}>{item.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.modeTitle, { color: C.text }]}>{item.title}</Text>
                  <Text style={[styles.modeSub, { color: C.text2 }]}>{item.sub}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={C.gold} />
              </TouchableOpacity>
            ))}
            <View style={[styles.whereCard, { backgroundColor: C.bg2, borderLeftColor: C.gold }]}>
              <Text style={[styles.whereTitle, { color: C.text }]}>Where It Goes</Text>
              <Text style={[styles.whereText, { color: C.text2 }]}>Server costs, API fees, new features, and spreading the app to people who need it. This is not a business. This is a ministry.</Text>
            </View>
          </View>
          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (mode === 'one-time') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: C.bg }]} edges={['top']}>
        <View style={[styles.nav, { borderBottomColor: C.border }]}>
          <TouchableOpacity onPress={() => setMode('overview')}>
            <Ionicons name="chevron-back" size={24} color={C.text} />
          </TouchableOpacity>
          <Text style={[styles.navTitle, { color: C.text }]}>One-Time Donation</Text>
          <TouchableOpacity onPress={() => setMode('currency')} style={[styles.currencyPill, { backgroundColor: C.surface, borderColor: C.border }]}>
            <Text style={[styles.currencyPillText, { color: C.gold }]}>{cur.symbol} {currency}</Text>
          </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.pad}>
          <Text style={[styles.label, { color: C.text2 }]}>Choose amount ({cur.symbol})</Text>
          <View style={styles.amtGrid}>
            {cur.amounts.map(a => (
              <TouchableOpacity key={a} style={[styles.amtBtn, { backgroundColor: C.surface, borderColor: selectedAmount === a ? C.gold : C.border }, selectedAmount === a && { backgroundColor: C.gold }]}
                onPress={() => { setSelectedAmount(a); setCustomAmount(''); }}>
                <Text style={[styles.amtText, { color: selectedAmount === a ? '#FFFFFF' : C.text2 }]}>{cur.symbol}{a.toLocaleString()}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[styles.label, { color: C.text2 }]}>Or enter custom amount</Text>
          <TextInput style={[styles.input, { backgroundColor: C.surface, borderColor: C.border, color: C.text }]}
            value={customAmount} onChangeText={v => { setCustomAmount(v); setSelectedAmount(0); }}
            placeholder={`e.g. ${cur.amounts[2]}`} placeholderTextColor={C.text3} keyboardType="numeric" />
          <Text style={[styles.label, { color: C.text2 }]}>Your email</Text>
          <TextInput style={[styles.input, { backgroundColor: C.surface, borderColor: C.border, color: C.text }]}
            value={email} onChangeText={setEmail} placeholder="your@email.com"
            placeholderTextColor={C.text3} keyboardType="email-address" autoCapitalize="none" />
          <TouchableOpacity style={[styles.payBtn, { backgroundColor: C.gold }, (!getAmount() || !email.trim()) && styles.payBtnDis]}
            onPress={startPayment} disabled={!getAmount() || !email.trim()}>
            <Text style={styles.payBtnTxt}>Donate {cur.symbol}{getAmount().toLocaleString()} →</Text>
          </TouchableOpacity>
          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // SPONSOR
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bg }]} edges={['top']}>
      <View style={[styles.nav, { borderBottomColor: C.border }]}>
        <TouchableOpacity onPress={() => setMode('overview')}>
          <Ionicons name="chevron-back" size={24} color={C.text} />
        </TouchableOpacity>
        <Text style={[styles.navTitle, { color: C.text }]}>Monthly Sponsorship</Text>
        <TouchableOpacity onPress={() => setMode('currency')} style={[styles.currencyPill, { backgroundColor: C.surface, borderColor: C.border }]}>
          <Text style={[styles.currencyPillText, { color: C.gold }]}>{cur.symbol} {currency}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.pad}>
        <Text style={[styles.sponsorIntro, { color: C.text2 }]}>Choose a tier and give monthly. Every sponsor is prayed for by name.</Text>
        {TIERS.map(tier => (
          <TouchableOpacity key={tier.id}
            style={[styles.tierCard, { backgroundColor: C.surface, borderColor: selectedTier?.id === tier.id ? C.gold : C.border }]}
            onPress={() => setSelectedTier(tier)}>
            <View style={styles.tierHeader}>
              <Text style={styles.tierEmoji}>{tier.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.tierLabel, { color: C.text }]}>{tier.label}</Text>
                <Text style={[styles.tierAmt, { color: C.gold }]}>{cur.symbol}{getTierAmount(tier).toLocaleString()}/month</Text>
              </View>
              {selectedTier?.id === tier.id && <Ionicons name="checkmark-circle" size={22} color={C.gold} />}
            </View>
            <Text style={[styles.tierPerks, { color: C.text2 }]}>{tier.perks}</Text>
          </TouchableOpacity>
        ))}
        {selectedTier && (
          <>
            <Text style={[styles.label, { color: C.text2 }]}>Your email</Text>
            <TextInput style={[styles.input, { backgroundColor: C.surface, borderColor: C.border, color: C.text }]}
              value={email} onChangeText={setEmail} placeholder="your@email.com"
              placeholderTextColor={C.text3} keyboardType="email-address" autoCapitalize="none" />
            <TouchableOpacity style={[styles.payBtn, { backgroundColor: C.gold }, !email.trim() && styles.payBtnDis]}
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
  container: { flex: 1 },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderBottomWidth: 1 },
  navTitle: { fontSize: 16, fontFamily: 'DMSans-SemiBold' },
  currencyPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.full, borderWidth: 1 },
  currencyPillText: { fontSize: 13, fontFamily: 'DMSans-SemiBold' },
  hero: { padding: SPACING.xl, alignItems: 'center' },
  heroEmoji: { fontSize: 52, marginBottom: 16 },
  heroTitle: { color: '#FFFFFF', fontSize: 22, fontFamily: 'Lora-SemiBold', textAlign: 'center', marginBottom: 12 },
  heroSub: { color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 22, textAlign: 'center', fontFamily: 'DMSans-Regular' },
  pad: { padding: SPACING.lg },
  modeCard: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1 },
  modeEmoji: { fontSize: 32 },
  modeTitle: { fontSize: 16, fontFamily: 'DMSans-SemiBold', marginBottom: 4 },
  modeSub: { fontSize: 13, fontFamily: 'DMSans-Regular' },
  whereCard: { borderRadius: RADIUS.md, padding: SPACING.lg, borderLeftWidth: 3 },
  whereTitle: { fontSize: 15, fontFamily: 'DMSans-SemiBold', marginBottom: 8 },
  whereText: { fontSize: 13, lineHeight: 20, fontFamily: 'DMSans-Regular' },
  label: { fontSize: 13, fontFamily: 'DMSans-Medium', marginBottom: 10, marginTop: 4 },
  sectionNote: { fontSize: 13, fontFamily: 'DMSans-Regular', marginBottom: SPACING.lg, lineHeight: 20 },
  amtGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: SPACING.lg },
  amtBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: RADIUS.md, borderWidth: 1 },
  amtText: { fontSize: 14, fontFamily: 'DMSans-Medium' },
  input: { borderWidth: 1.5, borderRadius: RADIUS.md, padding: 14, fontSize: 15, fontFamily: 'DMSans-Regular', marginBottom: SPACING.md },
  payBtn: { borderRadius: RADIUS.full, paddingVertical: 15, alignItems: 'center', marginTop: SPACING.sm },
  payBtnDis: { opacity: 0.4 },
  payBtnTxt: { color: '#FFFFFF', fontSize: 16, fontFamily: 'DMSans-SemiBold' },
  sponsorIntro: { fontSize: 13, lineHeight: 20, fontFamily: 'DMSans-Regular', marginBottom: SPACING.lg },
  tierCard: { borderRadius: RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1.5 },
  tierHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: SPACING.sm },
  tierEmoji: { fontSize: 28 },
  tierLabel: { fontSize: 16, fontFamily: 'DMSans-SemiBold' },
  tierAmt: { fontSize: 14, fontFamily: 'DMSans-Medium' },
  tierPerks: { fontSize: 13, fontFamily: 'DMSans-Regular', lineHeight: 18 },
  currencyRow: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1.5 },
  currencySymbol: { fontSize: 20, width: 36, textAlign: 'center' },
  currencyCode: { fontSize: 15, fontFamily: 'DMSans-SemiBold' },
  currencyLabel: { fontSize: 12, fontFamily: 'DMSans-Regular' },
});
