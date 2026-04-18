import React from 'react';
import { View, StyleSheet, useWindowDimensions, Text } from 'react-native';
import { LUDO_COLORS, GRID_SIZE, PLAYER_CONFIG, PlayerColor } from '../utils/ludoConstants';
import { LudoToken } from './LudoToken';
import { TokenState } from '../hooks/useLudoGame';
import { GLOBAL_PATH, HOME_PATHS, BASE_POSITIONS, GridPos } from '../utils/ludoPath';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface LudoBoardProps {
  tokens: Record<string, TokenState[]>;
  onTokenPress?: (color: string, id: number) => void;
}

export const LudoBoard: React.FC<LudoBoardProps> = ({ tokens, onTokenPress }) => {
  const { width: windowWidth } = useWindowDimensions();
  const BOARD_SIZE = windowWidth * 0.94;
  const CELL_SIZE = BOARD_SIZE / GRID_SIZE;

  const getCellColor = (r: number, c: number) => {
    // Quadrants (Image Orientation: Green TL, Yellow TR, Blue BR, Red BL)
    if (r < 6 && c < 6) return LUDO_COLORS.tertiary; // Green Base
    if (r < 6 && c > 8) return LUDO_COLORS.yellow;   // Yellow Base
    if (r > 8 && c < 6) return LUDO_COLORS.secondary; // Red Base
    if (r > 8 && c > 8) return LUDO_COLORS.primary;   // Blue Base

    // Home Run Paths
    if (c === 7 && r > 0 && r < 6) return LUDO_COLORS.yellow;    // Yellow path (top)
    if (r === 7 && c > 8 && c < 14) return LUDO_COLORS.primary;  // Blue path (right)
    if (c === 7 && r > 8 && r < 14) return LUDO_COLORS.secondary; // Red path (bottom)
    if (r === 7 && c > 0 && c < 6) return LUDO_COLORS.tertiary;   // Green path (left)

    // Start Cells
    if (r === 1 && c === 8) return LUDO_COLORS.yellow;
    if (r === 8 && c === 13) return LUDO_COLORS.primary;
    if (r === 13 && c === 6) return LUDO_COLORS.secondary;
    if (r === 6 && c === 1) return LUDO_COLORS.tertiary;

    return LUDO_COLORS.surface;
  };

  const renderCellContent = (r: number, c: number) => {
    // Star Locations from Image
    const stars = [
      { r: 2, c: 6 }, // Top arm left
      { r: 6, c: 12 }, // Right arm top
      { r: 12, c: 8 }, // Bottom arm right
      { r: 8, c: 2 }, // Left arm bottom
    ];

    if (stars.some(s => s.r === r && s.c === c)) {
      return <Ionicons name="star-outline" size={CELL_SIZE * 0.7} color="#222" />;
    }

    // Entry Arrows from Image
    if (r === 0 && c === 7) return <Ionicons name="chevron-down" size={CELL_SIZE * 0.8} color={LUDO_COLORS.yellow} />;
    if (r === 7 && c === 14) return <Ionicons name="chevron-back" size={CELL_SIZE * 0.8} color={LUDO_COLORS.primary} />;
    if (r === 14 && c === 7) return <Ionicons name="chevron-up" size={CELL_SIZE * 0.8} color={LUDO_COLORS.secondary} />;
    if (r === 7 && c === 0) return <Ionicons name="chevron-forward" size={CELL_SIZE * 0.8} color={LUDO_COLORS.tertiary} />;

    return null;
  };

  const renderHomeBases = () => {
    const bases = [
      { r: 0, c: 0, color: LUDO_COLORS.tertiary }, // Green
      { r: 0, c: 9, color: LUDO_COLORS.yellow },   // Yellow
      { r: 9, c: 0, color: LUDO_COLORS.secondary }, // Red
      { r: 9, c: 9, color: LUDO_COLORS.primary },   // Blue
    ];

    return bases.map((base, idx) => (
      <View
        key={idx}
        style={[
          styles.baseUnit,
          {
            left: base.c * CELL_SIZE,
            top: base.r * CELL_SIZE,
            width: CELL_SIZE * 6,
            height: CELL_SIZE * 6,
            backgroundColor: base.color,
          },
        ]}
      >
        <View style={styles.baseInner}>
          <View style={styles.tokenSlotRow}>
            <View style={[styles.tokenSlot, { backgroundColor: base.color }]} />
            <View style={[styles.tokenSlot, { backgroundColor: base.color }]} />
          </View>
          <View style={styles.tokenSlotRow}>
            <View style={[styles.tokenSlot, { backgroundColor: base.color }]} />
            <View style={[styles.tokenSlot, { backgroundColor: base.color }]} />
          </View>
        </View>
      </View>
    ));
  };

  const renderCenterArea = () => {
    return (
      <View style={[styles.centerPiece, { width: CELL_SIZE * 3, height: CELL_SIZE * 3, left: CELL_SIZE * 6, top: CELL_SIZE * 6 }]}>
        {/* Top Triangle - Yellow */}
        <View style={[styles.triangle, styles.triTop, { borderBottomColor: LUDO_COLORS.yellow, borderBottomWidth: CELL_SIZE * 1.5, borderLeftWidth: CELL_SIZE * 1.5, borderRightWidth: CELL_SIZE * 1.5 }]} />
        {/* Right Triangle - Blue */}
        <View style={[styles.triangle, styles.triRight, { borderLeftColor: LUDO_COLORS.primary, borderLeftWidth: CELL_SIZE * 1.5, borderTopWidth: CELL_SIZE * 1.5, borderBottomWidth: CELL_SIZE * 1.5 }]} />
        {/* Bottom Triangle - Red */}
        <View style={[styles.triangle, styles.triBottom, { borderTopColor: LUDO_COLORS.secondary, borderTopWidth: CELL_SIZE * 1.5, borderLeftWidth: CELL_SIZE * 1.5, borderRightWidth: CELL_SIZE * 1.5 }]} />
        {/* Left Triangle - Green */}
        <View style={[styles.triangle, styles.triLeft, { borderRightColor: LUDO_COLORS.tertiary, borderRightWidth: CELL_SIZE * 1.5, borderTopWidth: CELL_SIZE * 1.5, borderBottomWidth: CELL_SIZE * 1.5 }]} />
      </View>
    );
  };

  return (
    <View style={[styles.board, { width: BOARD_SIZE, height: BOARD_SIZE }]}>
      {/* Grid Rendering */}
      {Array.from({ length: GRID_SIZE }).map((_, r) => (
        <View key={r} style={styles.row}>
          {Array.from({ length: GRID_SIZE }).map((_, c) => (
            <View
              key={`${r}-${c}`}
              style={[
                styles.cell,
                {
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  backgroundColor: getCellColor(r, c),
                  borderWidth: (r < 6 && c < 6) || (r < 6 && c > 8) || (r > 8 && c < 6) || (r > 8 && c > 8) ? 0 : 0.5,
                  borderColor: '#000',
                },
              ]}
            >
              {renderCellContent(r, c)}
            </View>
          ))}
        </View>
      ))}

      {/* Overlay Units for design parity */}
      {renderHomeBases()}
      {renderCenterArea()}

      {/* Tokens Layer */}
      {Object.entries(tokens).map(([color, playerTokens]) =>
        playerTokens.map((token) => {
          let gridPos: GridPos;
          if (token.pos === -1) {
            gridPos = BASE_POSITIONS[color][token.id];
          } else if (token.pos < 52) {
            const startIndex = PLAYER_CONFIG[color as PlayerColor].startPos;
            const globalIdx = (startIndex + token.pos) % 52;
            gridPos = GLOBAL_PATH[globalIdx];
          } else {
            gridPos = HOME_PATHS[color][token.pos - 52];
          }

          return (
            <View
              key={`${color}-${token.id}`}
              style={[
                styles.tokenWrapper,
                {
                  left: gridPos.c * CELL_SIZE,
                  top: gridPos.r * CELL_SIZE,
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                },
              ]}
            >
              <LudoToken
                color={color as any}
                size={CELL_SIZE * 0.75}
                active={token.pos !== -1 && token.pos !== 58}
              />
            </View>
          );
        })
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    backgroundColor: '#000',
    borderWidth: 2,
    borderColor: '#000',
    position: 'relative',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  baseUnit: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10%',
    borderWidth: 1,
    borderColor: '#000',
  },
  baseInner: {
    backgroundColor: '#FFF',
    width: '90%',
    height: '90%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    borderWidth: 1,
    borderColor: '#000',
  },
  tokenSlotRow: {
    flexDirection: 'row',
    gap: 15,
  },
  tokenSlot: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  centerPiece: {
    position: 'absolute',
    zIndex: 2,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    position: 'absolute',
  },
  triTop: {
    top: 0,
  },
  triRight: {
    right: 0,
  },
  triBottom: {
    bottom: 0,
  },
  triLeft: {
    left: 0,
  },
  tokenWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  }
});
