import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface GameCardProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  onPress: () => void;
  tag?: string;
}

export function GameCard({ title, description, icon, color, onPress, tag }: GameCardProps) {
  const scale = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.card}
      >
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <IconSymbol name={icon as any} size={32} color={color} />
        </View>
        <View style={styles.textContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            {tag && (
              <View style={[styles.tag, { backgroundColor: color }]}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            )}
          </View>
          <Text style={styles.description}>{description}</Text>
        </View>
        <IconSymbol name="chevron.right" size={20} color="#CBD5E1" />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
    marginRight: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  tag: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 18,
  },
});
