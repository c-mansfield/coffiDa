/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LocationDetails from 'src/screens/LocationDetails.js';
import Home from 'src/screens/Home.js';

const Stack = createStackNavigator();

const HomeStackNavigation = () => {

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="LocationDetails" component={LocationDetails} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({

});

export default HomeStackNavigation;
