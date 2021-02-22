/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import LocationStackNavigation from 'src/navigation/LocationStackNavigation.js';
import Home from 'src/screens/Home.js';
import AllReviews from 'src/screens/AllReviews.js';
import NearbyLocations from 'src/screens/NearbyLocations.js';

const Stack = createStackNavigator();

const HomeStackNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="LocationStackNavigation" component={LocationStackNavigation} />
    </Stack.Navigator>
  );
};

export default HomeStackNavigation;
