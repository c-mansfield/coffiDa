/**
 * @format
 * @flow strict-local
*/

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SearchResults from 'src/screens/SearchResults.js';
import Search from 'src/screens/Search.js';
import LocationStackNavigation from 'src/navigation/LocationStackNavigation.js';

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
      <Stack.Screen name="LocationStackNavigationSearch" component={LocationStackNavigation} />
    </Stack.Navigator>
  );
};

export default SearchStackNavigation;
