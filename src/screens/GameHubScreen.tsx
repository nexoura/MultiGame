import { GameCard } from '@/components/GameCard';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';

export default function GameHubScreen() {
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          isTablet && { paddingHorizontal: (width - 600) / 2 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.welcome}>Welcome back,</Text>
            <Text style={styles.title}>What's your move?</Text>
          </View>
          <TouchableOpacity style={styles.profileBtn}>
             <IconSymbol name="person.crop.circle.fill" size={32} color={Colors.sudoku.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.featuredContainer}>
            <View style={[styles.featuredCard, { backgroundColor: Colors.sudoku.primary }]}>
                <View style={styles.featuredText}>
                    <Text style={styles.featuredTitle}>Daily Challenge</Text>
                    <Text style={styles.featuredSubtitle}>Sudoku Hard • 1500 XP</Text>
                    <TouchableOpacity 
                        style={styles.playNowBtn}
                        onPress={() => navigation.navigate('Sudoku')}
                    >
                        <Text style={styles.playNowText}>Play Now</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.featuredIcon}>
                    <IconSymbol name="puzzlepiece.fill" size={60} color="rgba(255,255,255,0.3)" />
                </View>
            </View>
        </View>

        <Text style={styles.sectionTitle}>Available Games</Text>
        
        <GameCard 
          title="Sudoku"
          description="Classic number puzzle. Train your brain with levels from Easy to Expert."
          icon="grid.fill"
          color={Colors.sudoku.primary}
          onPress={() => navigation.navigate('Sudoku')}
          tag="Classic"
        />

        <GameCard 
          title="Ludo Tactics"
          description="Tactile joy with 3D tokens and board-game parchment surfaces. Play with friends or AI."
          icon="dice.fill"
          color="#0c50d4"
          onPress={() => navigation.navigate('Ludo')}
          tag="Premium"
        />

        <GameCard 
          title="Chess"
          description="Master the game of kings. Strategy and skill combined."
          icon="checkerboard.rectangle"
          color="#1E293B"
          onPress={() => {}}
          tag="Soon"
        />

        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  welcome: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 4,
  },
  profileBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featuredContainer: {
      marginBottom: 30,
  },
  featuredCard: {
      height: 160,
      borderRadius: 24,
      padding: 24,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
  },
  featuredText: {
      flex: 1,
  },
  featuredTitle: {
      fontSize: 22,
      fontWeight: '800',
      color: '#FFFFFF',
  },
  featuredSubtitle: {
      fontSize: 14,
      color: 'rgba(255,255,255,0.8)',
      marginTop: 4,
  },
  playNowBtn: {
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 12,
      marginTop: 20,
      alignSelf: 'flex-start',
  },
  playNowText: {
      color: Colors.sudoku.primary,
      fontWeight: '700',
  },
  featuredIcon: {
      marginLeft: 10,
  },
  sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#1E293B',
      marginBottom: 16,
      marginTop: 10,
  },
  spacer: {
      height: 60,
  }
});
