/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
  sudoku: {
    primary: '#6C63FF',       // Vibrant Purple
    secondary: '#48CAE4',     // Sky Blue
    error: '#EF4444',         // Red
    background: '#F7F8FF',    // Off White
    cardBg: '#FFFFFF',        // White card
    cellBackground: '#FFFFFF',
    cellSelected: '#EDE9FE',  // Light purple
    cellHighlight: '#F5F3FF', // Very light purple
    text: '#1A1A2E',          // Dark Navy
    textSecondary: '#6B7280', // Gray
    borderLight: '#E5E7EB',   // Light gray
    borderDark: '#D1D5DB',    // Medium gray
    accent: '#F472B6',        // Pink accent
  },
  ludo: {
    red: '#EF4444',
    blue: '#3B82F6',
    green: '#10B981',
    yellow: '#F59E0B',
    background: '#F8FAFC',
    boardBorder: '#334155',
  },
  chess: {
    background: '#110d0c',
    surface: '#161311',
    primary: '#e3beb8',          // terracotta
    secondary: '#e9c176',        // gold
    tertiary: '#c8c8b0',         // sage
    onBackground: '#eae1dd',
    onSurface: '#eae1dd',
    outline: '#9a8f80',
    outlineVariant: '#4e4639',
    surfaceContainerLowest: '#110d0c',
    surfaceContainerLow: '#1f1b19',
    surfaceContainer: '#231f1d',
    surfaceContainerHigh: '#2e2927',
    surfaceContainerHighest: '#393431',
    tertiaryContainer: '#a6a791',
    onSecondary: '#412d00',
  }
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
});
