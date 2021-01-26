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
import Search from 'src/screens/Search.js';
import Reviews from 'src/screens/Reviews.js';
import Settings from 'src/screens/Settings.js';
import AddReview from 'src/screens/AddReview.js';

const Tab = createBottomTabNavigator();

const BottomTabNavigation = () => {
  return (
      <Tab.Navigator>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Search" component={Search} />
        <Tab.Screen name="AddReview" component={AddReview} options={{
          tabBarButton: (navigation) => (<AddReviewButton navigation={navigation}/>),
        }}/>
        <Tab.Screen name="Reviews" component={Reviews} />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>
  );
}

const AddReviewButton = ({ navigation }) => {

  return (
    <TouchableOpacity
      style={styles.addReviewStyle}
      onPress={() => navigation.navigate('AddReview')}>
      <Text style={styles.addReviewTextStyle}>+</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  addReviewStyle: {
    height: 90,
    width: 90,
    backgroundColor: '#964B00',
    borderRadius: 100
  },
  addReviewTextStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    flex:1
  }
});

export default BottomTabNavigation;
