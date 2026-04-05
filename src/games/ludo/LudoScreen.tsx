import React from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LUDO_COLORS, LUDO_SHADOWS, PLAYER_CONFIG, LUDO_RADII, PlayerColor } from './utils/ludoConstants';
import { LudoBoard } from './components/LudoBoard';
import { Dice } from './components/Dice';
import { useLudoGame } from './hooks/useLudoGame';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const PlayerCard = ({ color, turn }: { color: PlayerColor; turn: PlayerColor }) => {
    const config = PLAYER_CONFIG[color];
    const isCurrent = turn === color;
    
    return (
        <View style={[
            styles.playerCard, 
            { backgroundColor: LUDO_COLORS.surfaceContainerLowest },
            isCurrent && { borderColor: config.color, borderWidth: 3 }
        ]}>
            <View style={[styles.avatarCircle, { backgroundColor: config.container }]}>
                <Ionicons name="person" size={28} color={config.color} />
            </View>
            <Text style={[styles.cardTitle, { color: LUDO_COLORS.onSurface }]}>
                {isCurrent ? 'Your Turn' : `${color.charAt(0).toUpperCase() + color.slice(1)} Player`}
            </Text>
            {isCurrent && <View style={[styles.activeIndicator, { backgroundColor: config.color }]} />}
        </View>
    );
};

export const LudoScreen = () => {
  const navigation = useNavigation<any>();
  const { 
    tokens, 
    turn, 
    dice, 
    rolling, 
    canMove, 
    winner, 
    rollDice, 
    moveToken 
  } = useLudoGame();

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Top Header - Tactile Joy */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
           <Ionicons name="chevron-back" size={24} color={LUDO_COLORS.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ludo Tactics</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.mainArea}>
        {/* The 2x2 Status Deck (Stitch Official) */}
        <View style={styles.deckGrid}>
            <View style={styles.deckRow}>
                <PlayerCard color="blue" turn={turn} />
                <PlayerCard color="red" turn={turn} />
            </View>
            <View style={styles.deckRow}>
                <PlayerCard color="green" turn={turn} />
                <PlayerCard color="yellow" turn={turn} />
            </View>
        </View>

        {/* The Board Tray */}
        <View style={styles.boardTray}>
          <LudoBoard 
            tokens={tokens} 
            onTokenPress={(color, id) => moveToken(color as any, id)} 
          />
        </View>
      </View>

      {/* Official Foot-HUD */}
      <View style={styles.footer}>
        <View style={styles.diceTray}>
            <Dice 
              value={dice} 
              rolling={rolling} 
              onPress={rollDice} 
              disabled={canMove}
            />
        </View>

        <TouchableOpacity 
          onPress={rollDice}
          disabled={canMove || rolling}
          activeOpacity={0.85}
        >
          <View
            style={[styles.rollButton, { backgroundColor: LUDO_COLORS.primary, opacity: canMove || rolling ? 0.7 : 1 }]}
          >
            <Text style={styles.rollButtonText}>
                {rolling ? 'ROLLING...' : canMove ? `MOVE ${dice}` : 'TAP TO ROLL'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {winner && (
        <View style={styles.winnerOverlay}>
           <View style={styles.winnerCard}>
              <Text style={styles.winnerSubtitle}>TACTICAL VICTORY!</Text>
              <Text style={styles.winnerTitle}>{winner.toUpperCase()} WINS</Text>
              <TouchableOpacity onPress={() => navigation.replace('Ludo')}>
                <View
                    style={[styles.rollButton, { backgroundColor: LUDO_COLORS.primary, width: '100%' }]}
                >
                    <Text style={styles.rollButtonText}>REPLAY</Text>
                </View>
              </TouchableOpacity>
           </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LUDO_COLORS.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: LUDO_COLORS.surfaceContainerLowest,
    justifyContent: 'center',
    alignItems: 'center',
    ...LUDO_SHADOWS.ambient,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: LUDO_COLORS.onSurface,
    letterSpacing: -0.5,
  },
  mainArea: {
    flex: 1,
    paddingHorizontal: 16,
  },
  deckGrid: {
    gap: 12,
    marginBottom: 20,
  },
  deckRow: {
    flexDirection: 'row',
    gap: 12,
  },
  playerCard: {
    flex: 1,
    height: 100,
    borderRadius: LUDO_RADII.lg,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'transparent',
    borderWidth: 0,
    ...LUDO_SHADOWS.ambient,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  boardTray: {
    backgroundColor: LUDO_COLORS.surfaceContainerLowest,
    padding: 12,
    borderRadius: LUDO_RADII.xl,
    alignSelf: 'center',
    ...LUDO_SHADOWS.ambient,
  },
  footer: {
    paddingBottom: 30,
    paddingTop: 10,
    alignItems: 'center',
    gap: 20,
  },
  diceTray: {
    backgroundColor: LUDO_COLORS.surfaceContainerLow,
    padding: 16,
    borderRadius: LUDO_RADII.lg,
    ...LUDO_SHADOWS.ambient,
  },
  rollButton: {
    width: width * 0.85,
    height: 68,
    borderRadius: LUDO_RADII.xl,
    justifyContent: 'center',
    alignItems: 'center',
    ...LUDO_SHADOWS.ambient,
  },
  rollButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  winnerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(58, 45, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  winnerCard: {
    width: '85%',
    backgroundColor: LUDO_COLORS.surface,
    borderRadius: LUDO_RADII.xl,
    padding: 40,
    alignItems: 'center',
    ...LUDO_SHADOWS.ambient,
  },
  winnerSubtitle: {
    fontSize: 14,
    fontWeight: '900',
    color: LUDO_COLORS.outline,
    marginBottom: 8,
    letterSpacing: 2,
  },
  winnerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: LUDO_COLORS.onSurface,
    marginBottom: 30,
    textAlign: 'center',
  }
});
