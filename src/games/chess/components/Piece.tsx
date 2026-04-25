import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PieceType, PlayerColor, UNICODE_PIECES } from '../utils/chessConstants';

interface PieceProps {
  type: PieceType;
  color: PlayerColor;
  size?: number;
}

export const Piece: React.FC<PieceProps> = ({ type, color, size = 32 }) => {
  const symbol = UNICODE_PIECES[color][type];
  const isWhite = color === 'white';
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Text style={[
        styles.text, 
        { 
          fontSize: size * 0.95, 
          color: isWhite ? '#FFFFFF' : '#000000',
          lineHeight: size
        },
        isWhite ? styles.whitePieceShadow : styles.blackPieceShadow
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
    textAlignVertical: 'center',
    fontWeight: 'bold',
  },
  whitePieceShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  blackPieceShadow: {
    textShadowColor: 'rgba(255, 255, 255, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  }
});
