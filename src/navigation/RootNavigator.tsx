import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import GameHubScreen from '../screens/GameHubScreen';
import ExploreScreen from '../screens/ExploreScreen';
import ModalScreen from '../screens/ModalScreen';
import { SudokuScreen } from '../games/sudoku/SudokuScreen';
import { LudoScreen } from '../games/ludo/LudoScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="index"
        component={GameHubScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tab.Screen
        name="explore"
        component={ExploreScreen}
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Sudoku" 
        component={SudokuScreen} 
        options={{ title: 'Sudoku' }}
      />
      <Stack.Screen 
        name="Ludo" 
        component={LudoScreen} 
        options={{ title: 'Ludo Tactics' }}
      />
      <Stack.Screen
        name="modal"
        component={ModalScreen}
        options={{ presentation: 'modal', title: 'Info' }}
      />
    </Stack.Navigator>
  );
}
