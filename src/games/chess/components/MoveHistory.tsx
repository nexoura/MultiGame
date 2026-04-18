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
      <Text style={styles.title}>Move History</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {pairs.map((pair, idx) => (
          <View key={`move-${idx}`} style={styles.movePair}>
            <Text style={styles.moveNum}>{pair.num}.</Text>
            <Text style={styles.moveText}>{formatMove(pair.white)}</Text>
            {pair.black && (
              <Text style={styles.moveText}>{formatMove(pair.black)}</Text>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  scrollContent: {
    flexDirection: 'row',
  },
  movePair: {
    flexDirection: 'row',
    marginRight: 15,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: 'center',
  },
  moveNum: {
    fontSize: 12,
    color: '#94A3B8',
    marginRight: 4,
    fontWeight: '600',
  },
  moveText: {
    fontSize: 14,
    color: '#1E293B',
    marginHorizontal: 4,
    fontWeight: '500',
  }
});
