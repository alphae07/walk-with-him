import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const CALL_NOTIFICATION_CHANNEL = 'god-is-calling';
export const REMINDER_CHANNEL = 'daily-reminder';

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const isCall = notification.request.content.data?.type === 'GOD_CALLING';
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      priority: isCall
        ? Notifications.AndroidNotificationPriority.MAX
        : Notifications.AndroidNotificationPriority.DEFAULT,
    };
  },
});

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync({
      ios: { allowAlert: true, allowBadge: true, allowSound: true, allowCriticalAlerts: true },
    });
    finalStatus = status;
  }
  if (Platform.OS === 'android') {
    // High-priority channel for God-is-Calling — shows as heads-up / full-screen intent
    await Notifications.setNotificationChannelAsync(CALL_NOTIFICATION_CHANNEL, {
      name: '📞 God is Calling',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 500, 300, 500, 300, 500, 300, 500],
      lightColor: '#C8922A',
      sound: 'default',
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true,
      enableLights: true,
      enableVibrate: true,
      showBadge: true,
    });
    await Notifications.setNotificationChannelAsync(REMINDER_CHANNEL, {
      name: '🙏 Daily Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 100, 250],
      lightColor: '#C8922A',
      sound: 'default',
    });
  }
  return finalStatus === 'granted';
}

export async function scheduleGodIsCallingNotification(
  windowStart: number, windowEnd: number, callsPerDay: number
): Promise<void> {
  // Cancel existing call notifications
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const n of scheduled) {
    if (n.content.data?.type === 'GOD_CALLING') {
      await Notifications.cancelScheduledNotificationAsync(n.identifier);
    }
  }

  const now = new Date();
  const windowDuration = (windowEnd - windowStart) * 60;
  const usedMinutes: number[] = [];

  const prompts = [
    "📞 God is calling — will you answer?",
    "He wants to speak with you right now.",
    "There's something He's been waiting to tell you.",
    "You have an incoming call. It's important.",
    "He has a word for you. Will you receive it?",
  ];

  for (let i = 0; i < callsPerDay; i++) {
    let randomMinute: number;
    let attempts = 0;
    do {
      randomMinute = Math.floor(Math.random() * windowDuration);
      attempts++;
    } while (usedMinutes.some(m => Math.abs(m - randomMinute) < 45) && attempts < 50);
    usedMinutes.push(randomMinute);

    const callTime = new Date(now);
    callTime.setHours(windowStart, 0, 0, 0);
    callTime.setMinutes(callTime.getMinutes() + randomMinute);

    if (callTime > now) {
      const body = prompts[Math.floor(Math.random() * prompts.length)];
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '📞 God is Calling...',
          body,
          sound: 'default',
          data: { type: 'GOD_CALLING', callId: `call_${Date.now()}_${i}` },
          categoryIdentifier: CALL_NOTIFICATION_CHANNEL,
          // Android-specific full-screen intent
          ...(Platform.OS === 'android' ? {
            priority: 'max',
            sticky: false,
            vibrate: [0, 500, 300, 500, 300, 500],
          } : {}),
        } as any,
        trigger: {
          date: callTime,
          channelId: CALL_NOTIFICATION_CHANNEL,
        } as any,
      });
    }
  }
}

export async function scheduleDailyReminder(
  type: 'morning' | 'midday' | 'evening', hour: number, enabled: boolean
): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const n of scheduled) {
    if (n.content.data?.reminderType === type) {
      await Notifications.cancelScheduledNotificationAsync(n.identifier);
    }
  }
  if (!enabled) return;
  const messages = {
    morning: { title: '🌅 Good morning, beloved.', body: 'Start your day with Him. Open the app for your morning moment.' },
    midday: { title: '☀️ Midday check-in.', body: 'Pause. How\'s your soul doing? He\'s right here.' },
    evening: { title: '🌙 Evening reflection.', body: 'The day isn\'t over until you\'ve talked with God about it.' },
  };
  await Notifications.scheduleNotificationAsync({
    content: {
      title: messages[type].title,
      body: messages[type].body,
      sound: 'default',
      data: { type: 'REMINDER', reminderType: type },
    },
    trigger: { hour, minute: 0, repeats: true, channelId: REMINDER_CHANNEL } as any,
  });
}

export async function scheduleStreakWarning(): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '⚠️ Your streak is at risk',
      body: 'You haven\'t opened Walk With Him today. Don\'t let your streak break.',
      sound: 'default',
      data: { type: 'STREAK_WARNING' },
    },
    trigger: { hour: 21, minute: 30, repeats: true, channelId: REMINDER_CHANNEL } as any,
  });
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function setupAllNotifications(profile: {
  notificationsEnabled: boolean; callsPerDay: number;
  callWindowStart: number; callWindowEnd: number;
  morningReminder: boolean; morningHour: number;
  middayReminder: boolean; eveningReminder: boolean;
  eveningHour: number; penaltyWarnings: boolean;
}): Promise<void> {
  if (!profile.notificationsEnabled) { await cancelAllNotifications(); return; }
  await scheduleGodIsCallingNotification(profile.callWindowStart, profile.callWindowEnd, profile.callsPerDay);
  await scheduleDailyReminder('morning', profile.morningHour, profile.morningReminder);
  await scheduleDailyReminder('midday', 12, profile.middayReminder);
  await scheduleDailyReminder('evening', profile.eveningHour, profile.eveningReminder);
  if (profile.penaltyWarnings) await scheduleStreakWarning();
}
