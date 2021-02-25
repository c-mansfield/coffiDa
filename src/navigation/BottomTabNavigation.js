/**
 * @format
 * @flow strict-local
*/

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon, BottomNavigation, BottomNavigationTab } from '@ui-kitten/components';

import SearchStackNavigation from 'src/navigation/SearchStackNavigation.js';
import HomeStackNavigation from 'src/navigation/HomeStackNavigation.js';
import Account from 'src/screens/Account.js';
import ReviewStackNavigation from 'src/navigation/ReviewStackNavigation.js';
import AddReview from 'src/screens/AddReview.js';
import AddReviewButton from 'src/components/TabBarAddReview.js';

const Tab = createBottomTabNavigator();

const BottomTabNavigation = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        keyboardHidesTabBar: true,
        activeTintColor: '#247BA0',
        inactiveTintColor: '#50514F',
      }}
      tabBar={(props) => <BottomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeStackNavigation} />
      <Tab.Screen name="Search" component={SearchStackNavigation} />
      <Tab.Screen
        name="AddReview"
        component={AddReview}
      />
      <Tab.Screen name="Reviews" component={ReviewStackNavigation} />
      <Tab.Screen name="Account" component={Account} />
    </Tab.Navigator>
  );
};

const BottomTabBar = ({ navigation, state }) => (
  <BottomNavigation
    style={{
      shadowRadius: 10,
      shadowOffset: {
        width: 0,
        height: -10,
      },
      shadowColor: '#808080',
      elevation: 10,
    }}
    appearance="noIndicator"
    selectedIndex={state.index}
    onSelect={(index) => navigation.navigate(state.routeNames[index])}
  >
    <BottomNavigationTab title="Home" icon={HomeIcon} />
    <BottomNavigationTab title="Search" icon={SearchIcon} />
    <AddReviewButton />
    <BottomNavigationTab title="Reviews" icon={ReviewsIcon} />
    <BottomNavigationTab title="Account" icon={AccountIcon} />
  </BottomNavigation>
);

const HomeIcon = (props) => (
  <Icon {...props} name="home" />
);

const SearchIcon = (props) => (
  <Icon {...props} name="search" />
);

const ReviewsIcon = (props) => (
  <Icon {...props} name="clipboard" />
);

const AccountIcon = (props) => (
  <Icon {...props} name="person" />
);

export default BottomTabNavigation;
