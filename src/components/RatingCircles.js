import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import { Tile } from 'react-native-elements';

const RatingCircles = ({ rating }) => {
  const innerCircleStyle = () => {
    if (rating >= 1) {
      rating -= 1;

      return {
        width: 8,
        height: 8,
        borderWidth: 0,
        borderRadius: 14,
        backgroundColor: '#C3B299',
        justifyContent: 'center',
        alignItems: 'center'
      };
    } if (rating >= 0.2 && rating <= 0.8) {
      rating -= rating;

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
    }
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
