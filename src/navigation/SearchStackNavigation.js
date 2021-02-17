/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SearchResults from 'src/screens/SearchResults.js';
import Search from 'src/screens/Search.js';
import LocationDetails from 'src/screens/LocationDetails.js';

const Stack = createStackNavigator();

const SearchStackNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="Search"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="SearchResults" component={SearchResults} />
      <Stack.Screen name="LocationDetailsSearch" component={LocationDetails} />
    </Stack.Navigator>
  );
};

export default SearchStackNavigation;
