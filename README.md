# Walk With Him — React Native + Expo

> *See Him more clearly. Love Him more dearly. Follow Him more nearly. Day by day.*

A gamified daily companion app for building a real, personal relationship with God.

Built with ❤️ by **Alphae X**

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [EAS CLI](https://docs.expo.dev/build/setup/) (for APK builds)

### Install & Run
```bash
npm install
npx expo start
```

Scan the QR code with [Expo Go](https://expo.dev/go) on your Android device.

---

## 📦 Build APK

```bash
# Login to Expo
npx eas login

# Configure (first time only)
npx eas build:configure

# Build APK for testing
npx eas build --platform android --profile preview

# Build for Play Store
npx eas build --platform android --profile production
```

---

## 🔑 Configuration

### Paystack (Donations)
In `src/screens/DonateScreen.tsx`:
```ts
const PAYSTACK_PUBLIC_KEY = 'your_key_here';
```
Supports: USD, NGN, GBP, EUR, GHS, KES, ZAR

### Notifications
Configured in `src/services/notifications.ts`.

---

## 📁 Project Structure

```
WalkWithHim/
├── App.tsx                         # Root with navigation + theme + popups
├── app.json                        # Expo config (userInterfaceStyle: automatic)
├── src/
│   ├── components/                 # Reusable components
│   │   ├── NavBar.tsx
│   │   ├── XPBar.tsx
│   │   ├── StatCard.tsx
│   │   ├── VerseCard.tsx
│   │   ├── LevelBadge.tsx
│   │   ├── SectionCard.tsx
│   │   ├── EmptyState.tsx
│   │   └── GameComponents.tsx      # GameHeader, GameResult
│   ├── constants/
│   │   ├── theme.ts                # Light/dark theme + useThemeColors()
│   │   └── data.ts                 # All static data
│   ├── utils/
│   │   ├── storage.ts              # AsyncStorage helpers
│   │   ├── xp.ts                   # XP system
│   │   └── i18n.ts                 # 13-language translation system
│   ├── services/
│   │   └── notifications.ts        # Push notifications
│   └── screens/
│       ├── OnboardingScreen.tsx    # Country + Language + Name
│       ├── HomeScreen.tsx
│       ├── GamesScreen.tsx         # 6 fully fixed mini-games
│       ├── CommunityScreen.tsx     # FreeFire-style chat
│       ├── ProfileScreen.tsx       # Fixed crash + safe dates
│       ├── DonateScreen.tsx        # Multi-currency
│       ├── SettingsScreen.tsx      # Ringtone picker
│       ├── CallOverlayScreen.tsx   # God is Calling + audio
│       ├── WeeklyPopup.tsx         # Engagement popup system
│       └── ... (all other screens)
```

---

## ✨ What's Fixed & New

### Bug Fixes
- ✅ ProfileScreen crash (safe date parsing, null guards)
- ✅ All 6 games fully working (Quiz, Fill Blank, Scramble, Names, Prayer, Fruits)
- ✅ XP levels rebalanced (1,000 → 800,000 XP across 10 levels)
- ✅ Fonts loading correctly (via @expo-google-fonts)

### New Features
- 🎨 **System-responsive Light/Dark theme** (`useThemeColors()`)
- 🌍 **13 languages**: English, French, Spanish, Portuguese, Yoruba, Igbo, Hausa, Swahili, Arabic, Hindi, German, Korean, Mandarin
- 🌏 **Country selector** in onboarding (auto-sets currency + region)
- 💰 **Multi-currency donations**: USD, NGN, GBP, EUR, GHS, KES, ZAR
- 🔔 **Ringtone picker**: 5 built-in + upload from phone (MP3/AAC/WAV)
- 💬 **Community Chat**: Global, Region, Personal tabs — FreeFire style with AI responses
- 🤝 **Partners system**: Prayer, Discipline, Bible Study partners
- 👥 **Friend profiles**: Level cards, add/search friends
- 📅 **Weekly popups**: Donate, Testimony, Suggestions, Community, Share
- 🎤 **50 sermons** from 20+ global preachers (T.D. Jakes, Keller, Piper, Johnson, etc.)
- 🧩 **Reusable components**: NavBar, XPBar, StatCard, VerseCard, LevelBadge, etc.

### XP Levels
| Level | Name | XP Required |
|-------|------|-------------|
| 1 | Seeker | 0 |
| 2 | Awakened | 1,000 |
| 3 | Walker | 5,000 |
| 4 | Disciple | 15,000 |
| 5 | Faithful One | 35,000 |
| 6 | Beloved | 75,000 |
| 7 | Covenant Keeper | 150,000 |
| 8 | Friend of God | 280,000 |
| 9 | Son of Fire | 500,000 |
| 10 | Man After His Heart | 800,000 |

---

## 📩 Contact

**Alphae X**
Email: support@alphae-x.app

---

*Built with intention. Dedicated to anyone genuinely hungry for God.*

> "You will seek me and find me when you seek me with all your heart." — Jeremiah 29:13
