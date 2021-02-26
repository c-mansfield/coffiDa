/**
 * @format
 * @flow strict-local
*/

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  ScrollView,
  Dimensions,
  Alert,
  Linking,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Carousel from 'react-native-snap-carousel';
import { useIsFocused } from '@react-navigation/native';
import { Layout, Text, Spinner } from '@ui-kitten/components';

import DropDownHolder from 'src/services/DropdownHolder.js';
import LocationTile from 'src/components/LocationTile.js';
import LocationManagement from 'src/api/LocationManagement.js';
import ImageCarouselItem from 'src/components/ImageCarouselItem.js';

const haversine = require('haversine');

const screenWidth = Dimensions.get('window').width;

const Home = ({ navigation }) => {
  const [locationsData, setLocationsData] = useState([]);
  const [surroundingLocations, setSurroundingLocations] = useState([]);
  const [carouselLocations, setCarouselLocations] = useState([]);
  const [geoLocationDetails, setGeoLocationDetails] = useState({ location: null, locationPermission: false });
  const [isLoading, setIsLoading] = useState(true);
  const carousel = useRef(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchData = async () => {
      await findCoordinates();
    };

    setIsLoading(true);
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await getLocations();
    };

    setIsLoading(true);
    fetchData();
  }, [isFocused]);

  useEffect(() => {
    const fetchData = async () => {
      await getCarouselLocations(3);

      if (geoLocationDetails.locationPermission) {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    fetchData();
  }, [locationsData]);

  useEffect(() => {
    if (geoLocationDetails.locationPermission) {
      setIsLoading(true);

      const fetchData = async () => {
        const closestLocation = await getSurroundingLocations();

        setSurroundingLocations(closestLocation);
        setIsLoading(false);
      };

      fetchData();
    }
  }, [geoLocationDetails]);

  const getLocations = async () => {
    const sendQuery = { q: '' };
    const response = await LocationManagement.searchLocations(sendQuery);

    if (response.success) {
      setLocationsData(response.body);
    } else {
      DropDownHolder.error('Error', response.error);
    }
  };

  // Get carsouselNumber of locations for top carousel spotlight
  const getCarouselLocations = (carsouselNumber) => {
    const locations = [];

    while (locations.length < carsouselNumber) {
      const randomLocation = locationsData[Math.floor(Math.random() * locationsData.length)];

      locations.push(randomLocation);
    }

    setCarouselLocations(locations);
  };

  const getSurroundingLocations = async () => {
    const closestLocations = [];

    locationsData.forEach((location) => {
      const locationCopy = location;

      locationCopy.distance = getDistanceToLocation({ latitude: locationCopy.latitude, longitude: locationCopy.longitude });
      closestLocations.push(locationCopy);
    });

    // Sort locations by distance
    closestLocations.sort((a, b) => ((a.distance > b.distance) ? 1 : -1));

    // Return top 8 locations
    return closestLocations.slice(0, 8);
  };

  // Get distance between location and user current location, uses haversine formula, o
  const getDistanceToLocation = (location) => {
    return haversine({
      latitude: geoLocationDetails.location.coords.latitude,
      longitude: geoLocationDetails.location.coords.longitude,
    },
    location,
    { unit: 'mile' });
  };

  const findCoordinates = async () => {
    const enabled = await requestLocationPermission();

    if (enabled) {
      const locationStr = await getCurrentLocation();
      setGeoLocationDetails((prevState) => ({ ...prevState, location: locationStr }));
    }
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(resolve, ({ code, message }) => reject(Object.assign(new Error(message),
        { name: 'PositionError', code })), { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });
    });
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Coffida Location Permission',
          message:
            'Coffida needs access to your location '
            + 'so you can see all the awesome locations near you!',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        });
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setGeoLocationDetails((prevState) => ({ ...prevState, locationPermission: true }));
        return true;
      }

      setGeoLocationDetails((prevState) => ({ ...prevState, locationPermission: false }));
      return false;
    } catch (err) {
      return false;
    }
  };

  const locationAlert = () => Alert.alert(
    'Let Coffida use your location',
    'Settings > Location > Allow location',
    [
      {
        text: 'No thanks',
        style: 'cancel',
      },
      { text: 'Open Settings', onPress: () => Linking.openSettings() },
    ],
    { cancelable: false },
  );

  return (
    <Layout level="1" style={styles.main}>
      <ScrollView>
        { isLoading
          ? (
            <>
              <View style={{
                flex: 1, justifyContent: 'center', flexDirection: 'row', padding: 10, alignItems: 'center'
              }}
              >
                <Spinner />
              </View>
            </>
          ) : (
            <View>
              <Carousel
                ref={carousel}
                data={carouselLocations}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => navigation.navigate(
                      'LocationStackNavigation',
                      { screen: 'LocationDetails', params: { locationID: item.location_id } },
                    )}
                  >
                    <ImageCarouselItem location={item} />
                  </TouchableOpacity>
                )}
                itemWidth={screenWidth}
                sliderWidth={screenWidth}
              />
              { geoLocationDetails.locationPermission
                ? (
                  <>
                    <View style={{ padding: 15 }}>
                      <Text category="h2">Explore</Text>
                      { geoLocationDetails.locationPermission
                        ? <Text category="s1">Nearby Places</Text>
                        : <Text category="s1">Manchester, UK</Text>}

                      <View style={styles.tileWrapper}>
                        {surroundingLocations.map((location) => (
                          <TouchableOpacity
                            onPress={() => navigation.navigate(
                              'LocationStackNavigation',
                              { screen: 'LocationDetails', params: { locationID: location.location_id } },
                            )}
                            key={`${location.location_id}_touchableOpacity`}
                          >
                            <LocationTile location={location} key={`${location.location_id}_locationTile`} />
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </>
                )
                : (
                  <>
                    <View style={styles.locationOverlay}>
                      <Layout level="2" style={styles.locationOverlayWrapper}>
                        <Text category="h2">Explore near you</Text>
                        <Text style={styles.locationText} category="p1">
                          Enable your location services so you can explore all the places near you
                          and grab the perfect cup!
                        </Text>
                        <TouchableOpacity style={styles.primaryButton} onPress={() => locationAlert()}>
                          <Text style={{ fontFamily: 'Nunito-Bold', fontSize: 18, color: '#FFFFFF' }}>
                            Enable Location 🗺️
                          </Text>
                        </TouchableOpacity>
                      </Layout>
                    </View>
                  </>
                )}
            </View>
          )}
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  tileWrapper: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  locationOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    textAlign: 'center',
  },
  locationOverlayWrapper: {
    padding: 20,
  },
  locationText: {
    marginTop: 10,
  },
  primaryButton: {
    backgroundColor: '#247BA0',
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
});

export default Home;
