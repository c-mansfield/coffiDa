/**
 * @format
 * @flow strict-local
*/

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ViewReview from 'src/screens/ViewReview.js';
import EditReview from 'src/screens/EditReview.js';

const Stack = createStackNavigator();

const ReviewViewStackNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="ViewReview"
    >
      <Stack.Screen name="ViewReview" component={ViewReview} options={{ headerTitle: 'View Review' }} />
      <Stack.Screen
        name="EditReviewScreen"
        component={EditReview}
        options={{ headerTitle: 'Edit Review' }}
      />
    </Stack.Navigator>
  );
};

export default ReviewViewStackNavigation;
