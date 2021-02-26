/**
 * @format
 * @flow strict-local
*/

import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
  TabBar, Tab, Icon, Text, Layout,
} from '@ui-kitten/components';

import YourFavourites from 'src/screens/YourFavourites.js';
import YourLikes from 'src/screens/YourLikes.js';
import YourReviews from 'src/screens/YourReviews.js';

const TabNavigation = createMaterialTopTabNavigator();

export const ReviewsTabNavigation = () => {
  return (
    <>
      <Layout style={{ flex: 1 }} level="1">
        <ReviewsTabNavigationMain />
      </Layout>
    </>
  );
};

const ReviewsTabNavigationMain = () => {
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
    style={{ flexGrow: 1 }}
  >
    <Tab
      icon={ClipBoardIcon}
      title={<Text category="c1">Reviews</Text>}
    />
    <Tab
      icon={HeartIcon}
      title="Likes"
    />
    <Tab
      icon={StarIcon}
      title="Favourites"
    />
  </TabBar>
);

const ClipBoardIcon = (props) => (
  <Icon {...props} name="clipboard" />
);

const HeartIcon = (props) => (
  <Icon {...props} name="heart" />
);

const StarIcon = (props) => (
  <Icon {...props} name="star" />
);

export default ReviewsTabNavigation;
