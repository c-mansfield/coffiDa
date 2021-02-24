/**
 * @format
 * @flow strict-local
*/

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Entry from 'src/screens/Entry.js';
import NavigationService from 'src/services/NavigationService';
import BottomTabNavigation from './BottomTabNavigation.js';

const Stack = createStackNavigator();

const MainStackNavigation = () => {
  const [userToken, setUserToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // let asyncToken;
      // asyncToken = await AsyncStorage.getItem('@token');
      // // if (asyncToken) {
      // };
      // setUserToken(asyncToken);
      setIsLoading(false);
    };

    fetchData();
  }, []);

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
