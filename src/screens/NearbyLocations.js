/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import mapstyle from 'assets/theme/mapstyle.js';

const NearbyLocations = ({ route }) => {
  const { location } = route.params;
  const [nearbyLocations, setNearbyLocations] = useState([]);

  // const mapMarkers = () => {
  //   return nearbyLocations.map((location) =>
  //     <Marker
  //       key={report.id}
  //       coordinate={{ latitude: location.lat, longitude: location.lon }}
  //       title={location.location_name}
  //     >)
  // }

  return (
    <View style={styles.main}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          longitudeDelta: 0.002,
          latitudeDelta: 0.002,
        }}
        tracksViewChanges={false}
        customMapStyle={mapstyle}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

NearbyLocations.propTypes = {
  route: PropTypes.objects,
};

export default NearbyLocations;
