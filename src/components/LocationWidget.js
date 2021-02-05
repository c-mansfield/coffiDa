/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Card, Text } from '@ui-kitten/components';

const LocationWidget = () => {
  return (
    <Card style={styles.widgetMain}>
      <View style={styles.imageWrapper}>
        <Image
          style={styles.locationImage}
          source={require('assets/images/reviews_placeholder.jpg')}
        />
      </View>
      <View style={styles.textWrapper}>
        <Text style={styles.header}>Location Name</Text>
        <Text style={styles.subHeading}>Manchester, UK</Text>
        <Text style={{ fontSize: 10 }}>(1,723)</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  widgetMain : {
    minHeight: 100,
    flexDirection: 'row',
    textAlign: 'left'
  },
  imageWrapper: {
  },
  locationImage: {
    width: 75,
    height: 75
  },
  textWrapper : {
    alignSelf: 'center'
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
  }
});

export default LocationWidget;
