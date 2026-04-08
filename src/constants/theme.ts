export const COLORS = {
  bg: '#0A1628',
  bg2: '#0F1E38',
  bg3: '#152545',
  surface: '#1A2E4A',
  surfaceLight: '#1F3558',
  border: '#2A3F60',
  text: '#F0EDE6',
  text2: '#B8B0A0',
  text3: '#6E6A60',
  gold: '#C8922A',
  goldLight: '#F5E6C8',
  goldDark: '#A47520',
  goldGlow: 'rgba(200,146,42,0.3)',
  green: '#2E8B5A',
  greenLight: '#D4EDDF',
  greenDark: '#1D6B42',
  red: '#C0392B',
  redLight: '#FDECEA',
  blue: '#4A90D9',
  blueLight: '#E8F0FA',
  purple: '#7C3AED',
  purpleLight: '#EDE9FE',
  overlay: 'rgba(10,22,40,0.92)',
  overlayLight: 'rgba(10,22,40,0.6)',
  white: '#FFFFFF',
  black: '#000000',
};

// Font families — loaded via expo-font from local assets
// Fallback to system serif/sans if fonts fail to load
export const FONTS = {
  display: 'Lora-SemiBold',
  displayItalic: 'Lora-Italic',
  displayRegular: 'Lora-Regular',
  body: 'DMSans-Regular',
  bodyMedium: 'DMSans-Medium',
  bodySemiBold: 'DMSans-SemiBold',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  full: 999,
};

export const SHADOW = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  gold: {
    shadowColor: '#C8922A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
  },
};
