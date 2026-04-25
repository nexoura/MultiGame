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
        { backgroundColor: isLight ? '#dfbb9d' : '#864d36' },
        isSelected && styles.selected,
        isLastMove && styles.lastMove,
      ]}
    >
      {children}
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
  },
  selected: {
    backgroundColor: '#ffdb58',
  },
  lastMove: {
    backgroundColor: '#f6e0b3',
    opacity: 0.8,
  },
  validMoveIndicator: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  validMoveDot: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
});
