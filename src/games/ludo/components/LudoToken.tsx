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
        <View style={[
            styles.outerRing, 
            { 
                width: size * 0.9, 
                height: size * 0.9, 
                backgroundColor: config.color,
                borderColor: '#000',
                borderWidth: 2,
            }
        ]}>
            {/* Minimal white highlight for 3D effect matching the "flat but classic" look */}
            <View style={[styles.innerCircle, { width: size * 0.4, height: size * 0.4 }]} />
            
            {active && <View style={[styles.activeIndicator, { width: size * 1.1, height: size * 1.1 }]} />}
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
  },
  innerCircle: {
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.3)',
    position: 'absolute',
    top: '15%',
    left: '15%',
  },
  activeIndicator: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#FFF',
    opacity: 0.6,
  }
});
