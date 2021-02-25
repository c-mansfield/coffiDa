/**
 * @format
 * @flow strict-local
*/

import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
  TabBar, Tab, Icon,
} from '@ui-kitten/components';

import YourFavourites from 'src/screens/YourFavourites.js';
import YourLikes from 'src/screens/YourLikes.js';
import YourReviews from 'src/screens/YourReviews.js';

const TabNavigation = createMaterialTopTabNavigator();

const ReviewsTabNavigation = () => {
  return (
    <TabNavigation.Navigator
      initialRouteName="Reviews"
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <TopTabBar {...props} />}
    >
      <TabNavigation.Screen name="Reviews" component={YourReviews} />
      <TabNavigation.Screen name="Likes" component={YourLikes} />
      <TabNavigation.Screen name="Favourites" component={YourFavourites} />
    </TabNavigation.Navigator>
  );
};

const TopTabBar = ({ navigation, state }) => (
  <TabBar
    selectedIndex={state.index}
    onSelect={(index) => navigation.navigate(state.routeNames[index])}
  >
    <Tab title="Reviews" icon={ClipBoardIcon} />
    <Tab title="Likes" icon={HeartIcon} />
    <Tab title="Favourites" icon={StarIcon} />
  </TabBar>
);

const ClipBoardIcon = (props) => (
  <Icon {...props} name="clipboard-outline" />
);

const HeartIcon = (props) => (
  <Icon {...props} name="heart-outline" />
);

const StarIcon = (props) => (
  <Icon {...props} name="star-outline" />
);

export default ReviewsTabNavigation;
