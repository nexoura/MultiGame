import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Board, Move, Position } from '../utils/chessConstants';
import { Piece } from './Piece';
import { Square } from './Square';

interface ChessBoardProps {
  board: Board;
  selectedSquare: Position | null;
  validMoves: Move[];
  lastMove: Move | null;
  onSquarePress: (pos: Position) => void;
}

export const ChessBoard: React.FC<ChessBoardProps> = ({ 
  board, selectedSquare, validMoves, lastMove, onSquarePress 
}) => {
  const isTarget = (r: number, c: number) => {
    return validMoves.some(m => m.to.row === r && m.to.col === c);
  };

  const isLastMoveSquare = (r: number, c: number) => {
    if (!lastMove) return false;
    return (lastMove.from.row === r && lastMove.from.col === c) || 
           (lastMove.to.row === r && lastMove.to.col === c);
  };

  return (
    <View style={styles.board}>
      {board.map((row, r) => (
        <View key={`row-${r}`} style={styles.row}>
          {row.map((piece, c) => (
            <Square
              key={`sq-${r}-${c}`}
              row={r}
              col={c}
              isSelected={selectedSquare?.row === r && selectedSquare?.col === c}
              isValidMove={isTarget(r, c)}
              isLastMove={isLastMoveSquare(r, c)}
              onPress={onSquarePress}
            >
              {piece && (
                <Piece type={piece.type} color={piece.color} />
              )}
            </Square>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    backgroundColor: '#231f1d',
    borderWidth: 12,
    borderColor: '#231f1d',
    borderRadius: 12,
    elevation: 12,
    shadowColor: '#110d0c',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
  },
});
