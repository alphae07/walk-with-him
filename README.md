# Walk With Him — React Native + Expo

> *See Him more clearly. Love Him more dearly. Follow Him more nearly. Day by day.*

A gamified daily companion app for building a real, personal relationship with God. Built with React Native + Expo.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [EAS CLI](https://docs.expo.dev/build/setup/) (for APK builds)

### Install & Run
```bash
cd WalkWithHim
npm install
npx expo start
```

Scan the QR code with [Expo Go](https://expo.dev/go) on your Android device.

---

## 📦 Build APK

### 1. Create an Expo account
```bash
npx eas login
```

### 2. Configure your project
```bash
npx eas build:configure
```

### 3. Build the APK (preview/internal)
```bash
npx eas build --platform android --profile preview
```
This outputs a downloadable `.apk` file you can install on any Android device.

### 4. Build Production AAB (for Play Store)
```bash
npx eas build --platform android --profile production
```

---

## 🔑 Configuration

### Paystack (Donations & Sponsorship)
In `src/screens/DonateScreen.tsx`, replace:
```ts
const PAYSTACK_PUBLIC_KEY = 'YOUR_PAYSTACK_PUBLIC_KEY';
```

### Notifications
Push notifications are configured in `src/services/notifications.ts`. All daily reminders and "God Is Calling" calls are scheduled using `expo-notifications`.

---

## 📁 Project Structure

```
WalkWithHim/
├── App.tsx                    # Root app with navigation
├── app.json                   # Expo configuration
├── eas.json                   # EAS build profiles
├── src/
│   ├── constants/
│   │   ├── theme.ts           # Colors, fonts, spacing
│   │   └── data.ts            # All static data (verses, books, games, sermons)
│   ├── utils/
│   │   ├── storage.ts         # AsyncStorage helpers + type definitions
│   │   └── xp.ts              # XP system, level calculations, milestones
│   ├── services/
│   │   └── notifications.ts   # Push notification scheduling
│   └── screens/
│       ├── OnboardingScreen.tsx
│       ├── HomeScreen.tsx          # Dashboard, verse of day, quick actions
│       ├── CallOverlayScreen.tsx   # "God Is Calling" incoming call UI
│       ├── JournalScreen.tsx       # Talk to God journaling
│       ├── GamesScreen.tsx         # All 6 mini-games
│       ├── GrowScreen.tsx          # Sermons, book of month, disciplines
│       ├── MoreScreen.tsx          # Navigation hub
│       ├── ProfileScreen.tsx       # XP, level map, stats
│       ├── SettingsScreen.tsx      # All user preferences
│       ├── SpiritualScreens.tsx    # Bible Log, God Sightings, Purpose
│       ├── DisciplinesAndPrayer.tsx # Fasting, Retreat, Silence, Prayer Builder
│       ├── SermonsScreen.tsx       # All sermons with filters
│       ├── BookOfMonthScreen.tsx   # Books 2024–2030 + summary submission
│       ├── AboutScreen.tsx         # App info
│       ├── DonateScreen.tsx        # Paystack donations + sponsorship tiers
│       └── CommunityScreens.tsx    # Suggestions, Testimony, Contact
```

---

## ✨ Features

### 📞 God Is Calling
- Random push notifications 1–5x daily within your set waking hours
- Full-screen incoming call UI with ripple animations
- 30-second countdown before auto-decline
- Answer → in-call screen with a prompt + response space
- All responses auto-saved to journal
- +15 XP for answering, -10 XP for declining
- **Works even when app is closed** via push notifications

### ⚡ XP & Level System
| Level | Name |
|-------|------|
| 1 | Seeker |
| 2 | Awakened |
| 3 | Walker |
| 4 | Disciple |
| 5 | Faithful One |
| 6 | Beloved |
| 7 | Covenant Keeper |
| 8 | Friend of God |
| 9 | Son of Fire |
| 10 | Man After His Heart |

### 🎮 6 Mini Games
- **Bible Quiz** — 10 randomised questions with explanations
- **Fill the Blank** — Complete verses from memory (letter-by-letter keyboard)
- **Word Scramble** — Rebuild verses word by word
- **Who Is God?** — Learn God's Hebrew names with flip cards
- **Prayer Builder** — ACTS prayer (Adoration, Confession, Thanksgiving, Supplication)
- **Fruit Check** — Weekly self-assessment of all 9 fruits of the Spirit

### 📚 Books of the Month (2024–2030)
84 curated Christian books — one per month for 7 years. Every book has a reflection prompt. Submit summaries for +30 XP.

### 🎤 Sermons
Curated sermons from:
- **Apostle Joshua Selman** (7 sermons)
- Pastor E.A. Adeboye
- Pastor Chris Oyakhilome
- Pastor David Ibiyeomie
- Sam Adeyemi
- Femi Lazarus
- Pastor Tobi Adegboyega
- Steven Furtick, Francis Chan, Touré Roberts

Filtered by category and preacher.

### 💪 Spiritual Disciplines
- **Fasting** — Start/end fasting log with timestamp (+25 XP)
- **Prayer Retreat** — 2+ hour solitary prayer (+35 XP)
- **Hour of Silence** — No noise, no phone, just God (+20 XP)

### 🧭 Purpose Journal
6 sections: Identity, How to Serve, Marriage & Relationships, Career & Business, Where to Settle, Holiness & Character. Each has a prayer prompt.

### 💝 Donations & Sponsorship (Paystack)
- One-time donations with preset and custom amounts
- 4 monthly sponsorship tiers: Seed, Branch, Tree, Kingdom Pillar
- All payments via Paystack (NGN)

### 📩 Community
- **Testimony** screen → emails to builder
- **Suggestions** screen → emails to builder
- **Contact** screen → email, WhatsApp, phone

---

## 📱 Notifications Architecture

All notifications are scheduled client-side using `expo-notifications`:
- God Is Calling: randomly distributed within user's waking hours
- Morning/Midday/Evening reminders: daily repeating
- Streak warning: 9:30 PM if user hasn't opened app

Notifications fire even when the app is closed/backgrounded on Android.

---

## 🗄 Data Storage

All data is stored locally using `@react-native-async-storage/async-storage`. No account, no server, no login required.

**Export/Import**: Users can export their full data as JSON and import it on any device (via the More screen).

---

## 📝 Contact

**Ayomide Emmanuel Alao**  
Email: ayomidealao017@gmail.com  
Phone/WhatsApp: +2349113216637

---

*Built with intention. Dedicated to anyone genuinely hungry for God.*

> "You will seek me and find me when you seek me with all your heart." — Jeremiah 29:13
