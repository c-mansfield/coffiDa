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

const ReviewWidget = ({ review, location_name, location_town }) => {

  return (
    <Card style={styles.widgetMain}>
      <View style={styles.textWrapper}>
        <Text style={styles.header} numberOfLines={1}>"{review.review_body}"</Text>
        <Text style={styles.subHeading}>{location_name}, {location_town}</Text>
        <Text style={{ fontSize: 10 }}>{review.overall_rating}</Text>

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
    </Card>
  );
};

const styles = StyleSheet.create({
  widgetMain : {
    height: 110,
    marginTop: 1,
    flexDirection: 'row',
    flex: 1
  },
  textWrapper : {
    flex: 1
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
    flex: 1,
  },
  reviewImage: {
    width: 75,
    height: 75,
    borderRadius: 75 / 2
  }
});

export default ReviewWidget;
