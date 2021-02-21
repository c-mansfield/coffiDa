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
      <ImageBackground source={{ uri: location.photo_path }} style={styles.image}>
        <View style={styles.overlay}>
          <Text style={{ fontSize: 20, fontFamily: 'Nunito-Bold' }} numberOfLines={1}>{location.location_name}</Text>
          <Text style={{ fontSize: 14, color: '#504F4F' }} numberOfLines={1}>{location.location_town}</Text>

          <View>
            <View style={styles.sectionRow}>
              <RatingCircles rating={location.avg_overall_rating} />
              <Text style={{ fontSize: 12, marginLeft: 5 }}>({reviewCount})</Text>
            </View>
          </View>

          { location.distance ? (
            <>
              <View style={{ marginTop: 5 }}>
                <View style={styles.sectionRow}>
                  <Icon
                    style={styles.pinIcon}
                    name="pin"
                    fill="#000000"
                  />
                  <Text style={{ fontSize: 12, marginLeft: 5 }}>{location.distance.toFixed(1)} Miles</Text>
                </View>
              </View>
            </>
          )
            : null}
        </View>
      </ImageBackground>
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
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'flex-end',
    padding: 5,
  },
  sectionRow: {
    flexDirection: 'row',
  },
  pinIcon: {
    height: 16,
    width: 16,
  },
});

export default LocationTile;
