/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Card, Text } from '@ui-kitten/components';

const ReviewWidget = ({ review }) => {

  useEffect(() => {
    console.log(review.location.location_name);
  }, []);

  return (
    <Card style={styles.widgetMain}>
      <View style={styles.textWrapper}>
        <Text style={styles.header}>"{review.review.review_body}"</Text>
        <Text style={styles.subHeading}>{review.location.location_name}, {review.location.location_town}</Text>
        <Text style={{ fontSize: 10 }}>{review.review.overall_rating}</Text>

        <View style={styles.likesSection}>
          <Image
            style={styles.likesImage}
            source={require('assets/images/thumbs_up.png')}
          />
          <Text style={styles.likesText}>{review.review.likes}</Text>
        </View>
      </View>
      <View style={styles.imageWrapper}>
        <Image
          style={styles.reviewImage}
          source={require('assets/images/reviews_placeholder.jpg')}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  widgetMain : {
    height: 110,
    marginTop: 1
  },
  textWrapper : {
    flex: 2
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
    justifyContent: 'space-between'
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
    flex: 1,
    alignSelf: 'flex-end',
  },
  reviewImage: {
    width: 75,
    height: 75,
    borderRadius: 75 / 2
  }
});

export default ReviewWidget;
