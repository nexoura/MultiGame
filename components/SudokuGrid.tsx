import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Colors } from '@/constants/theme';

// CELL_SIZE is dynamic based on the 'size' prop
interface SudokuGridProps {
  board: (number | null)[][];
  initialBoard: (number | null)[][];
  selectedCell: [number, number] | null;
  onCellPress: (row: number, col: number) => void;
  mistakes: [number, number][];
  size: number;
  notes: Set<number>[][];
}

export const SudokuGrid: React.FC<SudokuGridProps> = ({
  board,
  initialBoard,
  selectedCell,
  onCellPress,
  mistakes,
  size,
  notes
}) => {
  const CELL_SIZE = (size - 4) / 9;
  const isSelected = (r: number, c: number) => selectedCell?.[0] === r && selectedCell?.[1] === c;
  const isHighlight = (r: number, c: number) => {
    if (!selectedCell) return false;
    const [sr, sc] = selectedCell;
    return sr === r || sc === c || (Math.floor(sr / 3) === Math.floor(r / 3) && Math.floor(sc / 3) === Math.floor(c / 3));
  };
  const isMistake = (r: number, c: number) => mistakes.some(([mr, mc]) => mr === r && mc === c);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {board.map((row: (number | null)[], rowIndex: number) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell: number | null, colIndex: number) => {
            const selected = isSelected(rowIndex, colIndex);
            const highlight = isHighlight(rowIndex, colIndex);
            const mistake = isMistake(rowIndex, colIndex);
            const isInitial = initialBoard[rowIndex][colIndex] !== null;

            return (
              <TouchableOpacity
                key={colIndex}
                onPress={() => onCellPress(rowIndex, colIndex)}
                style={[
                  styles.cell,
                  { width: CELL_SIZE, height: CELL_SIZE },
                  highlight && !mistake && styles.cellHighlight,
                  selected && !mistake && styles.cellSelected,
                  mistake && styles.cellMistake,
                  // 3x3 thick borders
                  (colIndex + 1) % 3 === 0 && colIndex < 8 && styles.borderRight,
                  (rowIndex + 1) % 3 === 0 && rowIndex < 8 && styles.borderBottom,
                  colIndex === 0 && styles.borderLeft,
                  rowIndex === 0 && styles.borderTop,
                ]}
              >
                {cell !== null ? (
                  <Text style={[
                    styles.cellText,
                    isInitial ? styles.initialText : styles.insertedText,
                    mistake && styles.errorText,
                    // selectedText only applies to correct inserted cells (NOT mistakes)
                    selected && !isInitial && !mistake && styles.selectedText,
                  ]}>
                    {cell}
                  </Text>
                ) : (
                  <View style={styles.notesContainer}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                      <Text key={n} style={styles.noteText}>
                        {notes[rowIndex][colIndex].has(n) ? n : ''}
                      </Text>
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.sudoku.borderDark,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.sudoku.borderDark,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    backgroundColor: Colors.sudoku.cellBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: Colors.sudoku.borderLight,
  },
  cellHighlight: {
    backgroundColor: Colors.sudoku.cellHighlight,
  },
  cellSelected: {
    backgroundColor: Colors.sudoku.cellSelected,
  },
  cellMistake: {
    backgroundColor: '#FEE2E2', // Light red background for wrong cells
  },
  borderRight: {
    borderRightWidth: 2,
    borderRightColor: Colors.sudoku.borderDark,
  },
  borderBottom: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.sudoku.borderDark,
  },
  borderLeft: {
    borderLeftWidth: 2,
    borderLeftColor: Colors.sudoku.borderDark,
  },
  borderTop: {
    borderTopWidth: 2,
    borderTopColor: Colors.sudoku.borderDark,
  },
  cellText: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'normal',
    fontSize: 22,
    fontWeight: '700',
  },
  initialText: {
    color: Colors.sudoku.text,
    fontWeight: '800',
  },
  insertedText: {
    color: Colors.sudoku.primary,
    fontWeight: '700',
  },
  selectedText: {
    color: Colors.sudoku.primary,
  },
  errorText: {
    color: Colors.sudoku.error,
  },
  notesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 1,
  },
  noteText: {
    fontSize: 8,
    width: '33.3%',
    textAlign: 'center',
    color: Colors.sudoku.textSecondary,
    fontWeight: '600',
  },
});
