import React from 'react';
import { StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Position } from '../utils/chessConstants';

interface SquareProps {
  row: number;
  col: number;
  isSelected?: boolean;
  isValidMove?: boolean;
  isLastMove?: boolean;
  onPress: (pos: Position) => void;
  children?: React.ReactNode;
}

export const Square: React.FC<SquareProps> = ({ 
  row, col, isSelected, isValidMove, isLastMove, onPress, children 
}) => {
  const { width } = useWindowDimensions();
  const squareSize = (width - 40) / 8; // Assuming 20px padding on each side

  const isLight = (row + col) % 2 === 0;
  
  const backgroundColor = isLight ? '#dfbb9d' : '#864d36';
  const highlightColor = isSelected ? 'rgba(255, 255, 0, 0.4)' : 
                         isLastMove ? 'rgba(255, 255, 0, 0.2)' : null;

  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={() => onPress({ row, col })}
      style={[
        styles.square, 
        { width: squareSize, height: squareSize, backgroundColor }
      ]}
    >
      {highlightColor && (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: highlightColor }]} />
      )}
      
      {children}
      
      {isValidMove && (
        <View style={children ? styles.captureIndicator : styles.moveIndicator} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  square: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  moveIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  captureIndicator: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
    borderWidth: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    position: 'absolute',
  }
});
