/**
 * @format
 * @flow strict-local
*/

import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { Icon, Text } from '@ui-kitten/components';

import RatingCircles from 'src/components/RatingCircles.js';

const { width } = Dimensions.get('window');

const LocationTile = ({ location }) => {
  const reviewCount = location.location_reviews.length;

  return (
    <View style={styles.tile}>
      { location ? (
        <ImageBackground
          source={{ uri: location.photo_path }}
          style={styles.image}
          imageStyle={{ opacity: 0.3 }}
        >
          <View style={styles.overlay}>
            <Text category="h4" numberOfLines={1}>{location.location_name}</Text>
            <Text category="s2" numberOfLines={1}>{location.location_town}</Text>

            <View>
              <View style={styles.sectionRow}>
                <RatingCircles rating={location.avg_overall_rating} />
                <Text style={{ marginLeft: 5 }} category="c2">({reviewCount})</Text>
              </View>
            </View>

            { location.distance ? (
              <>
                <View style={{ marginTop: 5 }}>
                  <View style={styles.sectionRow}>
                    <Icon
                      style={styles.pinIcon}
                      name="pin"
                      fill="#247BA0"
                    />
                    <Text style={{ marginLeft: 5 }} category="c2">{location.distance.toFixed(1)} Miles</Text>
                  </View>
                </View>
              </>
            )
              : null}
          </View>
        </ImageBackground>
      )
        : null}
    </View>
  );
};

const styles = StyleSheet.create({
  tile: {
    width: (width / 2) - 20,
    height: (width / 2) - 20,
    marginTop: 10,
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
    alignItems: 'center'
  },
  pinIcon: {
    height: 16,
    width: 16,
  },
});

export default LocationTile;
