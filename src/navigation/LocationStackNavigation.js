/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import LocationDetails from 'src/screens/LocationDetails.js';
import AllReviews from 'src/screens/AllReviews.js';
import NearbyLocations from 'src/screens/NearbyLocations.js';

const Stack = createStackNavigator();

const LocationStackNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="LocationDetails"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="LocationDetails" component={LocationDetails} />
      <Stack.Screen name="AllReviews" component={AllReviews} options={{ headerTitle: 'All Reviews', headerShown: true }} />
      <Stack.Screen
        name="NearbyLocations"
        component={NearbyLocations}
        options={{ headerTitle: 'Nearby Locations', headerShown: true }}
      />
    </Stack.Navigator>
  );
};

export default LocationStackNavigation;
