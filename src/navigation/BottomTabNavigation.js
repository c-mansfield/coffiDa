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
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from 'src/screens/Home.js';
import SearchStackNavigation from 'src/navigation/SearchStackNavigation.js';
import Reviews from 'src/screens/Reviews.js';
import Settings from 'src/screens/Settings.js';
import AddReview from 'src/screens/AddReview.js';
import AddReviewButton from 'src/components/TabBarAddReview.js'

const Tab = createBottomTabNavigator();

const BottomTabNavigation = (props) => {
  
  return (
      <Tab.Navigator>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Search" component={SearchStackNavigation} />
        <Tab.Screen name="AddReview" component={AddReview} options={{
          tabBarButton: () => (<AddReviewButton/>),
        }}/>
        <Tab.Screen name="Reviews" component={Reviews} />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>
  );
}


const styles = StyleSheet.create({
});

export default BottomTabNavigation;
