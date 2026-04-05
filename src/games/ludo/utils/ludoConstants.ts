export const LUDO_COLORS = {
  // Official Stitch Tonal Range
  primary: '#0c50d4',           // Ludo Blue (BL)
  secondary: '#b71020',         // Ludo Red (TL)
  tertiary: '#006a35',          // Ludo Green (TR)
  yellow: '#bd9900',            // Ludo Yellow (BR)
  
  // Surface Architecture
  surface: '#fff5e4',           // Warm parchment cream base layer
  surfaceContainer: '#ffe6a2',  // Board tray
  surfaceContainerLow: '#fff0ca', // Cell tray
  surfaceContainerLowest: '#ffffff', // Player card base
  
  // Interactive Containers
  primaryContainer: '#7d9cff',
  secondaryContainer: '#ffc3be',
  tertiaryContainer: '#6bfe9c',
  
  // Typography & Lines
  onSurface: '#3a2d00',         // Warm contrast text (Never pure black)
  outline: '#907400',           // Subtle gold/shadow outline
  white: '#FFFFFF',
  text: '#3a2d00',
};

export const LUDO_RADII = {
  sm: 8,
  md: 16,
  lg: 32,    // 2rem base
  xl: 48,    // 3rem "Chunky" spec
  full: 999,
};

export const LUDO_SHADOWS = {
  ambient: {
    shadowColor: '#3a2d00',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 32,
    elevation: 4,
  },
  innerToken: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  }
};

export type PlayerColor = 'red' | 'green' | 'yellow' | 'blue';

export const PLAYER_CONFIG: Record<PlayerColor, { color: string; container: string; startPos: number; homeEntrance: number }> = {
  red: {
    color: LUDO_COLORS.secondary,
    container: LUDO_COLORS.secondaryContainer,
    startPos: 1, // Red starts in Segment 1 (Top)
    homeEntrance: 51,
  },
  green: {
    color: LUDO_COLORS.tertiary,
    container: LUDO_COLORS.tertiaryContainer,
    startPos: 14, // Green starts in Segment 2 (Right)
    homeEntrance: 12,
  },
  yellow: {
    color: LUDO_COLORS.yellow,
    container: LUDO_COLORS.surfaceContainer,
    startPos: 27, // Yellow starts in Segment 3 (Bottom)
    homeEntrance: 25,
  },
  blue: {
    color: LUDO_COLORS.primary,
    container: LUDO_COLORS.primaryContainer,
    startPos: 40, // Blue starts in Segment 4 (Left)
    homeEntrance: 38,
  }
};

export const GRID_SIZE = 15;
export const BOARD_PATH_LENGTH = 52;
export const HOME_PATH_LENGTH = 6;
