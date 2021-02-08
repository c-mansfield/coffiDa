/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Card, Text } from '@ui-kitten/components';

import RatingCircles from 'src/components/RatingCircles.js';

const LocationWidget = ({ location }) => {

  const reviewCount = location.location_reviews.length;

  return (
    <TouchableOpacity>
      <View style={styles.widgetMain}>
        <View style={styles.imageWrapper}>
          <Image
            style={styles.locationImage}
            source={require('assets/images/reviews_placeholder.jpg')}
          />
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.header}>{location.location_name}</Text>
          <Text style={styles.subHeading}>{location.location_town}</Text>

          <View style={styles.locationRating}>
            <RatingCircles rating={location.avg_overall_rating} />
            <Text style={{ fontSize: 12, marginLeft: 5 }}>({reviewCount})</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  widgetMain : {
    flexDirection: 'row',
    textAlign: 'left',
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderColor: 'rgb(224, 224, 224)',
    borderRadius: 4,
    borderWidth: 1
  },
  locationImage: {
    width: 75,
    height: 75
  },
  textWrapper : {
    alignSelf: 'center',
    marginLeft: 10
  },
  header : {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: '#707070'
  },
  subHeading : {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#707070'
  },
  locationRating: {
    flexDirection: 'row',
    flex: 1,
    marginTop: 5
  }
});

export default LocationWidget;
