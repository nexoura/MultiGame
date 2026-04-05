import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PLAYER_CONFIG, PlayerColor } from '../utils/ludoConstants';

interface LudoTokenProps {
  color: PlayerColor;
  size: number;
  active?: boolean;
}

export const LudoToken: React.FC<LudoTokenProps> = ({ color, size, active }) => {
  const config = PLAYER_CONFIG[color];

  return (
    <View style={[styles.tokenContainer, { width: size, height: size }]}>
        <View style={[styles.outerRing, { width: size * 0.85, height: size * 0.85, backgroundColor: config.color }]}>
            {/* Classic white ring inlay */}
            <View style={[styles.innerCircle, { width: size * 0.6, height: size * 0.6 }]} />
            
            {active && <View style={styles.activeIndicator} />}
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tokenContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  outerRing: {
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000000',
  },
  innerCircle: {
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.6)',
    backgroundColor: 'transparent',
    position: 'absolute',
  },
  activeIndicator: {
    position: 'absolute',
    width: '120%',
    height: '120%',
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    opacity: 0.8,
  }
});
