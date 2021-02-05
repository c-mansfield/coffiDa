/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import ReviewsTabNavigation from 'src/navigation/ReviewsTabNavigation.js';

const Reviews = () => {
  return (
    <ReviewsTabNavigation />
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 36,
    fontFamily: 'Nunito-Bold',
    padding: 15
  },
});

export default Reviews;

// <View>
//   <Text style={styles.title}>Your Reviews</Text>
//   <ReviewsTabNavigation />
// </View>
