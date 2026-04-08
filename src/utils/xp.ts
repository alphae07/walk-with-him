import { LEVELS, XP_REWARDS } from '../constants/data';
import { Storage, UserProfile } from './storage';

export function getLevelInfo(xp: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) return LEVELS[i];
  }
  return LEVELS[0];
}

export function getNextLevel(currentLevel: number) {
  return LEVELS.find(l => l.level === currentLevel + 1) || null;
}

export function getXPProgress(xp: number) {
  const current = getLevelInfo(xp);
  const next = getNextLevel(current.level);
  if (!next) return { current, next: null, progress: 1, remaining: 0 };
  const range = next.minXP - current.minXP;
  const earned = xp - current.minXP;
  return {
    current,
    next,
    progress: Math.min(earned / range, 1),
    remaining: next.minXP - xp,
  };
}

export async function awardXP(
  action: keyof typeof XP_REWARDS,
  profile: UserProfile
): Promise<{ profile: UserProfile; leveledUp: boolean; leveledDown: boolean; newLevel?: typeof LEVELS[0] }> {
  const amount = XP_REWARDS[action];
  const oldLevel = getLevelInfo(profile.xp).level;
  const newXP = Math.max(0, profile.xp + amount);
  const newLevelInfo = getLevelInfo(newXP);
  const newLevel = newLevelInfo.level;

  const updatedProfile: UserProfile = {
    ...profile,
    xp: newXP,
    level: newLevel,
  };

  await Storage.set('profile', updatedProfile);

  return {
    profile: updatedProfile,
    leveledUp: newLevel > oldLevel,
    leveledDown: newLevel < oldLevel,
    newLevel: newLevelInfo,
  };
}

export function checkAndUpdateStreak(profile: UserProfile): UserProfile {
  const today = new Date().toISOString().split('T')[0];
  const lastActive = profile.lastActiveDate;

  if (!lastActive) {
    return { ...profile, streak: 1, lastActiveDate: today };
  }

  if (lastActive === today) return profile;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (lastActive === yesterdayStr) {
    return { ...profile, streak: profile.streak + 1, lastActiveDate: today };
  }

  // Streak broken
  return { ...profile, streak: 1, lastActiveDate: today };
}

export const MILESTONE_REWARDS: Array<{
  id: string;
  condition: (p: UserProfile) => boolean;
  title: string;
  subtitle: string;
  emoji: string;
  verses: Array<{ text: string; ref: string }>;
}> = [
  {
    id: 'streak_3',
    condition: p => p.streak === 3,
    title: '3-Day Streak!',
    subtitle: 'Three days of walking with Him. He notices. He\'s proud of you.',
    emoji: '🌱',
    verses: [
      { text: 'Blessed is the one who does not walk in step with the wicked...', ref: 'Psalm 1:1' },
      { text: 'Let us not become weary in doing good, for at the proper time we will reap a harvest.', ref: 'Galatians 6:9' },
      { text: 'You will seek me and find me when you seek me with all your heart.', ref: 'Jeremiah 29:13' },
    ],
  },
  {
    id: 'streak_7',
    condition: p => p.streak === 7,
    title: 'A Full Week!',
    subtitle: 'Seven days. One whole week of showing up. This is what faithfulness looks like.',
    emoji: '🔥',
    verses: [
      { text: 'His mercies are new every morning; great is your faithfulness.', ref: 'Lamentations 3:23' },
      { text: 'A man\'s heart plans his way, but the Lord directs his steps.', ref: 'Proverbs 16:9' },
      { text: 'I am the vine; you are the branches. Remain in me and you will bear much fruit.', ref: 'John 15:5' },
    ],
  },
  {
    id: 'streak_30',
    condition: p => p.streak === 30,
    title: '30-Day Legend',
    subtitle: 'A whole month of walking with God. You are no longer trying — you are becoming.',
    emoji: '👑',
    verses: [
      { text: 'He who began a good work in you will carry it on to completion.', ref: 'Philippians 1:6' },
      { text: 'But those who hope in the Lord will renew their strength.', ref: 'Isaiah 40:31' },
      { text: 'One thing I ask from the Lord, this only do I seek: to gaze on the beauty of the Lord.', ref: 'Psalm 27:4' },
    ],
  },
  {
    id: 'calls_10',
    condition: p => p.callsAnswered === 10,
    title: '10 Calls Answered',
    subtitle: 'You keep picking up. That\'s not habit — that\'s love.',
    emoji: '📞',
    verses: [
      { text: 'My sheep listen to my voice; I know them, and they follow me.', ref: 'John 10:27' },
      { text: 'Speak, Lord, for your servant is listening.', ref: '1 Samuel 3:9' },
      { text: 'Call to me and I will answer you and tell you great and unsearchable things.', ref: 'Jeremiah 33:3' },
    ],
  },
  {
    id: 'level_5',
    condition: p => p.level === 5,
    title: 'Faithful One',
    subtitle: 'Level 5. You\'re past the beginning. This is where real formation happens.',
    emoji: '🛡️',
    verses: [
      { text: 'Well done, good and faithful servant!', ref: 'Matthew 25:23' },
      { text: 'For the eyes of the Lord range throughout the earth to strengthen those whose hearts are fully committed to him.', ref: '2 Chronicles 16:9' },
      { text: 'I have fought the good fight, I have finished the race, I have kept the faith.', ref: '2 Timothy 4:7' },
    ],
  },
];
