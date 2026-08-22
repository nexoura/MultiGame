import React from 'react';
import { StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Position } from '../utils/chessConstants';

interface SquareProps {
  row: number;
  col: number;
  isSelected: boolean;
  isValidMove: boolean;
  isLastMove: boolean;
  onPress: (pos: Position) => void;
  children?: React.ReactNode;
}

export const Square: React.FC<SquareProps> = ({ 
  row, col, isSelected, isValidMove, isLastMove, onPress, children 
}) => {
  const { width } = useWindowDimensions();
  const squareSize = (width - 64) / 8;
  
  const isLight = (row + col) % 2 === 0;
  
  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={() => onPress({ row, col })}
      style={[
        styles.square,
        { width: squareSize, height: squareSize },
        { backgroundColor: isLight ? '#a6a791' : '#393431' },
      ]}
    >
      {children}
      {isLastMove && <View style={styles.lastMoveOverlay} />}
      {isSelected && <View style={styles.selectedOverlay} />}
      {isValidMove && (
        <View style={styles.validMoveIndicator}>
          <View style={styles.validMoveDot} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  square: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(233, 193, 118, 0.15)',
    borderWidth: 2,
    borderColor: '#e9c176',
  },
  lastMoveOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(233, 193, 118, 0.25)',
  },
  validMoveIndicator: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  validMoveDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(233, 193, 118, 0.6)',
  },
});
