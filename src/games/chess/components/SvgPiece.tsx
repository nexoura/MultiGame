import React from 'react';
import Svg, { Path, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { PieceType, PlayerColor } from '../utils/chessConstants';

interface SvgPieceProps {
  type: PieceType;
  color: PlayerColor;
  size: number;
}

export const SvgPiece: React.FC<SvgPieceProps> = ({ type, color, size }) => {
  const isWhite = color === 'white';
  
  // High-fidelity wood tones
  // Light side (highlights) vs Dark side (shadows)
  const lightWood = isWhite ? '#F5F5F5' : '#795548'; 
  const darkWood = isWhite ? '#D7CCC8' : '#3E2723';
  
  const renderPaths = () => {
    switch (type) {
      case 'p': // Pawn
        return (
          <G scale={size / 45}>
            {/* Left side (Shadow) */}
            <Path
              d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47v2.5H22.5V9z"
              fill={darkWood}
            />
            {/* Right side (Light) */}
            <Path
              d="M22.5 9v33h11.5v-2.5c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"
              fill={lightWood}
            />
          </G>
        );
      case 'r': // Rook
        return (
          <G scale={size / 45}>
            <Path d="M11 9v4h23V9H11zm2 10v18h19V19H13zM11 41v3h23v-3H11z" fill={darkWood} opacity={0.5} />
            <Path d="M22.5 9v35h11.5v-3H34V9H22.5z" fill={lightWood} />
            <Path d="M11 9v35h11.5V9H11z" fill={darkWood} />
          </G>
        );
      case 'n': // Knight
        return (
          <G scale={size / 45}>
            <Path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill={darkWood} />
            <Path d="M24 18c-3 1 5 12 5 12l2-4" fill={lightWood} opacity={0.3} />
            <Path d="M22.5 10v32h11.5c.5-21-5.5-28-11.5-29z" fill={lightWood} />
            <Path d="M22.5 10c-6 1-12 8-11.5 29H22.5V10z" fill={darkWood} />
          </G>
        );
      case 'b': // Bishop
        return (
          <G scale={size / 45}>
            <Path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 4.5 10.5-4.5 10.5H13.5C4.5 46.5 9 36 9 36z" fill={darkWood} />
            <Path d="M15 15.5c4.5-13.5 10.5-13.5 15 0 0 0 6 12-7.5 18-13.5-6-7.5-18-7.5-18z" fill={darkWood} />
            <Path d="M22.5 6v32h11.5s-2.5-9.5-6-15c0 0 4.5-9 0-17z" fill={lightWood} />
            <Path d="M22.5 6c-4.5 8 0 17 0 17-3.5 5.5-6 15-6 15H22.5V6z" fill={darkWood} />
          </G>
        );
      case 'q': // Queen
        return (
          <G scale={size / 45}>
            <Path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-13.5V25l-7-11 2 12z" fill={darkWood} />
            <Path d="M9 40c0 2 2 2 2 4h23c0-2 2-2 2-4H9z" fill={darkWood} />
            <Path d="M22.5 11v33h11.5c2-2 2-2 2-4H22.5V11z" fill={lightWood} />
            <Path d="M9 40c0 2 2 2 2 4H22.5V11L15 25V11l-5.5 13.5L9 26v14z" fill={darkWood} />
          </G>
        );
      case 'k': // King
        return (
          <G scale={size / 45}>
            <Path d="M22.5 11.63V6M20 8h5M22.5 25s4.5-7.5 3-10c-1.5-2.5-6-2.5-6 0-1.5 2.5 3 10 3 10z" stroke={isWhite ? '#3E2723' : '#F5F5F5'} strokeWidth="1" />
            <Path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 0-9c-9-4.5-21-4.5-30 0-9 4.5 0 9 0 9v7z" fill={darkWood} />
            <Path d="M22.5 15v31h11.5v-7s9-4.5 0-9c-3.5-1.75-7.5-2.5-11.5-2.5V15z" fill={lightWood} />
            <Path d="M11 30v7c5.5 3.5 11.5 3.5 11.5 3.5V15c-4 0-8 .75-11.5 2.5-9 4.5 0 9 0 9z" fill={darkWood} />
          </G>
        );
      default:
        return null;
    }
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 45 45">
      {renderPaths()}
    </Svg>
  );
};
