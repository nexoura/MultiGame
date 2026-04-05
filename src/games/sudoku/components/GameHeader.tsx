import * as React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Colors } from '@/constants/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface GameHeaderProps {
  difficulty: string;
  mistakes: number;
  time: number;
  score: number;
  cellsLeft: number;
  totalEmpty: number;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ difficulty, mistakes, time, score, cellsLeft, totalEmpty }) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filled = totalEmpty - cellsLeft;

  const scoreLabelSize = isTablet ? 14 : 11;
  const scoreValueSize = isTablet ? 44 : 34;
  const chipValueSize  = isTablet ? 18 : 15;
  const chipLabelSize  = isTablet ? 12 : 10;
  const chipIconSize   = isTablet ? 18 : 15;

  return (
    <View style={styles.container}>
      {/* Score */}
      <View style={styles.scoreBanner}>
        <Text style={[styles.scoreLabel, { fontSize: scoreLabelSize }]}>SCORE</Text>
        <Text style={[styles.scoreValue, { fontSize: scoreValueSize }]}>{score}</Text>
      </View>

      {/* Stats Row */}
      <View style={[styles.statsRow, isTablet && styles.statsRowTablet]}>
        <StatChip icon="close-circle-outline" label="Mistakes" value={`${mistakes}/3`}
          color={mistakes > 1 ? Colors.sudoku.error : Colors.sudoku.textSecondary}
          iconSize={chipIconSize} valueSize={chipValueSize} labelSize={chipLabelSize} />
        <StatChip icon="trophy-outline" label="Progress" value={`${filled}/${totalEmpty}`}
          color={Colors.sudoku.primary}
          iconSize={chipIconSize} valueSize={chipValueSize} labelSize={chipLabelSize} />
        <StatChip icon="time-outline" label="Time" value={formatTime(time)}
          color={Colors.sudoku.secondary}
          iconSize={chipIconSize} valueSize={chipValueSize} labelSize={chipLabelSize} />
        <StatChip icon="speedometer-outline" label="Level" value={difficulty}
          color="#F59E0B"
          iconSize={chipIconSize} valueSize={chipValueSize} labelSize={chipLabelSize} />
      </View>
    </View>
  );
};

const StatChip = ({ icon, label, value, color, iconSize, valueSize, labelSize }: {
  icon: any; label: string; value: string; color: string;
  iconSize: number; valueSize: number; labelSize: number;
}) => (
  <View style={styles.chip}>
    <Ionicons name={icon} size={iconSize} color={color} />
    <Text style={[styles.chipValue, { color, fontSize: valueSize }]}>{value}</Text>
    <Text style={[styles.chipLabel, { fontSize: labelSize }]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 12,
    backgroundColor: Colors.sudoku.background,
  },
  scoreBanner: {
    alignItems: 'center',
    marginBottom: 10,
  },
  scoreLabel: {
    fontWeight: '700',
    color: Colors.sudoku.textSecondary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  scoreValue: {
    fontWeight: '900',
    color: Colors.sudoku.primary,
    letterSpacing: -1,
    lineHeight: 48,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    backgroundColor: Colors.sudoku.cardBg,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 8,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statsRowTablet: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  chip: {
    alignItems: 'center',
    gap: 2,
  },
  chipValue: {
    fontWeight: '700',
  },
  chipLabel: {
    color: Colors.sudoku.textSecondary,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
