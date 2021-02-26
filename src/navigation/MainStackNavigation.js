/**
 * @format
 * @flow strict-local
*/

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Entry from 'src/screens/Entry.js';
import NavigationService from 'src/services/NavigationService';
import BottomTabNavigation from './BottomTabNavigation.js';

const Stack = createStackNavigator();

const MainStackNavigation = () => {
  return (
    <NavigationContainer
      ref={(navigationRef) => NavigationService.setContainer(navigationRef)}
    >
      <Stack.Navigator
        initialRouteName="Entry"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Entry" component={Entry} />
        <Stack.Screen name="BottomTabNavigation" component={BottomTabNavigation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainStackNavigation;
