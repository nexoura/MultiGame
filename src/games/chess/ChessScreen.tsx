import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, SafeAreaView, TouchableOpacity, 
  ScrollView, Alert, Image 
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useChessGame } from './hooks/useChessGame';
import { ChessBoard } from './components/ChessBoard';
import { Piece } from './components/Piece';
import { MoveHistory } from './components/MoveHistory';

export const ChessScreen: React.FC = () => {
  const [vsComputer, setVsComputer] = useState(false);
  const {
    board,
    turn,
    statusMessage,
    isGameOver,
    winner,
    selectedSquare,
    validMoves,
    lastMove,
    capturedPieces,
    history,
    selectSquare,
    resetGame,
    undoMove,
  } = useChessGame(vsComputer);

  // Active turn timers (10 minutes per player = 600s)
  const [whiteTime, setWhiteTime] = useState(600);
  const [blackTime, setBlackTime] = useState(600);

  // Reset timers when game is reset (indicated by empty history)
  useEffect(() => {
    if (history.length === 0) {
      setWhiteTime(600);
      setBlackTime(600);
    }
  }, [history.length]);

  // Timers countdown interval
  useEffect(() => {
    if (isGameOver || whiteTime === 0 || blackTime === 0) return;
    
    const timer = setInterval(() => {
      if (turn === 'white') {
        setWhiteTime(prev => (prev > 0 ? prev - 1 : 0));
      } else {
        setBlackTime(prev => (prev > 0 ? prev - 1 : 0));
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [turn, isGameOver, whiteTime, blackTime]);

  const isTimeOut = whiteTime === 0 || blackTime === 0;
  const gameEnded = isGameOver || isTimeOut;
  
  const getGameOverReason = () => {
    if (isTimeOut) {
      return whiteTime === 0 ? "Black wins on time!" : "White wins on time!";
    }
    if (winner === 'draw') return "It's a draw!";
    return `${winner === 'white' ? 'White' : 'Black'} wins!`;
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

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
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>KINGS COURT</Text>
          <View style={styles.controls}>
            <TouchableOpacity onPress={undoMove} style={styles.iconBtn} activeOpacity={0.7}>
              <MaterialIcons name="undo" size={20} color="#e9c176" />
            </TouchableOpacity>
            <TouchableOpacity onPress={resetGame} style={styles.iconBtn} activeOpacity={0.7}>
              <MaterialIcons name="refresh" size={20} color="#e9c176" />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleMode} style={styles.modeBtn} activeOpacity={0.8}>
              <Text style={styles.modeText}>{vsComputer ? 'vs CPU' : 'Local'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Opponent Profile Area (Asymmetric Layout) */}
        <View style={styles.playerRow}>
          <View style={styles.opponentCard}>
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBm0aymGVOIYnRWXF-OrOgmfbYqXfEQmGOIA6Vbelb1U2BmMfvwz3RyJ3cHTVVvt808ehrEZg7xpxP2CdJ-omDfRrHHikxNKJSw6YVK9uOpGP4Lx2jKHB9aWQhEHom8qAlAnpUOY56xn8GqLQYI_PFu7yE3kIqpVEEW9qgdmZkujg3K2sYe-qpL0fToqBTsKT2ZNBEpn_a0TOtxGqEIfOKQhNswIq56VlnxOK9J3vJ9pmQOMnNPExDdm-am8LGC0ZcliDUCrFfElXU' }} 
              style={styles.avatarGrayscale}
            />
            <View style={styles.playerInfo}>
              <Text style={styles.piecesLabel}>BLACK PIECES</Text>
              <Text style={styles.playerName} numberOfLines={1}>
                {vsComputer ? 'Deep Blue (CPU)' : 'Opponent'} <Text style={styles.playerRating}>2700</Text>
              </Text>
            </View>
          </View>
          <View style={styles.inactiveTimer}>
            <Text style={styles.inactiveTimerText}>{formatTime(blackTime)}</Text>
          </View>
        </View>

        {/* Captured Black Pieces (White pieces captured by Black) */}
        <View style={styles.capturedArea}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.capturedRow}>
            {capturedPieces.black.map((p, i) => (
              <View key={`cb-${i}`} style={styles.capturedPieceWrapper}>
                <Piece type={p.type} color="black" size={18} />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* The Chess Board */}
        <View style={styles.boardContainer}>
          <ChessBoard
            board={board}
            selectedSquare={selectedSquare}
            validMoves={validMoves}
            lastMove={lastMove}
            onSquarePress={selectSquare}
          />
        </View>

        {/* Captured White Pieces (Black pieces captured by White) */}
        <View style={styles.capturedArea}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.capturedRow}>
            {capturedPieces.white.map((p, i) => (
              <View key={`cw-${i}`} style={styles.capturedPieceWrapper}>
                <Piece type={p.type} color="white" size={18} />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* My Profile Area (Timers glow Gold on active turn) */}
        <View style={styles.playerRow}>
          <View style={turn === 'white' ? styles.activeTimer : styles.inactiveTimer}>
            <Text style={turn === 'white' ? styles.activeTimerText : styles.inactiveTimerText}>
              {formatTime(whiteTime)}
            </Text>
          </View>
          <View style={styles.playerCard}>
            <View style={styles.playerInfoRight}>
              <Text style={styles.piecesLabel}>WHITE PIECES</Text>
              <Text style={styles.playerName} numberOfLines={1}>
                {vsComputer ? 'Magnus (You)' : 'White Player'} <Text style={styles.playerRating}>2845</Text>
              </Text>
            </View>
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAt3Ucc378NiHDQ6hrqn2rlYBWV08ZPhqo6_A1wM-5vYUW0v4829Fgz2I_FuwEFvE4iAKD99QnSE1BxLPtrFJtyYUeGNhJbAHBBUb9qAi4E9YN70B2eGEbCTYdakwQbqAsmUCmsgPSsfHpKLgOKHl-jhj3bS5pV3VJXbabKuyO7Z1W8kgTKewiTVwqksDfHX7leNBZsSKdUQZQuJm2kNif_nL6JJtEJWhoTDmwefv0GHJfnDVvyygy7WjVCLEDmRcHLXmDvESC_NqQ' }} 
              style={styles.avatarActive}
            />
          </View>
        </View>

        {/* Game Status Bar */}
        <View style={styles.statusBar}>
          <Text style={styles.statusText}>{statusMessage}</Text>
        </View>

        {/* Move History (Notation) */}
        {history.length > 0 && (
          <View style={styles.historyContainer}>
            <MoveHistory history={history} />
          </View>
        )}

        {/* Game Over Overlay */}
        {gameEnded && (
          <View style={styles.overlay}>
            <View style={styles.overlayCard}>
              <MaterialIcons name="emoji-events" size={48} color="#e9c176" style={styles.overlayIcon} />
              <Text style={styles.gameOverTitle}>GAME OVER</Text>
              <Text style={styles.gameOverReason}>{getGameOverReason()}</Text>
              <TouchableOpacity style={styles.restartBtn} onPress={resetGame} activeOpacity={0.8}>
                <Text style={styles.restartText}>Play Again</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#110d0c', // Deep Chocolate Base
  },
  scroll: {
    padding: 16,
    alignItems: 'center',
    paddingBottom: 40,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'serif',
    fontStyle: 'italic',
    fontWeight: '800',
    color: '#e9c176', // gold
    letterSpacing: 0.5,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(233, 193, 118, 0.1)',
    borderWidth: 1,
    borderRadius: 8,
  },
  modeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#e9c176', // gold CTA
    borderRadius: 8,
    shadowColor: '#e9c176',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  modeText: {
    color: '#412d00', // onSecondary
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  playerRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  opponentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f1b19', // surfaceContainerLow
    padding: 10,
    borderRadius: 12,
    flex: 1,
    marginRight: 12,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2e2927', // surfaceContainerHigh
    padding: 10,
    borderRadius: 12,
    flex: 1,
    marginLeft: 12,
  },
  playerInfo: {
    marginLeft: 10,
    flex: 1,
  },
  playerInfoRight: {
    marginRight: 10,
    flex: 1,
    alignItems: 'flex-end',
  },
  piecesLabel: {
    fontSize: 8,
    color: '#9a8f80', // outline
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 2,
  },
  playerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#eae1dd',
  },
  playerRating: {
    fontSize: 11,
    fontWeight: '400',
    color: '#e9c176',
    opacity: 0.7,
  },
  avatarGrayscale: {
    width: 36,
    height: 36,
    borderRadius: 6,
    backgroundColor: '#2e2927',
    opacity: 0.6,
  },
  avatarActive: {
    width: 36,
    height: 36,
    borderRadius: 6,
    backgroundColor: '#393431',
    borderWidth: 1.5,
    borderColor: '#e9c176',
  },
  inactiveTimer: {
    backgroundColor: '#393431', // surfaceContainerHighest
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveTimerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#d1c5b4',
    fontFamily: 'monospace',
  },
  activeTimer: {
    backgroundColor: '#e9c176', // Gold glow
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#e9c176',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  activeTimerText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#412d00', // dark brown contrast
    fontFamily: 'monospace',
  },
  boardContainer: {
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  capturedArea: {
    height: 24,
    width: '100%',
    marginVertical: 2,
    justifyContent: 'center',
  },
  capturedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  capturedPieceWrapper: {
    marginRight: 4,
    opacity: 0.8,
  },
  statusBar: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 8,
  },
  statusText: {
    fontSize: 13,
    color: '#9a8f80',
    fontWeight: '500',
    fontStyle: 'italic',
  },
  historyContainer: {
    width: '100%',
    marginTop: 4,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(17, 13, 12, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  overlayCard: {
    backgroundColor: '#161311', // Deep Chocolate surface
    borderColor: 'rgba(233, 193, 118, 0.2)',
    borderWidth: 1.5,
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    width: '80%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  overlayIcon: {
    marginBottom: 16,
  },
  gameOverTitle: {
    fontSize: 24,
    fontFamily: 'serif',
    fontWeight: '900',
    color: '#e9c176', // gold
    marginBottom: 10,
    letterSpacing: 2,
  },
  gameOverReason: {
    fontSize: 16,
    color: '#eae1dd',
    marginBottom: 24,
    textAlign: 'center',
  },
  restartBtn: {
    backgroundColor: '#e9c176',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  restartText: {
    color: '#412d00',
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  }
});
