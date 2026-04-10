import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView,
  FlatList, Modal, KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
  Dimensions, Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors, SPACING, RADIUS } from '../constants/theme';
import { Storage, UserProfile, defaultProfile } from '../utils/storage';
import { getLevelInfo } from '../utils/xp';

const { width, height } = Dimensions.get('window');
const API_BASE = 'https://api.anthropic.com/v1/messages';

// Community Regions
const REGIONS = [
  { id: 'global', label: '🌍 Global', desc: 'All believers worldwide' },
  { id: 'africa', label: '🌍 Africa', desc: 'African believers' },
  { id: 'north_america', label: '🌎 North America', desc: 'NA community' },
  { id: 'europe', label: '🌍 Europe', desc: 'European community' },
  { id: 'asia', label: '🌏 Asia', desc: 'Asian community' },
  { id: 'south_america', label: '🌎 South America', desc: 'SA community' },
  { id: 'oceania', label: '🌏 Oceania', desc: 'Pacific community' },
];

const PARTNER_TYPES = [
  { id: 'prayer', emoji: '🙏', label: 'Prayer Partner', desc: 'Pray together daily' },
  { id: 'discipline', emoji: '💪', label: 'Discipline Partner', desc: 'Accountability for fasting, silence' },
  { id: 'bible', emoji: '📖', label: 'Bible Study Buddy', desc: 'Read and discuss Scripture together' },
  { id: 'mentor', emoji: '🧭', label: 'Spiritual Mentor', desc: 'Guide or be guided in faith' },
];

// Simulated community messages (AI-powered via Claude)
const SEED_MESSAGES: Record<string, Array<{ id: string; username: string; level: number; text: string; time: string; region: string }>> = {
  global: [
    { id: '1', username: 'FaithWalker', level: 5, text: 'Just answered my 10th call this week 🙏 He had a word about trusting Him in the waiting.', time: '2m', region: 'Africa' },
    { id: '2', username: 'HolyFire_K', level: 7, text: 'Covenant Keeper checking in. 30-day streak today! Don\'t give up, saints.', time: '5m', region: 'North America' },
    { id: '3', username: 'SeekHimDaily', level: 3, text: 'Started my fasting journey today. Any tips for staying focused in prayer?', time: '8m', region: 'Europe' },
    { id: '4', username: 'GodsSon_T', level: 9, text: 'Son of Fire 🔥 — Isaiah 40:31 hit different today. Sharing for whoever needs it.', time: '12m', region: 'Africa' },
    { id: '5', username: 'Walker_J', level: 3, text: 'Looking for a prayer partner! DM me if you want to commit to praying together', time: '15m', region: 'Asia' },
    { id: '6', username: 'BelieveDeep', level: 6, text: 'Finished the Book of the Month last night. Paul\'s letter to the Philippians broke me in the best way.', time: '20m', region: 'South America' },
  ],
};

function generateMessageId() { return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`; }

function timeSince(isoStr: string) {
  const diff = Date.now() - new Date(isoStr).getTime();
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
  return `${Math.floor(diff / 86400000)}d`;
}

interface Message {
  id: string; username: string; level: number;
  text: string; time: string; region: string;
  isMine?: boolean; isAI?: boolean;
}

interface Friend {
  id: string; username: string; level: number;
  region: string; partnerType?: string; xp: number;
}

type Tab = 'global' | 'region' | 'personal' | 'partners' | 'friends';

export default function CommunityScreen() {
  const navigation = useNavigation<any>();
  const C = useThemeColors();
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [communityUser, setCommunityUser] = useState<{username: string; region: string} | null>(null);
  const [tab, setTab] = useState<Tab>('global');
  const [messages, setMessages] = useState<Message[]>(SEED_MESSAGES.global);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showProfile, setShowProfile] = useState<Friend | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [signupUsername, setSignupUsername] = useState('');
  const [signupRegion, setSignupRegion] = useState('africa');
  const [joiningUp, setJoiningUp] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const scrollRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    loadData();
  }, []);

  const loadData = async () => {
    const p = await Storage.get<UserProfile>('profile', defaultProfile);
    if (p) setProfile(p);
    const cu = p?.communityId ? { username: p.communityUsername!, region: p.communityRegion! } : null;
    setCommunityUser(cu);
    const savedFriends = await Storage.get<Friend[]>('community_friends', []);
    setFriends(savedFriends || []);
    const savedMessages = await Storage.get<Message[]>(`community_messages_${tab}`, null);
    if (savedMessages?.length) setMessages(savedMessages);
    else setMessages(SEED_MESSAGES.global || []);
  };

  useEffect(() => {
    if (communityUser) {
      loadMessages(tab);
    }
  }, [tab, communityUser]);

  const loadMessages = async (channel: Tab) => {
    const saved = await Storage.get<Message[]>(`community_messages_${channel}`, null);
    if (saved?.length) {
      setMessages(saved);
    } else if (channel === 'global') {
      setMessages(SEED_MESSAGES.global);
    } else if (channel === 'region') {
      const regionMsgs = SEED_MESSAGES.global.filter(m =>
        m.region.toLowerCase().replace(' ', '_') === communityUser?.region
      );
      setMessages(regionMsgs.length ? regionMsgs : SEED_MESSAGES.global.slice(0, 3));
    } else {
      setMessages([]);
    }
  };

  const joinCommunity = async () => {
    if (!signupUsername.trim() || signupUsername.length < 3) {
      Alert.alert('Invalid Username', 'Username must be at least 3 characters.'); return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(signupUsername)) {
      Alert.alert('Invalid Username', 'Only letters, numbers, and underscores allowed.'); return;
    }
    setJoiningUp(true);
    try {
      const communityId = `wwh_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const updated = {
        ...profile,
        communityId,
        communityUsername: signupUsername.trim(),
        communityRegion: signupRegion,
        communityJoinedAt: new Date().toISOString(),
      };
      await Storage.set('profile', updated);
      setProfile(updated);
      setCommunityUser({ username: signupUsername.trim(), region: signupRegion });

      // Welcome message
      const welcome: Message = {
        id: generateMessageId(),
        username: '🌟 Walk With Him',
        level: 10,
        text: `Welcome to the community, ${signupUsername}! 🙏 You've joined ${REGIONS.find(r => r.id === signupRegion)?.label ?? 'the global'} family. Introduce yourself!`,
        time: 'just now',
        region: 'System',
        isAI: true,
      };
      const newMsgs = [...(SEED_MESSAGES.global || []), welcome];
      setMessages(newMsgs);
      await Storage.set('community_messages_global', newMsgs);
      setShowSignup(false);
    } catch (e) {
      Alert.alert('Error', 'Could not create community account. Try again.');
    } finally {
      setJoiningUp(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !communityUser) return;
    setSending(true);

    const myMsg: Message = {
      id: generateMessageId(),
      username: communityUser.username,
      level: profile.level,
      text: input.trim(),
      time: 'just now',
      region: communityUser.region,
      isMine: true,
    };

    const newMsgs = [...messages, myMsg];
    setMessages(newMsgs);
    await Storage.set(`community_messages_${tab}`, newMsgs);
    const msgText = input.trim();
    setInput('');
    setTimeout(() => scrollRef.current?.scrollToEnd?.({ animated: true }), 100);

    // AI-powered response (simulated community member)
    if (Math.random() < 0.6) {
      setAiLoading(true);
      try {
        const res = await fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 120,
            system: `You are a member of a Christian community chat app. Someone just posted: "${msgText}". 
Reply as a fellow believer — warm, real, encouraging, Spirit-led. 1-2 sentences max. 
No theological lectures. Just genuine community response. Can include a Scripture reference occasionally. 
Use community chat language (natural, not formal). You are user "${['GraceSeeker', 'HolyFire_T', 'FaithWalker_P', 'Kingdom_M', 'BlessedOne'][Math.floor(Math.random() * 5)]}"`,
            messages: [{ role: 'user', content: 'Respond to this community message naturally as a fellow Christian.' }],
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const aiText = data.content?.[0]?.text?.trim();
          if (aiText) {
            const aiNames = ['GraceSeeker_K', 'HolyFire_T', 'FaithWalker_P', 'Kingdom_M', 'BlessedOne_J'];
            const aiLevels = [4, 7, 3, 6, 5];
            const idx = Math.floor(Math.random() * aiNames.length);
            const aiMsg: Message = {
              id: generateMessageId(),
              username: aiNames[idx],
              level: aiLevels[idx],
              text: aiText,
              time: 'just now',
              region: ['Africa', 'North America', 'Europe', 'Asia', 'South America'][idx],
              isAI: true,
            };
            const updatedMsgs = [...newMsgs, aiMsg];
            setMessages(updatedMsgs);
            await Storage.set(`community_messages_${tab}`, updatedMsgs);
            setTimeout(() => scrollRef.current?.scrollToEnd?.({ animated: true }), 100);
          }
        }
      } catch {} finally { setAiLoading(false); }
    }
    setSending(false);
  };

  const addFriend = async (user: Friend) => {
    if (friends.some(f => f.id === user.id)) {
      Alert.alert('Already Friends', `You and ${user.username} are already connected.`); return;
    }
    const updated = [...friends, user];
    setFriends(updated);
    await Storage.set('community_friends', updated);
    Alert.alert('Friend Added! 🙏', `${user.username} has been added to your community. You can now partner in prayer and disciplines.`);
    setShowProfile(null);
  };

  const removeFriend = async (userId: string) => {
    const updated = friends.filter(f => f.id !== userId);
    setFriends(updated);
    await Storage.set('community_friends', updated);
  };

  const levelInfo = getLevelInfo(profile.xp);
  const myRegion = REGIONS.find(r => r.id === communityUser?.region);

  // ── NOT SIGNED UP ─────────────────────────────────────
  if (!communityUser && !showSignup) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: C.bg }]} edges={['top']}>
        <View style={[styles.navBar, { borderBottomColor: C.border + '60' }]}>
          <Text style={[styles.navTitle, { color: C.text }]}>Community</Text>
        </View>
        <Animated.View style={[{ flex: 1, opacity: fadeAnim }]}>
          <LinearGradient colors={['#0A1628', '#1A2E4A']} style={styles.joinHero}>
            <Text style={styles.joinEmoji}>🌍</Text>
            <Text style={styles.joinTitle}>Join the Global Community</Text>
            <Text style={styles.joinSub}>Connect with believers worldwide. Find prayer partners, discipline partners, and friends walking the same path. Like-minded brothers and sisters across the globe.</Text>
          </LinearGradient>

          <View style={{ padding: SPACING.lg }}>
            {[
              { emoji: '💬', title: 'Global & Region Chat', desc: 'Live community chat, visible worldwide and by region' },
              { emoji: '🤝', title: 'Find Partners', desc: 'Prayer, discipline, and Bible study partners' },
              { emoji: '👥', title: 'Friends & Profiles', desc: 'View level cards, add friends, build your circle' },
              { emoji: '🔒', title: 'No Phone Number', desc: 'Username only. Your offline data stays private.' },
            ].map(f => (
              <View key={f.title} style={[styles.featureRow, { borderBottomColor: C.border + '40' }]}>
                <Text style={styles.featureEmoji}>{f.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.featureTitle, { color: C.text }]}>{f.title}</Text>
                  <Text style={[styles.featureDesc, { color: C.text3 }]}>{f.desc}</Text>
                </View>
              </View>
            ))}

            <TouchableOpacity style={[styles.joinBtn, { backgroundColor: C.gold }]} onPress={() => setShowSignup(true)}>
              <Text style={styles.joinBtnText}>Create Community Account →</Text>
            </TouchableOpacity>
            <Text style={[styles.joinDisclaimer, { color: C.text3 }]}>Your local journal, XP, and streak stay 100% offline. Community requires an internet connection.</Text>
          </View>
        </Animated.View>
      </SafeAreaView>
    );
  }

  // ── SIGNUP FLOW ────────────────────────────────────────
  if (showSignup) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: C.bg }]} edges={['top']}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={[styles.navBar, { borderBottomColor: C.border + '60' }]}>
            <TouchableOpacity onPress={() => setShowSignup(false)}>
              <Ionicons name="chevron-back" size={24} color={C.text} />
            </TouchableOpacity>
            <Text style={[styles.navTitle, { color: C.text }]}>Create Account</Text>
            <View style={{ width: 24 }} />
          </View>
          <ScrollView contentContainerStyle={{ padding: SPACING.lg }}>
            <Text style={[styles.signupLabel, { color: C.text }]}>Choose a Username</Text>
            <Text style={[styles.signupHint, { color: C.text3 }]}>This is how other believers will see you. Letters, numbers, underscores only.</Text>
            <TextInput
              style={[styles.signupInput, { backgroundColor: C.surface, borderColor: C.border, color: C.text }]}
              value={signupUsername} onChangeText={setSignupUsername}
              placeholder="e.g. FaithWalker_K" placeholderTextColor={C.text3}
              maxLength={20} autoCapitalize="none" autoCorrect={false} />

            <Text style={[styles.signupLabel, { color: C.text, marginTop: SPACING.lg }]}>Your Region</Text>
            <Text style={[styles.signupHint, { color: C.text3 }]}>You'll see regional chat from your area.</Text>
            {REGIONS.map(r => (
              <TouchableOpacity key={r.id}
                style={[styles.regionOption, { backgroundColor: C.surface, borderColor: signupRegion === r.id ? C.gold : C.border }]}
                onPress={() => setSignupRegion(r.id)}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.regionLabel, { color: C.text }]}>{r.label}</Text>
                  <Text style={[styles.regionDesc, { color: C.text3 }]}>{r.desc}</Text>
                </View>
                {signupRegion === r.id && <Ionicons name="checkmark-circle" size={20} color={C.gold} />}
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.joinBtn, { backgroundColor: C.gold, marginTop: SPACING.xl }, (joiningUp || !signupUsername.trim()) && { opacity: 0.4 }]}
              onPress={joinCommunity} disabled={joiningUp || !signupUsername.trim()}>
              {joiningUp ? <ActivityIndicator color="#fff" /> : <Text style={styles.joinBtnText}>Join the Community →</Text>}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ── MAIN COMMUNITY ─────────────────────────────────────
  const TABS: Array<{ id: Tab; emoji: string; label: string }> = [
    { id: 'global', emoji: '🌍', label: 'Global' },
    { id: 'region', emoji: '📍', label: myRegion?.label.split(' ')[1] ?? 'Region' },
    { id: 'personal', emoji: '💬', label: 'Personal' },
    { id: 'partners', emoji: '🤝', label: 'Partners' },
    { id: 'friends', emoji: '👥', label: 'Friends' },
  ];

  const renderMessage = ({ item }: { item: Message }) => {
    const lvlInfo = getLevelInfo(item.level * 200);
    return (
      <TouchableOpacity
        style={[styles.msgRow, item.isMine && styles.msgRowMine]}
        onLongPress={() => !item.isMine && setShowProfile({
          id: item.id, username: item.username, level: item.level,
          region: item.region, xp: item.level * 200,
        })}>
        {!item.isMine && (
          <View style={[styles.msgAvatar, { backgroundColor: item.isAI ? C.gold + '30' : C.surface, borderColor: item.isAI ? C.gold : C.border }]}>
            <Text style={styles.msgAvatarText}>{lvlInfo.emoji}</Text>
          </View>
        )}
        <View style={[styles.msgBubble,
          item.isMine ? { backgroundColor: C.gold, borderRadius: RADIUS.lg, borderBottomRightRadius: 4 }
            : { backgroundColor: item.isAI ? C.gold + '15' : C.surface, borderRadius: RADIUS.lg, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: item.isAI ? C.gold + '40' : C.border }
        ]}>
          {!item.isMine && (
            <View style={styles.msgMeta}>
              <Text style={[styles.msgUsername, { color: item.isAI ? C.gold : C.gold }]}>{item.username}</Text>
              <View style={[styles.msgLevelBadge, { backgroundColor: C.bg3 }]}>
                <Text style={[styles.msgLevelText, { color: C.text3 }]}>Lv.{item.level}</Text>
              </View>
              <Text style={[styles.msgRegion, { color: C.text3 }]}>{item.region}</Text>
            </View>
          )}
          <Text style={[styles.msgText, { color: item.isMine ? '#FFFFFF' : C.text }]}>{item.text}</Text>
          <Text style={[styles.msgTime, { color: item.isMine ? 'rgba(255,255,255,0.6)' : C.text3 }]}>{item.time}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.bg }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.chatHeader, { borderBottomColor: C.border + '60', backgroundColor: C.bg }]}>
        <View style={styles.chatHeaderLeft}>
          <View style={[styles.myAvatar, { backgroundColor: C.gold + '20', borderColor: C.gold }]}>
            <Text style={styles.myAvatarText}>{levelInfo.emoji}</Text>
          </View>
          <View>
            <Text style={[styles.myUsername, { color: C.text }]}>{communityUser?.username}</Text>
            <Text style={[styles.myRegionLabel, { color: C.text3 }]}>Lv.{profile.level} · {myRegion?.label}</Text>
          </View>
        </View>
        <View style={styles.chatHeaderRight}>
          <TouchableOpacity style={[styles.headerBtn, { backgroundColor: C.surface }]} onPress={() => setShowSearch(true)}>
            <Ionicons name="search" size={18} color={C.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={[styles.tabScroll, { borderBottomColor: C.border + '60' }]}
        contentContainerStyle={styles.tabScrollContent}>
        {TABS.map(t => (
          <TouchableOpacity key={t.id} style={[styles.tab, tab === t.id && { borderBottomColor: C.gold, borderBottomWidth: 2.5 }]}
            onPress={() => setTab(t.id)}>
            <Text style={[styles.tabLabel, { color: tab === t.id ? C.gold : C.text3 }]}>{t.emoji} {t.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Chat / Content */}
      {(tab === 'global' || tab === 'region' || tab === 'personal') ? (
        <>
          <FlatList
            ref={scrollRef} data={messages} renderItem={renderMessage}
            keyExtractor={item => item.id}
            contentContainerStyle={{ padding: SPACING.md, paddingBottom: 8 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyChat}>
                <Text style={styles.emptyChatEmoji}>🙏</Text>
                <Text style={[styles.emptyChatText, { color: C.text2 }]}>Be the first to share in this channel. What is God saying to you today?</Text>
              </View>
            }
            ListFooterComponent={aiLoading ? (
              <View style={styles.aiTyping}>
                <ActivityIndicator size="small" color={C.gold} />
                <Text style={[styles.aiTypingText, { color: C.text3 }]}>Someone is typing...</Text>
              </View>
            ) : null}
          />

          {/* Input */}
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={[styles.inputRow, { backgroundColor: C.bg, borderTopColor: C.border + '60' }]}>
              <TextInput
                style={[styles.chatInput, { backgroundColor: C.surface, borderColor: C.border, color: C.text }]}
                value={input} onChangeText={setInput}
                placeholder={tab === 'personal' ? 'Send a personal message...' : 'Share with the community...'}
                placeholderTextColor={C.text3} multiline maxLength={500}
              />
              <TouchableOpacity
                style={[styles.sendBtn, { backgroundColor: input.trim() ? C.gold : C.surface }]}
                onPress={sendMessage} disabled={!input.trim() || sending}>
                {sending ? <ActivityIndicator size="small" color="#fff" /> :
                  <Ionicons name="send" size={18} color={input.trim() ? '#fff' : C.text3} />}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </>
      ) : tab === 'partners' ? (
        <ScrollView contentContainerStyle={{ padding: SPACING.lg }}>
          <Text style={[styles.sectionHeader, { color: C.text }]}>Find a Partner</Text>
          <Text style={[styles.sectionSub, { color: C.text3 }]}>Post your need in Global or Region chat to find a partner, or browse below.</Text>
          {PARTNER_TYPES.map(pt => (
            <TouchableOpacity key={pt.id}
              style={[styles.partnerCard, { backgroundColor: C.surface, borderColor: C.border }]}
              onPress={() => {
                setInput(`Looking for a ${pt.label}! ${pt.desc}. Anyone interested? 🙏`);
                setTab('global');
              }}>
              <Text style={styles.partnerEmoji}>{pt.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.partnerTitle, { color: C.text }]}>{pt.label}</Text>
                <Text style={[styles.partnerDesc, { color: C.text3 }]}>{pt.desc}</Text>
              </View>
              <Text style={[styles.partnerCta, { color: C.gold }]}>Post →</Text>
            </TouchableOpacity>
          ))}
          <View style={[styles.partnerTip, { backgroundColor: C.bg2, borderLeftColor: C.gold }]}>
            <Text style={[styles.partnerTipText, { color: C.text2 }]}>💡 Tip: Post in Global chat what you're looking for. Add your level and region so the right person can find you.</Text>
          </View>
        </ScrollView>
      ) : (
        // FRIENDS TAB
        <ScrollView contentContainerStyle={{ padding: SPACING.lg }}>
          <Text style={[styles.sectionHeader, { color: C.text }]}>My Community ({friends.length})</Text>
          {friends.length === 0 ? (
            <View style={styles.emptyFriends}>
              <Text style={styles.emptyChatEmoji}>👥</Text>
              <Text style={[styles.emptyChatText, { color: C.text2 }]}>No connections yet. Long-press on any message in Global or Region chat to view a profile and add a friend.</Text>
            </View>
          ) : (
            friends.map(f => {
              const fLevel = getLevelInfo(f.xp);
              return (
                <TouchableOpacity key={f.id}
                  style={[styles.friendCard, { backgroundColor: C.surface, borderColor: C.border }]}
                  onPress={() => setShowProfile(f)}>
                  <View style={[styles.friendAvatar, { backgroundColor: C.gold + '20', borderColor: C.gold }]}>
                    <Text style={styles.friendAvatarText}>{fLevel.emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.friendName, { color: C.text }]}>{f.username}</Text>
                    <Text style={[styles.friendLevel, { color: C.gold }]}>{fLevel.name} · Level {f.level} · {f.region}</Text>
                    {f.partnerType && (
                      <Text style={[styles.friendPartner, { color: C.text3 }]}>
                        {PARTNER_TYPES.find(p => p.id === f.partnerType)?.emoji} {PARTNER_TYPES.find(p => p.id === f.partnerType)?.label}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity onPress={() => Alert.alert('Remove', `Remove ${f.username} from your community?`,
                    [{ text: 'Cancel', style: 'cancel' }, { text: 'Remove', style: 'destructive', onPress: () => removeFriend(f.id) }])}>
                    <Ionicons name="ellipsis-vertical" size={18} color={C.text3} />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      )}

      {/* Profile Card Modal */}
      <Modal visible={!!showProfile} transparent animationType="slide">
        <View style={styles.profileModalOverlay}>
          <TouchableOpacity style={styles.profileModalBackdrop} onPress={() => setShowProfile(null)} />
          {showProfile && (() => {
            const fLevel = getLevelInfo(showProfile.xp);
            return (
              <View style={[styles.profileCard, { backgroundColor: C.bg2, borderColor: C.border }]}>
                <LinearGradient colors={['#0A1628', '#1A2E4A']} style={styles.profileCardHeader}>
                  <View style={[styles.profileCardAvatar, { borderColor: C.gold }]}>
                    <Text style={styles.profileCardAvatarText}>{fLevel.emoji}</Text>
                  </View>
                  <Text style={styles.profileCardName}>{showProfile.username}</Text>
                  <Text style={styles.profileCardLevel}>{fLevel.name} · Level {showProfile.level}</Text>
                  <Text style={styles.profileCardRegion}>📍 {showProfile.region}</Text>
                </LinearGradient>
                <View style={{ padding: SPACING.lg }}>
                  <View style={styles.profileCardXpRow}>
                    <Text style={[styles.profileCardStat, { color: C.text3 }]}>XP</Text>
                    <Text style={[styles.profileCardStatVal, { color: C.text }]}>{showProfile.xp.toLocaleString()}</Text>
                  </View>
                  <View style={[styles.profileCardActions]}>
                    <TouchableOpacity style={[styles.profileActionBtn, { backgroundColor: C.gold }]} onPress={() => addFriend(showProfile)}>
                      <Ionicons name="person-add-outline" size={16} color="#fff" />
                      <Text style={styles.profileActionBtnText}>Add Friend</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.profileActionBtn, { backgroundColor: C.surface, borderWidth: 1, borderColor: C.border }]}
                      onPress={() => { setInput(`@${showProfile.username} `); setShowProfile(null); setTab('personal'); }}>
                      <Ionicons name="chatbubble-outline" size={16} color={C.text} />
                      <Text style={[styles.profileActionBtnText, { color: C.text }]}>Message</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity style={styles.profileCloseBtn} onPress={() => setShowProfile(null)}>
                    <Text style={[styles.profileCloseBtnText, { color: C.text3 }]}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })()}
        </View>
      </Modal>

      {/* Search Modal */}
      <Modal visible={showSearch} transparent animationType="slide">
        <SafeAreaView style={[styles.searchModal, { backgroundColor: C.bg }]}>
          <View style={[styles.searchHeader, { borderBottomColor: C.border }]}>
            <TextInput
              style={[styles.searchInput, { backgroundColor: C.surface, borderColor: C.border, color: C.text }]}
              value={searchQuery} onChangeText={setSearchQuery}
              placeholder="Search by username..." placeholderTextColor={C.text3}
              autoFocus />
            <TouchableOpacity onPress={() => { setShowSearch(false); setSearchQuery(''); }}>
              <Text style={[styles.searchCancel, { color: C.gold }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: SPACING.lg }}>
            {searchQuery.length < 2 ? (
              <Text style={[styles.emptyChatText, { color: C.text3, textAlign: 'center', marginTop: 40 }]}>Type at least 2 characters to search</Text>
            ) : (
              messages.filter(m => m.username.toLowerCase().includes(searchQuery.toLowerCase()) && !m.isMine)
                .filter((m, i, arr) => arr.findIndex(x => x.username === m.username) === i)
                .map(m => {
                  const fLevel = getLevelInfo(m.level * 200);
                  return (
                    <TouchableOpacity key={m.id}
                      style={[styles.friendCard, { backgroundColor: C.surface, borderColor: C.border }]}
                      onPress={() => { setShowProfile({ id: m.id, username: m.username, level: m.level, region: m.region, xp: m.level * 200 }); setShowSearch(false); }}>
                      <View style={[styles.friendAvatar, { backgroundColor: C.gold + '20', borderColor: C.gold }]}>
                        <Text style={styles.friendAvatarText}>{fLevel.emoji}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.friendName, { color: C.text }]}>{m.username}</Text>
                        <Text style={[styles.friendLevel, { color: C.gold }]}>{fLevel.name} · {m.region}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color={C.text3} />
                    </TouchableOpacity>
                  );
                })
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderBottomWidth: 1 },
  navTitle: { fontSize: 20, fontFamily: 'Lora-SemiBold' },
  joinHero: { padding: SPACING.xl, alignItems: 'center' },
  joinEmoji: { fontSize: 60, marginBottom: 16 },
  joinTitle: { color: '#FFFFFF', fontSize: 24, fontFamily: 'Lora-SemiBold', textAlign: 'center', marginBottom: 12 },
  joinSub: { color: 'rgba(255,255,255,0.65)', fontSize: 14, lineHeight: 22, textAlign: 'center', fontFamily: 'DMSans-Regular' },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, borderBottomWidth: 1 },
  featureEmoji: { fontSize: 24, width: 36, textAlign: 'center' },
  featureTitle: { fontSize: 14, fontFamily: 'DMSans-SemiBold', marginBottom: 2 },
  featureDesc: { fontSize: 12, fontFamily: 'DMSans-Regular' },
  joinBtn: { borderRadius: RADIUS.full, paddingVertical: 15, alignItems: 'center', marginTop: SPACING.lg },
  joinBtnText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'DMSans-SemiBold' },
  joinDisclaimer: { fontSize: 11, textAlign: 'center', marginTop: SPACING.md, lineHeight: 16, fontFamily: 'DMSans-Regular' },
  signupLabel: { fontSize: 16, fontFamily: 'DMSans-SemiBold', marginBottom: 6 },
  signupHint: { fontSize: 13, fontFamily: 'DMSans-Regular', marginBottom: 12, lineHeight: 18 },
  signupInput: { borderWidth: 1.5, borderRadius: RADIUS.md, padding: 14, fontSize: 16, fontFamily: 'DMSans-Regular', marginBottom: SPACING.sm },
  regionOption: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1.5 },
  regionLabel: { fontSize: 14, fontFamily: 'DMSans-SemiBold' },
  regionDesc: { fontSize: 12, fontFamily: 'DMSans-Regular' },
  chatHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderBottomWidth: 1 },
  chatHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  myAvatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  myAvatarText: { fontSize: 16 },
  myUsername: { fontSize: 14, fontFamily: 'DMSans-SemiBold' },
  myRegionLabel: { fontSize: 11, fontFamily: 'DMSans-Regular' },
  chatHeaderRight: { flexDirection: 'row', gap: 8 },
  headerBtn: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  tabScroll: { borderBottomWidth: 1, maxHeight: 44 },
  tabScrollContent: { paddingHorizontal: SPACING.sm },
  tab: { paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabLabel: { fontSize: 13, fontFamily: 'DMSans-SemiBold' },
  msgRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  msgRowMine: { flexDirection: 'row-reverse' },
  msgAvatar: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', borderWidth: 1, flexShrink: 0, marginTop: 4 },
  msgAvatarText: { fontSize: 14 },
  msgBubble: { maxWidth: width * 0.72, padding: 10 },
  msgMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  msgUsername: { fontSize: 12, fontFamily: 'DMSans-SemiBold' },
  msgLevelBadge: { paddingHorizontal: 5, paddingVertical: 1, borderRadius: 4 },
  msgLevelText: { fontSize: 10, fontFamily: 'DMSans-Medium' },
  msgRegion: { fontSize: 10, fontFamily: 'DMSans-Regular' },
  msgText: { fontSize: 14, fontFamily: 'DMSans-Regular', lineHeight: 20 },
  msgTime: { fontSize: 10, fontFamily: 'DMSans-Regular', marginTop: 3 },
  emptyChat: { alignItems: 'center', paddingTop: 60, paddingHorizontal: SPACING.xl },
  emptyChatEmoji: { fontSize: 48, marginBottom: 16 },
  emptyChatText: { fontSize: 14, fontFamily: 'DMSans-Regular', textAlign: 'center', lineHeight: 22 },
  aiTyping: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, paddingHorizontal: SPACING.md },
  aiTypingText: { fontSize: 12, fontFamily: 'DMSans-Regular' },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, padding: SPACING.sm, borderTopWidth: 1 },
  chatInput: { flex: 1, borderWidth: 1.5, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, fontSize: 14, fontFamily: 'DMSans-Regular', maxHeight: 100 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  sectionHeader: { fontSize: 18, fontFamily: 'Lora-SemiBold', marginBottom: 6 },
  sectionSub: { fontSize: 13, fontFamily: 'DMSans-Regular', marginBottom: SPACING.lg, lineHeight: 18 },
  partnerCard: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.sm, borderWidth: 1 },
  partnerEmoji: { fontSize: 28 },
  partnerTitle: { fontSize: 15, fontFamily: 'DMSans-SemiBold', marginBottom: 2 },
  partnerDesc: { fontSize: 12, fontFamily: 'DMSans-Regular' },
  partnerCta: { fontSize: 13, fontFamily: 'DMSans-SemiBold' },
  partnerTip: { borderRadius: RADIUS.md, padding: SPACING.md, borderLeftWidth: 3, marginTop: SPACING.md },
  partnerTipText: { fontSize: 13, fontFamily: 'DMSans-Regular', lineHeight: 20 },
  friendCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1 },
  friendAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  friendAvatarText: { fontSize: 20 },
  friendName: { fontSize: 15, fontFamily: 'DMSans-SemiBold', marginBottom: 2 },
  friendLevel: { fontSize: 12, fontFamily: 'DMSans-Medium', marginBottom: 2 },
  friendPartner: { fontSize: 11, fontFamily: 'DMSans-Regular' },
  emptyFriends: { alignItems: 'center', paddingTop: 40, paddingHorizontal: SPACING.xl },
  profileModalOverlay: { flex: 1, justifyContent: 'flex-end' },
  profileModalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
  profileCard: { borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden', borderWidth: 1 },
  profileCardHeader: { padding: SPACING.xl, alignItems: 'center' },
  profileCardAvatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 3, marginBottom: 12 },
  profileCardAvatarText: { fontSize: 38 },
  profileCardName: { color: '#FFFFFF', fontSize: 22, fontFamily: 'Lora-SemiBold', marginBottom: 4 },
  profileCardLevel: { color: '#C8922A', fontSize: 14, fontFamily: 'DMSans-Medium', marginBottom: 4 },
  profileCardRegion: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: 'DMSans-Regular' },
  profileCardXpRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.lg },
  profileCardStat: { fontSize: 14, fontFamily: 'DMSans-Regular' },
  profileCardStatVal: { fontSize: 14, fontFamily: 'DMSans-SemiBold' },
  profileCardActions: { flexDirection: 'row', gap: 12, marginBottom: SPACING.md },
  profileActionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: RADIUS.full, paddingVertical: 12 },
  profileActionBtnText: { fontSize: 14, fontFamily: 'DMSans-SemiBold', color: '#FFFFFF' },
  profileCloseBtn: { alignItems: 'center', paddingVertical: 8 },
  profileCloseBtnText: { fontSize: 14, fontFamily: 'DMSans-Regular' },
  searchModal: { flex: 1 },
  searchHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: SPACING.md, borderBottomWidth: 1 },
  searchInput: { flex: 1, borderWidth: 1.5, borderRadius: RADIUS.full, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, fontFamily: 'DMSans-Regular' },
  searchCancel: { fontSize: 14, fontFamily: 'DMSans-SemiBold' },
});
