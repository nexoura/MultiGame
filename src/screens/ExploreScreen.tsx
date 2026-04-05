import * as React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { Colors } from '@/constants/theme';

const tips = [
  { emoji: '🔍', title: 'Scan Rows & Columns', body: 'For each empty cell, check what numbers already exist in its row, column, and 3×3 box.' },
  { emoji: '✏️', title: 'Use Pencil Mode', body: 'Tap the pencil icon to jot candidate numbers in small text inside a cell without committing.' },
  { emoji: '⬛', title: 'Single Candidate', body: 'If only one number can go in a cell after eliminating all conflicts, place it immediately.' },
  { emoji: '🔢', title: 'Naked Pairs', body: 'If two cells in a row/column share the same two candidates, those numbers can be removed from other cells in that unit.' },
  { emoji: '💡', title: 'Use Hints Wisely', body: 'You get one free hint per day. Earn more by watching a short video ad.' },
  { emoji: '↩️', title: 'Undo Mistakes', body: 'Made an error? Tap the undo button to revert your last move without counting it as a mistake.' },
];

const rules = [
  'Each row must contain the numbers 1–9, with no repeats.',
  'Each column must contain the numbers 1–9, with no repeats.',
  'Each of the nine 3×3 boxes must contain the numbers 1–9, with no repeats.',
];

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}>🧩</Text>
          <Text style={styles.title}>How to Play</Text>
          <Text style={styles.subtitle}>Sudoku tips, tricks & rules</Text>
        </View>

        {/* Rules */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>The Rules</Text>
          {rules.map((rule, i) => (
            <View key={i} style={styles.ruleRow}>
              <View style={styles.ruleDot} />
              <Text style={styles.ruleText}>{rule}</Text>
            </View>
          ))}
        </View>

        {/* Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Solving Tips</Text>
          {tips.map((tip, i) => (
            <View key={i} style={styles.tipCard}>
              <Text style={styles.tipEmoji}>{tip.emoji}</Text>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipBody}>{tip.body}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.footer}>Good luck — and have fun! 🎉</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.sudoku.background,
  },
  root: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    alignItems: 'center',
    marginBottom: 28,
    paddingTop: 12,
  },
  emoji: {
    fontSize: 52,
    marginBottom: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: Colors.sudoku.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.sudoku.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },

  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.sudoku.text,
    marginBottom: 12,
    letterSpacing: -0.3,
  },

  /* Rules */
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  ruleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.sudoku.primary,
    marginTop: 6,
  },
  ruleText: {
    flex: 1,
    fontSize: 15,
    color: Colors.sudoku.text,
    lineHeight: 22,
  },

  /* Tip cards */
  tipCard: {
    flexDirection: 'row',
    backgroundColor: Colors.sudoku.cardBg,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  tipEmoji: {
    fontSize: 26,
    width: 36,
    textAlign: 'center',
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.sudoku.text,
    marginBottom: 3,
  },
  tipBody: {
    fontSize: 13,
    color: Colors.sudoku.textSecondary,
    lineHeight: 19,
  },

  footer: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 14,
    color: Colors.sudoku.textSecondary,
    fontWeight: '500',
  },
});
