/**
 * @format
 * @flow strict-local
*/

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ReviewsTabNavigation from 'src/navigation/ReviewsTabNavigation.js';
import ReviewViewStackNavigation from 'src/navigation/ReviewViewStackNavigation.js';
import LocationStackNavigation from 'src/navigation/LocationStackNavigation.js';

const Stack = createStackNavigator();

const ReviewStackNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="ReviewsTabNavigation"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ReviewsTabNavigation" component={ReviewsTabNavigation} />
      <Stack.Screen name="ReviewViewStackNavigation" component={ReviewViewStackNavigation} />
      <Stack.Screen name="LocationStackReviews" component={LocationStackNavigation} />
    </Stack.Navigator>
  );
};

export default ReviewStackNavigation;
