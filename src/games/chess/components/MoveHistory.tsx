import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Move } from '../utils/chessConstants';

interface MoveHistoryProps {
  history: Move[];
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({ history = [] }) => {
  const pairs = [];
  for (let i = 0; i < history.length; i += 2) {
    pairs.push({
      white: history[i],
      black: history[i + 1] || null,
      num: Math.floor(i / 2) + 1
    });
  }

  const formatMove = (move: Move) => {
    const colNames = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const rowNames = ['8', '7', '6', '5', '4', '3', '2', '1'];
    return `${colNames[move.to.col]}${rowNames[move.to.row]}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Move Notation</Text>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {pairs.map((pair, idx) => {
          const isLastPair = idx === pairs.length - 1;
          return (
            <View key={`move-${idx}`} style={styles.movePair}>
              <Text style={styles.moveNum}>{pair.num}.</Text>
              <Text style={[styles.moveText, isLastPair && !pair.black ? styles.activeMoveText : null]}>
                {formatMove(pair.white)}
              </Text>
              {pair.black ? (
                <Text style={[styles.moveText, isLastPair ? styles.activeMoveText : null]}>
                  {formatMove(pair.black)}
                </Text>
              ) : (
                <Text style={styles.dotsText}>...</Text>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#1f1b19', // surfaceContainerLow
    borderRadius: 12,
    marginVertical: 10,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 10,
    fontFamily: 'serif',
    fontWeight: '700',
    color: '#9a8f80', // outline
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  movePair: {
    flexDirection: 'row',
    marginRight: 16,
    backgroundColor: '#231f1d', // surfaceContainer
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  moveNum: {
    fontSize: 12,
    color: '#e9c176', // gold
    marginRight: 6,
    fontWeight: '600',
    fontStyle: 'italic',
    fontFamily: 'serif',
  },
  moveText: {
    fontSize: 13,
    color: '#d1c5b4', // onSurfaceVariant
    marginHorizontal: 4,
    fontWeight: '500',
  },
  activeMoveText: {
    color: '#eae1dd', // active/highlight
    fontWeight: '700',
  },
  dotsText: {
    fontSize: 13,
    color: '#4e4639',
    marginHorizontal: 4,
  }
});
