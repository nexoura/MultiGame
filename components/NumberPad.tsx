import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface NumberPadProps {
  onNumberPress: (num: number) => void;
  onActionPress: (action: 'undo' | 'hint' | 'erase' | 'pencil' | 'fastPencil') => void;
  numberCounts: Record<number, number>;
  pencilMode: boolean;
  hintsLeft: number;
}

export const NumberPad: React.FC<NumberPadProps> = ({ onNumberPress, onActionPress, numberCounts, pencilMode, hintsLeft }) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  // Scale number font size based on screen width
  const numFontSize   = isTablet ? 28 : 20;
  const countFontSize = isTablet ? 12 : 10;
  const iconSize      = isTablet ? 26 : 22;
  const labelFontSize = isTablet ? 12 : 10;

  return (
    <View style={styles.container}>
      {/* Number Buttons */}
      <View style={styles.numbersRow}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <TouchableOpacity
            key={num}
            style={[styles.numberButton, isTablet && styles.numberButtonTablet]}
            onPress={() => onNumberPress(num)}
            activeOpacity={0.7}
          >
            <Text style={[styles.numberText, { fontSize: numFontSize }]}>{num}</Text>
            <Text style={[styles.countText, { fontSize: countFontSize }]}>{numberCounts[num] ?? 0}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        <ActionButton icon="arrow-undo-outline" label="Undo"    onPress={() => onActionPress('undo')}   iconSize={iconSize} labelSize={labelFontSize} isTablet={isTablet} />
        <ActionButton icon="trash-outline"       label="Erase"   onPress={() => onActionPress('erase')}  iconSize={iconSize} labelSize={labelFontSize} isTablet={isTablet} />
        <ActionButton icon="flash-outline"       label="Auto"    onPress={() => onActionPress('fastPencil')} iconSize={iconSize} labelSize={labelFontSize} isTablet={isTablet} />
        <ActionButton icon="pencil-outline"      label="Notes"   onPress={() => onActionPress('pencil')} active={pencilMode} iconSize={iconSize} labelSize={labelFontSize} isTablet={isTablet} />
        <ActionButton
          icon={hintsLeft > 0 ? 'bulb-outline' : 'play-circle-outline'}
          label={hintsLeft > 0 ? `Hint (${hintsLeft})` : 'Watch Ad'}
          onPress={() => onActionPress('hint')}
          badge={hintsLeft}
          iconSize={iconSize}
          labelSize={labelFontSize}
          isTablet={isTablet}
        />
      </View>
    </View>
  );
};

const ActionButton = ({
  icon, label, onPress, active, badge, iconSize, labelSize, isTablet
}: {
  icon: any; label: string; onPress: () => void;
  active?: boolean; badge?: number;
  iconSize: number; labelSize: number; isTablet: boolean;
}) => (
  <TouchableOpacity
    style={[styles.actionBtn, active && styles.actionBtnActive, isTablet && styles.actionBtnTablet]}
    onPress={onPress}
    activeOpacity={0.75}
  >
    <View style={{ position: 'relative' }}>
      <Ionicons name={icon} size={iconSize} color={active ? '#FFFFFF' : Colors.sudoku.primary} />
      {badge !== undefined && badge > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
    </View>
    <Text style={[styles.actionLabel, active && styles.actionLabelActive, { fontSize: labelSize }]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 12,
    gap: 10,
  },
  numbersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  numberButton: {
    flex: 1,
    aspectRatio: 0.7,
    backgroundColor: Colors.sudoku.cardBg,
    borderRadius: 12,
    marginHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  numberButtonTablet: {
    aspectRatio: 0.8,
    borderRadius: 16,
    marginHorizontal: 4,
  },
  numberText: {
    fontWeight: '800',
    color: Colors.sudoku.primary,
  },
  countText: {
    fontWeight: '600',
    color: Colors.sudoku.textSecondary,
    marginTop: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.sudoku.cardBg,
    marginHorizontal: 3,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  actionBtnTablet: {
    paddingVertical: 14,
    borderRadius: 16,
  },
  actionBtnActive: {
    backgroundColor: Colors.sudoku.primary,
  },
  actionLabel: {
    fontWeight: '600',
    color: Colors.sudoku.textSecondary,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  actionLabelActive: {
    color: '#FFFFFF',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -8,
    backgroundColor: Colors.sudoku.error,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});
