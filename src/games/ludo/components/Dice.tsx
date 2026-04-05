import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { LUDO_COLORS } from '../utils/ludoConstants';

interface DiceProps {
  value: number;
  rolling: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export const Dice: React.FC<DiceProps> = ({ value, rolling, onPress, disabled }) => {
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (rolling) {
      Animated.loop(
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
        ])
      ).start();
    } else {
      shakeAnim.stopAnimation();
      shakeAnim.setValue(0);
      Animated.spring(scaleAnim, { toValue: 1.1, friction: 3, useNativeDriver: true }).start(() => {
          Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }).start();
      });
    }
  }, [rolling]);

  const renderDots = (val: number) => {
    const dotsPositions = {
        1: [4],
        2: [0, 8],
        3: [0, 4, 8],
        4: [0, 2, 6, 8],
        5: [0, 2, 4, 6, 8],
        6: [0, 3, 6, 2, 5, 8],
    };

    const activeDots = (dotsPositions as any)[val] || [];

    return (
        <View style={styles.diceFace}>
            {Array.from({ length: 9 }).map((_, i) => (
                <View key={i} style={styles.dotContainer}>
                    {activeDots.includes(i) && <View style={styles.dot} />}
                </View>
            ))}
        </View>
    );
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.7} 
      onPressIn={() => {
        Animated.spring(scaleAnim, { toValue: 0.92, useNativeDriver: true }).start();
      }}
      onPressOut={() => {
        Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }).start();
      }}
      onPress={onPress} 
      disabled={disabled || rolling}
      style={styles.diceContainer}
    >
        <Animated.View style={[
            styles.dice,
            { 
               transform: [
                   { translateX: shakeAnim },
                   { scale: scaleAnim },
                   { rotate: shakeAnim.interpolate({
                       inputRange: [-10, 10],
                       outputRange: ['-10deg', '10deg']
                   })}
               ]
            }
        ]}>
            {renderDots(rolling ? Math.floor(Math.random() * 6) + 1 : value)}
        </Animated.View>
        <Text style={styles.diceLabel}>{rolling ? 'ROLLING...' : 'TAP TO ROLL'}</Text>
    </TouchableOpacity>
  );
};

import { LUDO_RADII, LUDO_SHADOWS } from '../utils/ludoConstants';

const styles = StyleSheet.create({
  diceContainer: {
    alignItems: 'center',
    gap: 12,
  },
  dice: {
    width: 72,
    height: 72,
    backgroundColor: '#FFFFFF',
    borderRadius: LUDO_RADII.lg,
    ...LUDO_SHADOWS.ambient,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  diceFace: {
    width: 48,
    height: 48,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dotContainer: {
    width: '33.3%',
    height: '33.3%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: LUDO_COLORS.onSurface,
  },
  diceLabel: {
      fontSize: 12,
      fontWeight: '800',
      color: LUDO_COLORS.onSurface,
      letterSpacing: 1.5,
  }
});
