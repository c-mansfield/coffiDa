/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ReviewsTabNavigation from 'src/navigation/ReviewsTabNavigation.js';
import ViewReview from 'src/screens/ViewReview.js';
import EditReview from 'src/screens/EditReview.js';

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
      <Stack.Screen name="ViewReview" component={ViewReview} />
      <Stack.Screen name="EditReview" component={EditReview} />
    </Stack.Navigator>
  );
};

export default ReviewStackNavigation;
