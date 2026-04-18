import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { PieceType, PlayerColor, UNICODE_PIECES } from '../utils/chessConstants';

interface PieceProps {
  type: PieceType;
  color: PlayerColor;
  size?: number;
}

export const Piece: React.FC<PieceProps> = ({ type, color, size = 32 }) => {
  const symbol = UNICODE_PIECES[color][type];
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Text style={[
        styles.text, 
        { fontSize: size * 0.85, color: color === 'white' ? '#fef3c7' : '#3e1e13' },
        color === 'white' && styles.whitePieceShadow
      ]}>
        {symbol}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
  },
  whitePieceShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  }
});
