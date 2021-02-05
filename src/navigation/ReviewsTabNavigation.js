/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import YourReviews from 'src/screens/YourReviews.js';
import YourFavourites from 'src/screens/YourFavourites.js';
import YourLikes from 'src/screens/YourLikes.js';

const Tab = createMaterialTopTabNavigator();

const ReviewsTabNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="Reviews"
      screenOptions={{
        headerShown: false
      }}
    >
      <Tab.Screen name="Reviews" component={YourReviews} />
      <Tab.Screen name="Likes" component={YourLikes} />
      <Tab.Screen name="Favourites" component={YourFavourites} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
});

export default ReviewsTabNavigation;
