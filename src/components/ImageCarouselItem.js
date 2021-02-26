/**
 * @format
 * @flow strict-local
*/

import React from 'react';
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
          imageStyle={{ opacity: 0.4 }}
        >
          <View style={styles.overlay}>
            <Text category="h1" numberOfLines={1}>{location.location_name}</Text>
            <Text category="s1" numberOfLines={1}>{location.location_town}</Text>
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
    justifyContent: 'flex-end',
    padding: 5,
  },
  sectionRow: {
    flexDirection: 'row',
  },
});

export default ImageCarouselItem;
