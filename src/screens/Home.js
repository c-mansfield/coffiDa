/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import LocationTile from 'src/components/LocationTile.js';
import LocationManagement from 'src/api/LocationManagement.js';
import ImageCarouselItem from 'src/components/ImageCarouselItem.js';

const haversine = require('haversine');

const screenWidth = Dimensions.get('window').width;

const Home = ({ navigation }) => {
  const [locationsData, setLocationsData] = useState([]);
  const [geoLocationDetails, setGeoLocationDetails] = useState({ location: null, locationPermission: false });
  const [isLoading, setIsLoading] = useState(true);
  const carousel = useRef(null);

  useEffect(() => {
    setIsLoading(true);

    const fetchData = async () => {
      await findCoordinates();

      setIsLoading(false);
    };

    fetchData();
  }, []);

  const getLocations = async () => {
    const sendQuery = {
      q: getSearchString(),
    };

    let response = await LocationManagement.searchLocations(sendQuery);

    if (response) {
      if (geoLocationDetails.locationPermission) {
        response = await getSurroundingLocations(response);
      }
      setLocationsData(response);
    }
  };

  const getSurroundingLocations = async (locations) => {
    const closestLocations = [];

    locations.forEach((location) => {
      const locationCopy = location;

      locationCopy.distance = getDistanceToLocation({ latitude: locationCopy.latitude, longitude: locationCopy.longitude });
      closestLocations.push(locationCopy);
    });

    // Sort locations by distance
    closestLocations.sort((a, b) => ((a.distance > b.distance) ? 1 : -1));

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

  const getSearchString = () => {
    if (geoLocationDetails.locationPermission) {
      return '';
    }

    return 'Manchester';
  };

  const findCoordinates = async () => {
    if (!geoLocationDetails.locationPermission) {
      await requestLocationPermission();
    }

    const locationStr = await getCurrentLocation();
    setGeoLocationDetails((prevState) => ({ ...prevState, location: locationStr }));

    await getLocations();
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
        setGeoLocationDetails((prevState) => ({ ...prevState, locationPermission: true }));
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
    <ScrollView style={styles.main}>
      { isLoading
        ? (
          <>
            <View style={{
              flex: 1, justifyContent: 'center', flexDirection: 'row', padding: 10,
            }}
            >
              <ActivityIndicator />
            </View>
          </>
        ) : (
          <>
            <Carousel
              ref={carousel}
              data={locationsData}
              renderItem={({ item }) => (
                <ImageCarouselItem location={item} />
              )}
              itemWidth={screenWidth}
              sliderWidth={screenWidth}
            />
            <View style={{ padding: 15 }}>
              <Text style={styles.title}>Explore</Text>
              { geoLocationDetails.locationPermission
                ? <Text style={styles.subHeading}>Nearby Places</Text>
                : <Text style={styles.subHeading}>Manchester, UK</Text>}

              <View style={styles.tileWrapper}>
                { locationsData !== null ? (
                  <>
                    {locationsData.map((location) => (
                      <TouchableOpacity
                        onPress={() => navigation.navigate(
                          'LocationStackNavigation',
                          { screen: 'LocationDetails', params: { locationID: location.location_id } },
                        )}
                      >
                        <LocationTile location={location} />
                      </TouchableOpacity>
                    ))}
                  </>
                )
                  : null}
              </View>
            </View>
          </>
        )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  main: {
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
    marginBottom: 20,
  },
});

export default Home;

// <FlatList
//   columnWrapperStyle={{ justifyContent: 'space-between' }}
//   data={locationsData}
//   renderItem={({ item }) => (
//     <TouchableOpacity onPress={() => navigation.navigate('LocationDetails', { locationID: item.location_id })}>
//       <LocationTile location={item} />
//     </TouchableOpacity>
//   )}
//   keyExtractor={(item) => item.location_name}
//   numColumns={numColumns}
// />
