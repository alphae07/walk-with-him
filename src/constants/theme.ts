import { useColorScheme } from 'react-native';

export const DARK_COLORS = {
  bg: '#0A1628', bg2: '#0F1E38', bg3: '#152545',
  surface: '#1A2E4A', surfaceLight: '#1F3558',
  border: '#2A3F60',
  text: '#F0EDE6', text2: '#B8B0A0', text3: '#6E6A60',
  gold: '#C8922A', goldLight: '#F5E6C8', goldDark: '#A47520',
  goldGlow: 'rgba(200,146,42,0.3)',
  green: '#2E8B5A', greenLight: '#D4EDDF', greenDark: '#1D6B42',
  red: '#C0392B', redLight: '#FDECEA',
  blue: '#4A90D9', blueLight: '#E8F0FA',
  purple: '#7C3AED', purpleLight: '#EDE9FE',
  overlay: 'rgba(10,22,40,0.92)', overlayLight: 'rgba(10,22,40,0.6)',
  white: '#FFFFFF', black: '#000000',
  tabBar: '#0F1E38', tabBorder: '#2A3F60',
  statusBar: 'light-content' as const,
  gradientHero: ['#0A1628', '#1A2E4A'] as readonly [string, string],
  isDark: true,
};

export const LIGHT_COLORS = {
  bg: '#F4F1EC', bg2: '#ECEAE3', bg3: '#E0DDD5',
  surface: '#FFFFFF', surfaceLight: '#F9F7F3',
  border: '#D6D1C8',
  text: '#1A1208', text2: '#5A5040', text3: '#9A9080',
  gold: '#9A6310', goldLight: '#5A3A00', goldDark: '#7A4C08',
  goldGlow: 'rgba(154,99,16,0.15)',
  green: '#1E6B3A', greenLight: '#C4DDD0', greenDark: '#145228',
  red: '#B82E20', redLight: '#FDECEA',
  blue: '#2A70C9', blueLight: '#D8E8F8',
  purple: '#5C1ACD', purpleLight: '#DDD9FE',
  overlay: 'rgba(244,241,236,0.95)', overlayLight: 'rgba(244,241,236,0.7)',
  white: '#FFFFFF', black: '#000000',
  tabBar: '#FFFFFF', tabBorder: '#D6D1C8',
  statusBar: 'dark-content' as const,
  gradientHero: ['#1A2E4A', '#0F1E38'] as readonly [string, string],
  isDark: false,
};

export type ThemeColors = typeof DARK_COLORS;

// Default (kept for legacy direct imports – dark mode)
export const COLORS = DARK_COLORS;

export function useThemeColors(): ThemeColors {
  const scheme = useColorScheme();
  return scheme === 'light' ? LIGHT_COLORS : DARK_COLORS;
}

export const FONTS = {
  display: 'Lora-SemiBold', displayItalic: 'Lora-Italic', displayRegular: 'Lora-Regular',
  body: 'DMSans-Regular', bodyMedium: 'DMSans-Medium', bodySemiBold: 'DMSans-SemiBold',
};

export const SPACING = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };
export const RADIUS = { sm: 8, md: 14, lg: 20, xl: 28, full: 999 };
export const SHADOW = {
  sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 6, elevation: 3 },
  md: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.18, shadowRadius: 12, elevation: 6 },
  gold: { shadowColor: '#C8922A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 8 },
};
