import { StyleSheet, SafeAreaView, View, Text, ScrollView, Alert, useWindowDimensions } from 'react-native';
import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Stack } from 'expo-router';
import { SudokuGrid } from '@/components/SudokuGrid';
import { NumberPad } from '@/components/NumberPad';
import { GameHeader } from '@/components/GameHeader';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { generatePuzzle, Difficulty, SudokuBoard } from '@/utils/sudoku';
import { Colors } from '@/constants/theme';
import { useHints } from '@/hooks/useHints';
import * as Haptics from 'expo-haptics';
import {
  recordGameResult,
  starsForTime,
  getLevelInfo,
  STARS_PER_LEVEL,
  DifficultyMode,
  modeToDifficulty,
} from '@/utils/gameStats';

/** Format seconds → "m:ss" */
const formatTime = (s: number) =>
  `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

export default function SudokuScreen() {
  const [gameStarted, setGameStarted] = useState(false);
  const [difficultyMode, setDifficultyMode] = useState<DifficultyMode>('medium');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [solution, setSolution] = useState<SudokuBoard>([]);
  const [board, setBoard] = useState<SudokuBoard>([]);
  const [initialBoard, setInitialBoard] = useState<SudokuBoard>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [mistakesCount, setMistakesCount] = useState(0);
  const [mistakesCells, setMistakesCells] = useState<[number, number][]>([]);
  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [history, setHistory] = useState<SudokuBoard[]>([]);
  const [pencilMode, setPencilMode] = useState(false);
  const [notes, setNotes] = useState<Set<number>[][]>(
    Array(9).fill(null).map(() => Array(9).fill(null).map(() => new Set()))
  );
  const [score, setScore] = useState(0);
  const [totalEmpty, setTotalEmpty] = useState(0);

  const { width, height } = useWindowDimensions();
  const isTablet = width >= 600;
  // Cap the content to a readable max width on tablet/web
  const contentWidth = isTablet ? Math.min(width * 0.7, 720) : width;
  const gridWidth = Math.min(contentWidth * 0.95, height * 0.58, 560);

  // Hints system
  const { freeHintsLeft, totalHintsLeft, needsAd, useHint, showRewardedAd } = useHints();

  // Timer
  useEffect(() => {
    if (!gameStarted) return;
    let interval: ReturnType<typeof setInterval>;
    if (!isPaused) {
      interval = setInterval(() => setTime(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isPaused, gameStarted]);

  const startGame = useCallback((mode: DifficultyMode) => {
    const diff = modeToDifficulty[mode];
    const { puzzle, solution: sol } = generatePuzzle(diff);
    setDifficultyMode(mode);
    setDifficulty(diff);
    setBoard(puzzle);
    setInitialBoard(puzzle);
    setSolution(sol);
    setSelectedCell(null);
    setMistakesCount(0);
    setMistakesCells([]);
    setTime(0);
    setHistory([]);
    setScore(0);
    setPencilMode(false);
    setNotes(Array(9).fill(null).map(() => Array(9).fill(null).map(() => new Set())));
    let emptyCount = 0;
    puzzle.forEach(r => r.forEach(c => { if (c === null) emptyCount++; }));
    setTotalEmpty(emptyCount);
    setGameStarted(true);
  }, []);

  const exitToMenu = useCallback(() => {
    setGameStarted(false);
    setIsPaused(false);
  }, []);

  const handleCellPress = (row: number, col: number) => {
    setSelectedCell([row, col]);
  };

  const handleNumberPress = useCallback((num: number) => {
    if (!selectedCell) return;
    const [r, c] = selectedCell;
    if (initialBoard[r][c] !== null) return;
    // Don't overwrite a correctly placed cell
    const isMistakeCell = mistakesCells.some(([mr, mc]) => mr === r && mc === c);
    if (board[r][c] !== null && !isMistakeCell) return;

    if (pencilMode) {
      const newNotes = notes.map(row => [...row]);
      const cellNotes = new Set(newNotes[r][c]);
      if (cellNotes.has(num)) cellNotes.delete(num);
      else cellNotes.add(num);
      newNotes[r][c] = cellNotes;
      setNotes(newNotes);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return;
    }

    // Always place the number so the user sees it
    setHistory(prev => [...prev, board.map(row => [...row])]);
    const newBoard = board.map((row, ri) =>
      row.map((cell, ci) => (ri === r && ci === c ? num : cell))
    );
    setBoard(newBoard);

    if (solution[r][c] === num) {
      // Correct!
      setScore(prev => prev + 10);
      setMistakesCells(prev => prev.filter(([mr, mc]) => mr !== r || mc !== c));
      const newNotes = notes.map(row => [...row]);
      newNotes[r][c] = new Set();
      setNotes(newNotes);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      const isWon = newBoard.every((row, ri) =>
        row.every((cell, ci) => cell === solution[ri][ci])
      );
      if (isWon) {
        const stars      = starsForTime(time);
        const finalScore = score + 10;
        recordGameResult(true, difficultyMode, stars).then(newStats => {
          const modeStats    = newStats.modes[difficultyMode];
          const newLI        = getLevelInfo(modeStats.totalStars);
          const prevLI       = getLevelInfo(modeStats.totalStars - stars);
          const leveledUp    = newLI.level > prevLI.level;
          const starEmoji    = '⭐'.repeat(stars) + '✩'.repeat(5 - stars);
          const barFilled    = Math.round(newLI.progress * 10);
          const bar          = '█'.repeat(barFilled) + '░'.repeat(10 - barFilled);
          const modeLabel    = difficultyMode.charAt(0).toUpperCase() + difficultyMode.slice(1);

          let msg = `${starEmoji}  ${stars} Star${stars > 1 ? 's' : ''}!\n`;
          msg += `⏱ Time: ${formatTime(time)}   •   Score: ${finalScore}\n`;
          msg += `+${stars} XP to ${modeLabel}\n\n`;
          if (leveledUp) {
            msg += `🎊 Level Up!  ${modeLabel} → Lv${newLI.level}`;
          } else {
            msg += `[${bar}] ${newLI.starsInLevel}/${STARS_PER_LEVEL} to Lv${newLI.level + 1}`;
          }

          Alert.alert('🎉 Puzzle Solved!', msg, [
            { text: 'Continue', onPress: exitToMenu },
          ]);
        });
      }
    } else {
      // Wrong — show in red, count mistake
      const newCount = mistakesCount + 1;
      setMistakesCount(newCount);
      setMistakesCells(prev => [...prev.filter(([mr, mc]) => mr !== r || mc !== c), [r, c]]);
      setScore(prev => Math.max(0, prev - 5));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      if (newCount >= 3) {
        recordGameResult(false, difficultyMode, 0);
        Alert.alert(
          '❌ Game Over',
          'You made 3 mistakes!\nWould you like to restart?',
          [
            { text: 'Restart Same Level', style: 'destructive', onPress: () => startGame(difficultyMode) },
            { text: 'Change Level', onPress: exitToMenu },
          ]
        );
      }
    }
  }, [selectedCell, board, solution, initialBoard, mistakesCount, mistakesCells, history, pencilMode, notes, score, exitToMenu, startGame, difficulty, time]);

  const handleActionPress = useCallback(async (action: 'undo' | 'hint' | 'erase' | 'pencil' | 'fastPencil') => {
    switch (action) {
      case 'undo':
        if (history.length > 0) {
          setBoard(history[history.length - 1]);
          setHistory(prev => prev.slice(0, -1));
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        break;
      case 'hint':
        if (!selectedCell) {
          Alert.alert('Select a cell', 'Tap an empty cell first, then press Hint.');
          return;
        }
        const [hr, hc] = selectedCell;
        if (board[hr][hc] !== null && !mistakesCells.some(([mr, mc]) => mr === hr && mc === hc)) return;

        if (totalHintsLeft > 0) {
          // Has hints available — use one
          const ok = await useHint();
          if (ok) {
            handleNumberPress(solution[hr][hc] as number);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
        } else {
          // No hints — offer rewarded ad
          Alert.alert(
            '💡 No Hints Left',
            `You used your ${freeHintsLeft === 0 ? 'free ' : ''}hint for today.\nWatch a short video to earn 1 more hint!`,
            [
              { text: 'Watch Ad 📺', onPress: showRewardedAd },
              { text: 'Cancel', style: 'cancel' },
            ]
          );
        }
        break;
      case 'erase':
        if (!selectedCell) return;
        const [er, ec] = selectedCell;
        if (initialBoard[er][ec] === null) {
          setBoard(prev => prev.map((row, ri) =>
            row.map((cell, ci) => (ri === er && ci === ec ? null : cell))
          ));
          setNotes(prev => {
            const next = prev.map(row => [...row]);
            next[er][ec] = new Set();
            return next;
          });
          setMistakesCells(prev => prev.filter(([mr, mc]) => mr !== er || mc !== ec));
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        break;
      case 'pencil':
        setPencilMode(prev => !prev);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
    }
  }, [history, board, selectedCell, initialBoard, solution, handleNumberPress, totalHintsLeft, useHint, showRewardedAd, freeHintsLeft, mistakesCells]);

  const numberCounts = React.useMemo(() => {
    const counts: Record<number, number> = {};
    [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(n => {
      let count = 0;
      board.forEach(row => row.forEach(cell => { if (cell === n) count++; }));
      counts[n] = 9 - count;
    });
    return counts;
  }, [board]);

  const cellsLeft = React.useMemo(() => {
    let count = 0;
    board.forEach(row => row.forEach(cell => { if (cell === null) count++; }));
    return count;
  }, [board]);

  const diffLabel = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

  // Show welcome screen if game not started
  if (!gameStarted) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{
          title: 'Sudoku',
          headerStyle: { backgroundColor: Colors.sudoku.background },
          headerTitleStyle: { color: Colors.sudoku.text, fontWeight: '800' },
          headerShadowVisible: false,
        }} />
        <WelcomeScreen onSelectDifficulty={startGame} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{
        title: 'Sudoku',
        headerStyle: { backgroundColor: Colors.sudoku.background },
        headerTitleStyle: { color: Colors.sudoku.text, fontWeight: '800' },
        headerShadowVisible: false,
        headerRight: () => (
          <Text style={styles.menuBtn} onPress={exitToMenu}>Menu</Text>
        ),
      }} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          isTablet && { paddingHorizontal: (width - contentWidth) / 2 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: gridWidth }}>
          <GameHeader
            difficulty={diffLabel}
            mistakes={mistakesCount}
            time={time}
            score={score}
            cellsLeft={cellsLeft}
            totalEmpty={totalEmpty}
          />
        </View>

        <View style={styles.gridContainer}>
          <SudokuGrid
            board={board}
            initialBoard={initialBoard}
            selectedCell={selectedCell}
            onCellPress={handleCellPress}
            mistakes={mistakesCells}
            size={gridWidth}
            notes={notes}
          />
        </View>

        <View style={{ width: gridWidth }}>
          <NumberPad
            onNumberPress={handleNumberPress}
            onActionPress={handleActionPress}
            numberCounts={numberCounts}
            pencilMode={pencilMode}
            hintsLeft={totalHintsLeft}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.newGameBtn} onPress={exitToMenu}>↩ Change Difficulty</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.sudoku.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 30,
    paddingHorizontal: 8,
  },
  gridContainer: {
    marginTop: 10,
    marginBottom: 8,
    alignItems: 'center',
  },
  footer: {
    paddingTop: 12,
    alignItems: 'center',
  },
  newGameBtn: {
    fontSize: 14,
    color: Colors.sudoku.textSecondary,
    fontWeight: '600',
    padding: 8,
  },
  menuBtn: {
    fontSize: 15,
    color: Colors.sudoku.primary,
    fontWeight: '700',
    marginRight: 12,
  },
});
