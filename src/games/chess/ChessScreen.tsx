import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, SafeAreaView, TouchableOpacity, 
  ScrollView, Alert 
} from 'react-native';
import { useChessGame } from './hooks/useChessGame';
import { ChessBoard } from './components/ChessBoard';
import { Piece } from './components/Piece';
import { IconSymbol } from '@/components/ui/icon-symbol';

export const ChessScreen: React.FC = () => {
  const [vsComputer, setVsComputer] = useState(false);
  const {
    board,
    turn,
    statusMessage,
    isGameOver,
    selectedSquare,
    validMoves,
    lastMove,
    capturedPieces,
    history,
    selectSquare,
    resetGame,
    undoMove,
  } = useChessGame(vsComputer);

  const toggleMode = () => {
    Alert.alert(
      "Change Mode",
      "Restart game with " + (vsComputer ? "Local Player?" : "Computer?"),
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Yes, Restart", 
          onPress: () => {
            setVsComputer(!vsComputer);
            resetGame();
          } 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.status}>{statusMessage}</Text>
          <View style={styles.controls}>
            <TouchableOpacity onPress={undoMove} style={styles.iconBtn}>
              <IconSymbol name="arrow.uturn.backward" size={24} color="#64748B" />
            </TouchableOpacity>
            <TouchableOpacity onPress={resetGame} style={styles.iconBtn}>
              <IconSymbol name="arrow.clockwise" size={24} color="#64748B" />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleMode} style={styles.modeBtn}>
              <Text style={styles.modeText}>{vsComputer ? 'vs CPU' : 'Local'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.capturedArea}>
          <View style={styles.capturedRow}>
            {capturedPieces.black.map((p, i) => (
              <Piece key={`cb-${i}`} type={p.type} color="black" size={20} />
            ))}
          </View>
        </View>

        <View style={styles.boardContainer}>
          <ChessBoard
            board={board}
            selectedSquare={selectedSquare}
            validMoves={validMoves}
            lastMove={lastMove}
            onSquarePress={selectSquare}
          />
        </View>

        <View style={styles.capturedArea}>
          <View style={styles.capturedRow}>
            {capturedPieces.white.map((p, i) => (
              <Piece key={`cw-${i}`} type={p.type} color="white" size={20} />
            ))}
          </View>
        </View>


        {isGameOver && (
          <View style={styles.overlay}>
            <Text style={styles.gameOverText}>Game Over</Text>
            <TouchableOpacity style={styles.restartBtn} onPress={resetGame}>
              <Text style={styles.restartText}>Play Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scroll: {
    padding: 20,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  status: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    padding: 8,
    marginLeft: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  modeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginLeft: 10,
    backgroundColor: '#1E293B',
    borderRadius: 8,
  },
  modeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  boardContainer: {
    marginVertical: 10,
  },
  capturedArea: {
    height: 30,
    width: '100%',
    justifyContent: 'center',
  },
  capturedRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  overlay: {
    position: 'absolute',
    top: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  gameOverText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1E293B',
    marginBottom: 20,
  },
  restartBtn: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 15,
  },
  restartText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  }
});
