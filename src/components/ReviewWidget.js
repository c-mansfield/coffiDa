/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Card, Text } from '@ui-kitten/components';

import RatingCircles from 'src/components/RatingCircles.js';

const ReviewWidget = ({ review, location, myReview }) => {

  return (
    <TouchableOpacity>
      <View style={styles.widgetMain}>
        <View style={styles.textWrapper}>
          <Text style={styles.header} numberOfLines={1}>"{review.review_body}"</Text>
          {
            myReview ? <Text style={styles.subHeading}>{location.location_name}, {location.location_town}</Text>
            : null
          }
          <RatingCircles rating={review.overall_rating} />

          <View style={styles.likesSection}>
            <Image
              style={styles.likesImage}
              source={require('assets/images/thumbs_up.png')}
            />
            <Text style={styles.likesText}>{review.likes}</Text>
          </View>
        </View>
        <View style={styles.imageWrapper}>
          <Image
            style={styles.reviewImage}
            source={require('assets/images/reviews_placeholder.jpg')}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  widgetMain : {
    marginTop: 5,
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderColor: 'rgb(224, 224, 224)',
    borderWidth: 1,
    borderRadius: 4
  },
  textWrapper : {
    flex: 3,
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
  likesSection : {
    flexDirection: 'row',
  },
  likesImage : {
    width: 15,
    height: 15
  },
  likesText : {
    fontSize: 10,
    fontFamily: 'Nunito-Regular',
  },
  imageWrapper: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    flex: 1
  },
  reviewImage: {
    width: 75,
    height: 75,
    borderRadius: 75 / 2
  }
});

export default ReviewWidget;
