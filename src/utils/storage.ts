import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = '@wwh_';

export const Storage = {
  async get<T>(key: string, fallback?: T): Promise<T | undefined> {
    try {
      const val = await AsyncStorage.getItem(PREFIX + key);
      if (val === null) return fallback;
      return JSON.parse(val) as T;
    } catch { return fallback; }
  },
  async set(key: string, value: unknown): Promise<void> {
    try { await AsyncStorage.setItem(PREFIX + key, JSON.stringify(value)); }
    catch (e) { console.error('Storage.set error', e); }
  },
  async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(PREFIX + key);
  },
  async getAllKeys(): Promise<string[]> {
    const keys = await AsyncStorage.getAllKeys();
    return keys.filter(k => k.startsWith(PREFIX)).map(k => k.replace(PREFIX, ''));
  },
  async exportAll(): Promise<Record<string, unknown>> {
    const keys = await this.getAllKeys();
    const result: Record<string, unknown> = {};
    for (const key of keys) result[key] = await this.get(key);
    return result;
  },
  async importAll(data: Record<string, unknown>): Promise<void> {
    for (const [key, value] of Object.entries(data)) await this.set(key, value);
  },
};

export interface UserProfile {
  name: string;
  joinedAt: string;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  callsAnswered: number;
  callsDeclined: number;
  totalJournalEntries: number;
  totalGodSightings: number;
  totalChaptersRead: number;
  callsPerDay: number;
  callWindowStart: number;
  callWindowEnd: number;
  ringtone: string;
  customRingtoneUri?: string;
  morningReminder: boolean;
  morningHour: number;
  eveningReminder: boolean;
  eveningHour: number;
  middayReminder: boolean;
  penaltyWarnings: boolean;
  notificationsEnabled: boolean;
  googleDriveConnected: boolean;
  preferredCurrency: 'USD' | 'NGN' | 'GBP' | 'EUR' | 'GHS' | 'KES' | 'ZAR';
  communityId?: string;
  communityUsername?: string;
  communityRegion?: string;
  communityJoinedAt?: string;
}

export interface JournalEntry {
  id: string; date: string; content: string; prompt?: string; xpEarned: number;
}
export interface GodSighting {
  id: string; date: string; content: string; category?: string;
}
export interface BibleLog {
  id: string; date: string; book: string; chapter: number; observation: string;
}
export interface PurposeEntry {
  id: string; section: string; content: string; updatedAt: string;
}
export interface BookSummary {
  monthKey: string; summary: string; submittedAt: string; xpEarned: number;
}

export const PURPOSE_SECTIONS = [
  { key: 'identity', label: 'Who Am I?', icon: '🪞', prompt: 'Ask God: What gifts have you placed in me? What is my calling? Who did you create me to be?' },
  { key: 'service', label: 'How to Serve', icon: '🤝', prompt: 'Where is God asking you to serve? What specific open door is in front of you right now?' },
  { key: 'relationships', label: 'Marriage & Relationships', icon: '💑', prompt: 'What is God saying about the relationships in your life? Is there a person He has brought to your attention?' },
  { key: 'career', label: 'Career & Business', icon: '💼', prompt: 'What is God\'s vision for your work? Are you in the right place? What is He building through you?' },
  { key: 'location', label: 'Where to Settle', icon: '📍', prompt: 'Is God asking you to stay, go, or prepare? What does peace say about where you should be?' },
  { key: 'holiness', label: 'Holiness & Character', icon: '✨', prompt: 'What specific area of character is God working on in you right now? What sin needs to die?' },
];

export const defaultProfile: UserProfile = {
  name: 'Friend', joinedAt: new Date().toISOString(),
  xp: 0, level: 1, streak: 0, lastActiveDate: '',
  callsAnswered: 0, callsDeclined: 0,
  totalJournalEntries: 0, totalGodSightings: 0, totalChaptersRead: 0,
  callsPerDay: 3, callWindowStart: 7, callWindowEnd: 21,
  ringtone: 'heavenly', customRingtoneUri: undefined,
  morningReminder: true, morningHour: 7,
  eveningReminder: true, eveningHour: 20,
  middayReminder: true, penaltyWarnings: true,
  notificationsEnabled: true, googleDriveConnected: false,
  preferredCurrency: 'USD',
};
