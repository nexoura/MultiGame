import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LUDO_COLORS, PLAYER_CONFIG, PlayerColor, LUDO_SHADOWS, LUDO_RADII } from '../utils/ludoConstants';
import { Ionicons } from '@expo/vector-icons';

interface PlayerInfoProps {
  color: PlayerColor;
  active: boolean;
  name: string;
}

export const PlayerInfo: React.FC<PlayerInfoProps> = ({ color, active, name }) => {
  const config = PLAYER_CONFIG[color];

  return (
    <View style={[
      styles.container, 
      active && { backgroundColor: config.color + '20', borderColor: config.color }
    ]}>
        <View style={[styles.avatar, { backgroundColor: config.color }]}>
            <Ionicons name="person" size={20} color="#FFFFFF" />
            {active && (
                <View style={[styles.activeIndicator, { backgroundColor: config.accent || '#4ADE80' }]} />
            )}
        </View>
        <View style={styles.textContainer}>
            <Text style={[styles.name, { color: active ? config.color : LUDO_COLORS.onSurface }]}>{name}</Text>
            <Text style={styles.status}>{active ? 'YOUR TURN' : 'WAITING...'}</Text>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: LUDO_RADII.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: LUDO_COLORS.glass,
    gap: 12,
    minWidth: 140,
    ...LUDO_SHADOWS.ambient,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    elevation: 4,
  },
  activeIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
  },
  textContainer: {
    gap: 2,
  },
  name: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  status: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(58, 45, 0, 0.4)',
    letterSpacing: 1.2,
  }
});
