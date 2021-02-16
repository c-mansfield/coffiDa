/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '@ui-kitten/components';

import SearchStackNavigation from 'src/navigation/SearchStackNavigation.js';
import HomeStackNavigation from 'src/navigation/HomeStackNavigation.js';
import Account from 'src/screens/Account.js';
import Reviews from 'src/screens/Reviews.js';
import AddReview from 'src/screens/AddReview.js';
import AddReviewButton from 'src/components/TabBarAddReview.js'

const Tab = createBottomTabNavigator();

const BottomTabNavigation = (props) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Reviews') {
            iconName = focused ? 'search-outline' : 'search';
          } else if (route.name === 'Account') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Icon style={{ height: size, width: size }} fill={color} name={iconName} />;
        },
      })}
      tabBarOptions={{
        keyboardHidesTabBar: true,
        activeTintColor: '#247BA0',
        inactiveTintColor: '#50514F',
      }}
    >
      <Tab.Screen name="Home" component={HomeStackNavigation} />
      <Tab.Screen name="Search" component={SearchStackNavigation} />
      <Tab.Screen
        name="AddReview"
        component={AddReview}
        options={{
          tabBarButton: () => (<AddReviewButton />),
        }}
      />
      <Tab.Screen name="Reviews" component={Reviews} />
      <Tab.Screen name="Account" component={Account} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;
