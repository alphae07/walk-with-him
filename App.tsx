import 'react-native-gesture-handler';
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ActivityIndicator, StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Lora_400Regular, Lora_400Regular_Italic, Lora_600SemiBold } from '@expo-google-fonts/lora';
import { DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold } from '@expo-google-fonts/dm-sans';
import { Ionicons } from '@expo/vector-icons';

import { DARK_COLORS, LIGHT_COLORS } from './src/constants/theme';
import { Storage, UserProfile, defaultProfile } from './src/utils/storage';
import { requestNotificationPermissions, setupAllNotifications } from './src/services/notifications';
import { checkAndUpdateStreak } from './src/utils/xp';
import { setLanguage, LangCode } from './src/utils/i18n';
import { shouldShowPopup, WeeklyPopupModal } from './src/screens/WeeklyPopup';

import HomeScreen from './src/screens/HomeScreen';
import GrowScreen from './src/screens/GrowScreen';
import GamesScreen from './src/screens/GamesScreen';
import JournalScreen from './src/screens/JournalScreen';
import MoreScreen from './src/screens/MoreScreen';
import CommunityScreen from './src/screens/CommunityScreen';
import CallOverlayScreen from './src/screens/CallOverlayScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AboutScreen from './src/screens/AboutScreen';
import DonateScreen from './src/screens/DonateScreen';
import SuggestionsScreen from './src/screens/SuggestionsScreen';
import TestimonyScreen from './src/screens/TestimonyScreen';
import ContactScreen from './src/screens/ContactScreen';
import BibleLogScreen from './src/screens/BibleLogScreen';
import GodSightingsScreen from './src/screens/GodSightingsScreen';
import PurposeScreen from './src/screens/PurposeScreen';
import SermonsScreen from './src/screens/SermonsScreen';
import BookOfMonthScreen from './src/screens/BookOfMonthScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import DisciplinesScreen from './src/screens/DisciplinesScreen';
import PrayerBuilderScreen from './src/screens/PrayerBuilderScreen';
import WorshipScreen from './src/screens/WorshipScreen';
import DevotionalScreen from './src/screens/DevotionalScreen';
import ReflectionScreen from './src/screens/ReflectionScreen';
import GratitudeScreen from './src/screens/GratitudeScreen';
import PrayerWallScreen from './src/screens/PrayerWallScreen';

SplashScreen.preventAutoHideAsync().catch(() => {});

Notifications.setNotificationHandler({
  handleNotification: async (n) => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    priority: n.request.content.data?.type === 'GOD_CALLING'
      ? Notifications.AndroidNotificationPriority.MAX
      : Notifications.AndroidNotificationPriority.DEFAULT,
  }),
});

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs({ C }: { C: typeof DARK_COLORS }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: C.tabBar,
          borderTopColor: C.tabBorder,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 6,
          height: 64,
        },
        tabBarActiveTintColor: C.gold,
        tabBarInactiveTintColor: C.text3,
        tabBarLabelStyle: { fontSize: 10, marginTop: 2 },
        tabBarIcon: ({ color, size, focused }) => {
          const map: Record<string, [string, string]> = {
            Home: ['home', 'home-outline'],
            Grow: ['leaf', 'leaf-outline'],
            Games: ['game-controller', 'game-controller-outline'],
            Journal: ['book', 'book-outline'],
            Community: ['people', 'people-outline'],
            More: ['menu', 'menu-outline'],
          };
          const [a, b] = map[route.name] ?? ['ellipse', 'ellipse-outline'];
          return <Ionicons name={(focused ? a : b) as any} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Grow" component={GrowScreen} />
      <Tab.Screen name="Games" component={GamesScreen} />
      <Tab.Screen name="Journal" component={JournalScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen name="More" component={MoreScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const colorScheme = useColorScheme();
  const C = colorScheme === 'light' ? LIGHT_COLORS : DARK_COLORS;
  const [appReady, setAppReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showCall, setShowCall] = useState(false);
  const [callData, setCallData] = useState<any>(null);
  const [activePopup, setActivePopup] = useState<any>(null);
  const navRef = useRef<NavigationContainerRef<any>>(null);
  const notifRef = useRef<Notifications.Subscription | null>(null);
  const respRef = useRef<Notifications.Subscription | null>(null);

  const [fontsLoaded, fontError] = useFonts({
    'Lora-Regular': Lora_400Regular,
    'Lora-Italic': Lora_400Regular_Italic,
    'Lora-SemiBold': Lora_600SemiBold,
    'DMSans-Regular': DMSans_400Regular,
    'DMSans-Medium': DMSans_500Medium,
    'DMSans-SemiBold': DMSans_600SemiBold,
  });

  useEffect(() => {
    if (!fontsLoaded && !fontError) return;
    (async () => {
      try {
        const savedLang = await Storage.get<LangCode>('app_language', 'en');
        if (savedLang) setLanguage(savedLang);

        const profile = await Storage.get<UserProfile>('profile', null);
        if (!profile) {
          setShowOnboarding(true);
        } else {
          const updated = checkAndUpdateStreak(profile as UserProfile);
          await Storage.set('profile', updated);
          const granted = await requestNotificationPermissions();
          if (granted) await setupAllNotifications(updated);

          // Check for weekly popups after 3s delay
          setTimeout(async () => {
            const popup = await shouldShowPopup();
            if (popup) setActivePopup(popup);
          }, 3000);
        }
      } catch (e) {
        console.warn('Init error', e);
      } finally {
        setAppReady(true);
        SplashScreen.hideAsync().catch(() => {});
      }
    })();
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    notifRef.current = Notifications.addNotificationReceivedListener((n) => {
      if (n.request.content.data?.type === 'GOD_CALLING') {
        setCallData(n.request.content.data);
        setShowCall(true);
      }
    });
    respRef.current = Notifications.addNotificationResponseReceivedListener((r) => {
      if (r.notification.request.content.data?.type === 'GOD_CALLING') {
        setCallData(r.notification.request.content.data);
        setShowCall(true);
      }
    });
    return () => {
      if (notifRef.current) Notifications.removeNotificationSubscription(notifRef.current);
      if (respRef.current) Notifications.removeNotificationSubscription(respRef.current);
    };
  }, []);

  if (!appReady) {
    return (
      <View style={[styles.splash, { backgroundColor: C.bg }]}>
        <Text style={styles.splashCross}>✝</Text>
        <ActivityIndicator color={C.gold} size="large" style={{ marginTop: 24 }} />
        <Text style={[styles.splashTitle, { color: C.text }]}>Walk With Him</Text>
        <Text style={[styles.splashSub, { color: C.text3 }]}>Preparing your walk...</Text>
      </View>
    );
  }

  if (showOnboarding) {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle={C.statusBar} backgroundColor={C.bg} />
        <GestureHandlerRootView style={{ flex: 1 }}>
          <OnboardingScreen onComplete={() => setShowOnboarding(false)} />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar barStyle={C.statusBar} backgroundColor={C.bg} translucent={false} />
        <NavigationContainer ref={navRef}>
          <Stack.Navigator
            screenOptions={{ headerShown: false, cardStyle: { backgroundColor: C.bg } }}>
            <Stack.Screen name="MainTabs">{() => <MainTabs C={C} />}</Stack.Screen>
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Devotional" component={DevotionalScreen} />
            <Stack.Screen name="Reflection" component={ReflectionScreen} />
            <Stack.Screen name="Gratitude" component={GratitudeScreen} />
            <Stack.Screen name="PrayerWall" component={PrayerWallScreen} />
            <Stack.Screen name="PrayerBuilder" component={PrayerBuilderScreen} />
            <Stack.Screen name="BibleLog" component={BibleLogScreen} />
            <Stack.Screen name="GodSightings" component={GodSightingsScreen} />
            <Stack.Screen name="Purpose" component={PurposeScreen} />
            <Stack.Screen name="Disciplines" component={DisciplinesScreen} />
            <Stack.Screen name="Worship" component={WorshipScreen} />
            <Stack.Screen name="Sermons" component={SermonsScreen} />
            <Stack.Screen name="BookOfMonth" component={BookOfMonthScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
            <Stack.Screen name="Donate" component={DonateScreen} />
            <Stack.Screen name="Suggestions" component={SuggestionsScreen} />
            <Stack.Screen name="Testimony" component={TestimonyScreen} />
            <Stack.Screen name="Contact" component={ContactScreen} />
            <Stack.Screen name="Community" component={CommunityScreen} />
          </Stack.Navigator>

          {showCall && (
            <CallOverlayScreen
              callData={callData}
              onDismiss={() => { setShowCall(false); setCallData(null); }}
            />
          )}

          {activePopup && !showCall && (
            <WeeklyPopupModal
              popup={activePopup}
              onNavigate={(route) => {
                setActivePopup(null);
                setTimeout(() => navRef.current?.navigate(route), 350);
              }}
              onDismiss={() => setActivePopup(null)}
            />
          )}
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  splash: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  splashCross: { fontSize: 64, color: '#C8922A' },
  splashTitle: { fontSize: 22, marginTop: 16, fontFamily: 'Lora-SemiBold' },
  splashSub: { fontSize: 13, marginTop: 8, fontFamily: 'DMSans-Regular' },
});
