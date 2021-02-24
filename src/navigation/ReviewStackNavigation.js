/**
 * @format
 * @flow strict-local
*/

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ReviewsTabNavigation from 'src/navigation/ReviewsTabNavigation.js';
import ViewReview from 'src/screens/ViewReview.js';
import EditReview from 'src/screens/EditReview.js';
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
      <Stack.Screen
        name="View Review"
        component={ViewReview}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen name="Edit Review" component={EditReview} options={{ headerShown: true }} />
      <Stack.Screen name="LocationStackNavigation" component={LocationStackNavigation} />
    </Stack.Navigator>
  );
};

export default ReviewStackNavigation;
