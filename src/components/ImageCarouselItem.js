/**
 * @format
 * @flow strict-local
*/

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { Text } from '@ui-kitten/components';

const ImageCarouselItem = ({ location }) => {
  return (
    <View style={styles.tile}>
      { location ? (
        <ImageBackground
          source={location.photo_path ? { uri: location.photo_path } : null}
          style={styles.image}
        >
          <View style={styles.overlay}>
            <Text style={{ fontSize: 48, fontFamily: 'Nunito-Bold' }} numberOfLines={1}>{location.location_name}</Text>
            <Text style={{ fontSize: 28, color: '#504F4F' }} numberOfLines={1}>{location.location_town}</Text>
          </View>
        </ImageBackground>
      )
        : null}
    </View>
  );
};

const styles = StyleSheet.create({
  tile: {
    height: 280,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'flex-end',
    padding: 5,
  },
  sectionRow: {
    flexDirection: 'row',
  },
});

export default ImageCarouselItem;
