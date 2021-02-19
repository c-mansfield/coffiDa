/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';

import LocationTile from 'src/components/LocationTile.js';
import LocationManagement from 'src/api/LocationManagement.js';

const Home = ({ navigation }) => {
  const [locationsData, setLocationsData] = useState([]);
  const numColumns = 2;
  const isFocused = useIsFocused();
  const [geoLocationDetails, setGeoLocationDetails] = useState({ location: null, locationPermission: false });

  useEffect(() => {
    const fetchData = async () => {
      const sendQuery = {
        q: 'Manchester',
      };
      const response = await LocationManagement.searchLocations(sendQuery);

      if (response) {
        setLocationsData(response);
      }
    };

    fetchData();
  }, [isFocused]);

  const findCoordinates = async () => {
    if (!geoLocationDetails.locationPermission) {
      await requestLocationPermission();
    }

    const locationStr = await getCurrentLocation();
    setGeoLocationDetails((prevState) => ({ ...prevState, location: locationStr }));
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(resolve, ({ code, message }) => reject(Object.assign(new Error(message),
        { name: 'PositionError', code })), { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });
    });
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app requires access to your location',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can access location');
        return true;
      }

      console.log('Permission denied');
      return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  return (
    <View style={styles.main}>
      <Text style={styles.title}>Explore</Text>
      <Text style={styles.subHeading}>Manchester, UK</Text>

      <View style={styles.tileWrapper}>
        <FlatList
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          data={locationsData}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('LocationDetails', { location: item })}>
              <LocationTile location={item} />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.location_name}
          numColumns={numColumns}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    padding: 15,
    flex: 1,
  },
  title: {
    fontSize: 36,
    fontFamily: 'Nunito-Bold',
  },
  subHeading: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
  },
  tileWrapper: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Home;
