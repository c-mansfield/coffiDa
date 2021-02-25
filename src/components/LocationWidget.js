/**
 * @format
 * @flow strict-local
*/

import React from 'react';
import {
  View,
  StyleSheet,
  Image,
} from 'react-native';
import { Text, Layout } from '@ui-kitten/components';

import RatingCircles from 'src/components/RatingCircles.js';

const LocationWidget = ({ location }) => {
  const reviewCount = location.location_reviews.length;

  return (
    <View style={styles.main}>
      <Layout level="3" style={styles.widgetMain}>
        <View style={styles.imageWrapper}>
          <Image
            style={styles.locationImage}
            source={{ uri: location.photo_path }}
          />
        </View>
        <View style={styles.textWrapper}>
          <Text category="h6">{location.location_name}</Text>
          <Text category="s1" appearance="hint">{location.location_town}</Text>

          <View style={styles.locationRating}>
            <RatingCircles rating={location.avg_overall_rating} />
            <Text style={{ fontSize: 12, marginLeft: 5 }}>({reviewCount})</Text>
          </View>
        </View>
      </Layout>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    marginBottom: 5,
  },
  widgetMain: {
    flexDirection: 'row',
    textAlign: 'left',
    flex: 1,
    padding: 15,
    borderColor: 'rgb(224, 224, 224)',
    borderRadius: 4,
    borderWidth: 0.5,
  },
  locationImage: {
    width: 75,
    height: 75,
  },
  textWrapper: {
    alignSelf: 'center',
    marginLeft: 10,
  },
  locationRating: {
    flexDirection: 'row',
    flex: 1,
    marginTop: 5,
  },
});

export default LocationWidget;
