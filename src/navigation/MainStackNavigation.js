/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect, createContext, useMemo } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Login from 'src/screens/Login.js';
import Register from 'src/screens/Register.js';
import BottomTabNavigation from './BottomTabNavigation.js';

const Stack = createStackNavigator();

const MainStackNavigation = () => {

  const [userToken, setUserToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      let asyncToken;

      asyncToken = await AsyncStorage.getItem('@token');

      if (asyncToken) {

      };

      setUserToken(asyncToken);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="BottomTabNavigation" component={BottomTabNavigation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({

});

export default MainStackNavigation;
