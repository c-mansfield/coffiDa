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

import SearchResults from 'src/screens/SearchResults.js';
import Search from 'src/screens/Search.js';

const Stack = createStackNavigator();

const SearchStackNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="Search"
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="SearchResults" component={SearchResults} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({

});

export default SearchStackNavigation;
