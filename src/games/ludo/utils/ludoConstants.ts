export const LUDO_COLORS = {
  // Classic Ludo Vibrant Palette (As per image)
  primary: '#2481ff',           // Ludo Blue (Classic)
  secondary: '#ff3b30',         // Ludo Red (Classic)
  tertiary: '#4cd964',          // Ludo Green (Classic)
  yellow: '#ffcc00',            // Ludo Yellow (Classic)
  
  // Board & Grid
  surface: '#FFFFFF',           // White base layer
  surfaceContainer: '#FFFFFF',  // Grid backing
  surfaceContainerLow: '#FFFFFF', // Path background
  surfaceContainerLowest: '#ffffff', // Player card base
  
  // High Contrast Text
  onSurface: '#000000',         // Pure black for grid lines and text
  outline: '#000000',           // Pure black outline
  white: '#FFFFFF',
  text: '#000000',
  glass: 'rgba(255, 255, 255, 0.4)',
};

export const LUDO_RADII = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  full: 999,
};

export const LUDO_SHADOWS = {
  ambient: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  innerToken: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  }
};

export type PlayerColor = 'red' | 'green' | 'yellow' | 'blue';

export const PLAYER_CONFIG: Record<PlayerColor, { color: string; container: string; startPos: number; homeEntrance: number }> = {
  red: {
    color: LUDO_COLORS.secondary,
    container: '#FFEBEA',
    startPos: 1, // Red starts in Segment 1 (Top)
    homeEntrance: 51,
  },
  green: {
    color: LUDO_COLORS.tertiary,
    container: '#E8F5E9',
    startPos: 14, // Green starts in Segment 2 (Right)
    homeEntrance: 12,
  },
  yellow: {
    color: LUDO_COLORS.yellow,
    container: '#FFF9C4',
    startPos: 27, // Yellow starts in Segment 3 (Bottom)
    homeEntrance: 25,
  },
  blue: {
    color: LUDO_COLORS.primary,
    container: '#E3F2FD',
    startPos: 40, // Blue starts in Segment 4 (Left)
    homeEntrance: 38,
  }
};

export const GRID_SIZE = 15;
export const BOARD_PATH_LENGTH = 52;
export const HOME_PATH_LENGTH = 6;
