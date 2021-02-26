/**
 * @format
 * @flow strict-local
*/

import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import mapstyle from 'assets/theme/mapstyle.js';
import { useIsFocused } from '@react-navigation/native';
import {
  Icon, TopNavigationAction, TopNavigation, Layout,
} from '@ui-kitten/components';

import LocationManagement from 'src/api/LocationManagement.js';
import DropDownHolder from 'src/services/DropdownHolder.js';
import ThemeContext from 'src/services/theme-context';

const NearbyLocations = ({ navigation, route }) => {
  const { location } = route.params;
  const [nearbyLocations, setNearbyLocations] = useState([]);
  const isFocused = useIsFocused();
  const [googleMapStyle, setGoogleMapStyle] = useState('');
  const themeContext = useContext(ThemeContext);

  useEffect(() => {
    const fetchData = async () => {
      getMapStyle();
      await getNearbyLocations();
    };

    fetchData();
  }, [isFocused]);

  const getMapStyle = () => {
    if (themeContext.theme === 'dark') {
      setGoogleMapStyle(mapstyle);
    }
  };

  const getNearbyLocations = async () => {
    const sendQuery = {
      q: location.location_town,
    };
    const response = await LocationManagement.searchLocations(sendQuery);

    if (response.success) {
      response.body = await removeCurrentLocation(response.body);
      setNearbyLocations(response.body);
    } else {
      DropDownHolder.error('Error', response.error);
    }
  };

  const removeCurrentLocation = (locations) => {
    locations.forEach((result, index) => {
      if (result.location_id === location.location_id) {
        locations.splice(index, 1);
      }
    });

    return locations;
  };

  const BackIcon = (props) => (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Icon {...props} name="arrow-back" />
    </TouchableOpacity>
  );

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} />
  );

  return (
    <Layout style={styles.main} level="1">
      <TopNavigation
        accessoryLeft={BackAction}
        alignment="center"
        title="Nearby Locations"
      />
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
        customMapStyle={googleMapStyle}
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
    </Layout>
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
};

export default NearbyLocations;
