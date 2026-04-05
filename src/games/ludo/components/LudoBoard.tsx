import React from 'react';
import { View, StyleSheet, useWindowDimensions, Text } from 'react-native';
import { LUDO_COLORS, GRID_SIZE, PLAYER_CONFIG, LUDO_SHADOWS, LUDO_RADII, PlayerColor } from '../utils/ludoConstants';
import { LudoToken } from './LudoToken';
import { TokenState } from '../hooks/useLudoGame';
import { GLOBAL_PATH, HOME_PATHS, BASE_POSITIONS, GridPos } from '../utils/ludoPath';
import { Ionicons } from '@expo/vector-icons';

interface LudoBoardProps {
  tokens: Record<string, TokenState[]>;
  onTokenPress?: (color: string, id: number) => void;
}

export const LudoBoard: React.FC<LudoBoardProps> = ({ tokens, onTokenPress }) => {
  const { width: windowWidth } = useWindowDimensions();
  const BOARD_SIZE = windowWidth * 0.94;
  const CELL_SIZE = BOARD_SIZE / GRID_SIZE;

  const getCellColor = (r: number, c: number) => {
    // Quadrants (Stitch Orientation: Red TL, Green TR)
    if (r < 6 && c < 6) return LUDO_COLORS.secondary; // Red Base
    if (r < 6 && c > 8) return LUDO_COLORS.tertiary;  // Green Base
    if (r > 8 && c < 6) return LUDO_COLORS.primary;   // Blue Base
    if (r > 8 && c > 8) return LUDO_COLORS.yellow;    // Yellow Base

    // Home Run Paths
    if (c === 7 && r > 0 && r < 6) return LUDO_COLORS.secondary; // Red Home
    if (r === 7 && c > 8 && c < 14) return LUDO_COLORS.tertiary;  // Green Home
    if (c === 7 && r > 8 && r < 14) return LUDO_COLORS.yellow;    // Yellow Home
    if (r === 7 && c > 0 && c < 6) return LUDO_COLORS.primary;   // Blue Home

    // Start Cells
    if (r === 1 && c === 6) return LUDO_COLORS.secondary;
    if (r === 6 && c === 13) return LUDO_COLORS.tertiary;
    if (r === 13 && c === 8) return LUDO_COLORS.yellow;
    if (r === 8 && c === 1) return LUDO_COLORS.primary;

    // "No-Line" Rule Path Cells
    return LUDO_COLORS.surfaceContainerLow; // Warm parchment-grey cells
  };

  const renderCellContent = (r: number, c: number) => {
    const stars = [
      { r: 2, c: 6 }, { r: 6, c: 12 }, { r: 12, c: 8 }, { r: 8, c: 2 }
    ];
    if (stars.some(s => s.r === r && s.c === c)) {
      return <Ionicons name="star" size={CELL_SIZE * 0.6} color={LUDO_COLORS.surface} />;
    }

    if (r === 1 && c === 6) return <Ionicons name="caret-down" size={CELL_SIZE * 0.7} color="#FFF" />;
    if (r === 6 && c === 13) return <Ionicons name="caret-back" size={CELL_SIZE * 0.7} color="#FFF" />;
    if (r === 13 && c === 8) return <Ionicons name="caret-up" size={CELL_SIZE * 0.7} color="#FFF" />;
    if (r === 8 && c === 1) return <Ionicons name="caret-forward" size={CELL_SIZE * 0.7} color="#FFF" />;

    return null;
  };

  return (
    <View style={[styles.board, { width: BOARD_SIZE, height: BOARD_SIZE }, LUDO_SHADOWS.ambient]}>
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
                  // "No-Line" Shift
                  margin: 1, 
                  borderRadius: 4,
                },
              ]}
            >
              {/* Official Rounded Bases */}
              {((r === 0 && c === 0) || (r === 0 && c === 9) || (r === 9 && c === 0) || (r === 9 && c === 9)) && (
                <View style={[styles.baseInset, { width: CELL_SIZE * 4, height: CELL_SIZE * 4, left: CELL_SIZE, top: CELL_SIZE }]}>
                    <View style={styles.tokenSlotRow}>
                        <View style={[styles.tokenSlot, { backgroundColor: getCellColor(r, c) }]} />
                        <View style={[styles.tokenSlot, { backgroundColor: getCellColor(r, c) }]} />
                    </View>
                    <View style={styles.tokenSlotRow}>
                        <View style={[styles.tokenSlot, { backgroundColor: getCellColor(r, c) }]} />
                        <View style={[styles.tokenSlot, { backgroundColor: getCellColor(r, c) }]} />
                    </View>
                </View>
              )}

              {/* LUDO Diamond Center (Tactile Joy) */}
              {r === 6 && c === 6 && (
                <View style={[styles.centerPiece, { width: CELL_SIZE * 3, height: CELL_SIZE * 3 }]}>
                  <View style={styles.centerDiamond}>
                     <Text style={styles.centerText}>LUDO</Text>
                  </View>
                  <View style={[styles.triangle, styles.triTop, { borderBottomColor: LUDO_COLORS.secondary, borderBottomWidth: CELL_SIZE, borderLeftWidth: CELL_SIZE * 1.5, borderRightWidth: CELL_SIZE * 1.5 }]} />
                  <View style={[styles.triangle, styles.triRight, { borderLeftColor: LUDO_COLORS.tertiary, borderLeftWidth: CELL_SIZE, borderTopWidth: CELL_SIZE * 1.5, borderBottomWidth: CELL_SIZE * 1.5 }]} />
                  <View style={[styles.triangle, styles.triBottom, { borderTopColor: LUDO_COLORS.yellow, borderTopWidth: CELL_SIZE, borderLeftWidth: CELL_SIZE * 1.5, borderRightWidth: CELL_SIZE * 1.5 }]} />
                  <View style={[styles.triangle, styles.triLeft, { borderRightColor: LUDO_COLORS.primary, borderRightWidth: CELL_SIZE, borderTopWidth: CELL_SIZE * 1.5, borderBottomWidth: CELL_SIZE * 1.5 }]} />
                </View>
              )}

              {renderCellContent(r, c)}
            </View>
          ))}
        </View>
      ))}

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
                size={CELL_SIZE * 0.82}
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
    backgroundColor: LUDO_COLORS.surfaceContainer,
    borderRadius: LUDO_RADII.xl,
    overflow: 'hidden',
    position: 'relative',
    padding: 2,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  baseInset: {
    backgroundColor: LUDO_COLORS.surfaceContainerLowest,
    borderRadius: LUDO_RADII.lg,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    ...LUDO_SHADOWS.ambient,
  },
  tokenSlotRow: {
    flexDirection: 'row',
    gap: 16,
  },
  tokenSlot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    opacity: 0.15,
  },
  centerPiece: {
    position: 'absolute',
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerDiamond: {
    width: '100%',
    height: '100%',
    backgroundColor: LUDO_COLORS.surfaceContainerLowest,
    borderRadius: LUDO_RADII.md,
    transform: [{ rotate: '45deg' }],
    zIndex: 5,
    justifyContent: 'center',
    alignItems: 'center',
    ...LUDO_SHADOWS.ambient,
  },
  centerText: {
    transform: [{ rotate: '-45deg' }],
    fontSize: 10,
    fontWeight: '900',
    color: LUDO_COLORS.onSurface,
    letterSpacing: 1,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    position: 'absolute',
    zIndex: 1,
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
