import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { PieceType, PlayerColor } from '../utils/chessConstants';
import { SvgPiece } from './SvgPiece';

interface PieceProps {
  type: PieceType;
  color: PlayerColor;
  size?: number;
}

export const Piece: React.FC<PieceProps> = ({ type, color, size }) => {
  const { width } = useWindowDimensions();
  // Calculate dynamic square size (matching Square.tsx)
  const defaultSize = (width - 64) / 8;
  const finalSize = size ?? defaultSize;

  return (
    <View style={[styles.container, { width: finalSize, height: finalSize }]}>
      <SvgPiece type={type} color={color} size={finalSize * 0.85} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
