/**
 * @format
 * @flow strict-local
*/

import React from 'react';
import { View, StyleSheet } from 'react-native';

const RatingCircles = ({ rating }) => {
  let ratingTotal = rating;

  const innerCircleStyle = () => {
    if (ratingTotal >= 1) {
      ratingTotal -= 1;

      return fullCircle();
    }

    if (ratingTotal >= 0.2 && ratingTotal <= 0.8) {
      ratingTotal -= ratingTotal;

      return halfCircle();
    }

    return null;
  };

  const fullCircle = () => {
    return {
      width: 8,
      height: 8,
      borderWidth: 0,
      borderRadius: 14,
      backgroundColor: '#C3B299',
      justifyContent: 'center',
      alignItems: 'center',
    };
  };

  const halfCircle = () => {
    return {
      width: 4,
      height: 8,
      borderWidth: 0,
      borderRadius: 14,
      backgroundColor: '#C3B299',
      justifyContent: 'center',
      alignItems: 'center',
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    };
  };

  return (
    <View style={styles.main}>
      <View style={styles.circle}>
        <View style={innerCircleStyle()} />
      </View>
      <View style={styles.circle}>
        <View style={innerCircleStyle()} />
      </View>
      <View style={styles.circle}>
        <View style={innerCircleStyle()} />
      </View>
      <View style={styles.circle}>
        <View style={innerCircleStyle()} />
      </View>
      <View style={styles.circle}>
        <View style={innerCircleStyle()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
  },
  circle: {
    width: 20,
    height: 20,
    borderWidth: 2.5,
    borderRadius: 100,
    borderColor: '#247BA0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 2,
    backgroundColor: '#FFFFFF',
  },
});

export default RatingCircles;
