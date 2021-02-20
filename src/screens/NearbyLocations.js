/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import mapstyle from 'assets/theme/mapstyle.js';
import { useIsFocused } from '@react-navigation/native';

import LocationManagement from 'src/api/LocationManagement.js';

const NearbyLocations = ({ route }) => {
  const { location } = route.params;
  const [nearbyLocations, setNearbyLocations] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchData = async () => {
      const sendQuery = {
        q: location.location_town,
      };
      let response = await LocationManagement.searchLocations(sendQuery);

      if (response) {
        response = await removeCurrentLocation(response);
        setNearbyLocations(response);
      }
    };

    fetchData();
  }, [isFocused]);

  const removeCurrentLocation = (locations) => {
    locations.forEach((result, index) => {
      if (result.location_id === location.location_id) {
        locations.splice(index, 1);
      }
    });

    return locations;
  };

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
          key={location.location_id}
          title={location.location_name}
          pinColor="#247BA0"
        />
        { nearbyLocations !== null ? (
          <>
            {nearbyLocations.map((loc) => (
              <Marker
                key={loc.location_id}
                coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
                pinColor="#C3B299"
                title={loc.location_name}
              />
            ))}
          </>
        )
          : null}
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
