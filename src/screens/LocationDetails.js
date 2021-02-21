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
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon, Divider, Button } from '@ui-kitten/components';
import PropTypes from 'prop-types';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

import ExpandableReviewWidget from 'src/components/ExpandableReviewWidget.js';
import RatingCircles from 'src/components/RatingCircles.js';
import UserManagement from 'src/api/UserManagement.js';
import LocationManagement from 'src/api/LocationManagement.js';
import mapstyle from 'assets/theme/mapstyle.js';

const LocationDetails = ({ navigation, route }) => {
  const { location } = route.params;
  const reviewCount = location.location_reviews.length;
  const [favouriteIcon, setFavouriteIcon] = useState('star-outline');
  const [favourite, setFavourite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchData = async () => {
      const userID = await AsyncStorage.getItem('@userID');
      const response = await UserManagement.getUser(userID);

      if (response.favourite_locations.some((item) => item.location_name === location.location_name)) {
        setFavouriteIcon('star');
        setFavourite(true);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [isFocused]);

  const changeFavourite = async () => {
    if (favourite) {
      await unfavouriteLocation();
    } else {
      await favouriteLocation();
    }
  };

  const favouriteLocation = async () => {
    const response = await LocationManagement.favouriteReview(location.location_id);

    if (response) {
      setFavouriteIcon('star');
      setFavourite(true);
    }
  };

  const unfavouriteLocation = async () => {
    const response = await LocationManagement.unfavouriteReview(location.location_id);

    if (response) {
      setFavouriteIcon('star-outline');
      setFavourite(false);
    }
  };

  const getHighlightReviews = (highlightsLength) => {
    const reviews = [];

    for (let i = 0; i < highlightsLength; i++) {
      if (location.location_reviews[i]) {
        reviews.push(
          <ExpandableReviewWidget review={location.location_reviews[i]} location={location} />
        );
      }
    }

    return reviews;
  };

  return (
    <ScrollView style={styles.detailsMain}>
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
        )
        : (
          <>
            <StatusBar />
            <View style={styles.detailsHeader}>
              <ImageBackground source={{ uri: location.photo_path }} style={styles.detailsImage}>
                <View style={styles.detailsOverlay}>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon style={styles.iconSize} fill="#000000" name="arrow-back" />
                  </TouchableOpacity>

                  <View style={styles.detailsHeaderText}>
                    <View style={styles.detailsHeaderTextWrapper}>
                      <View style={styles.detailsHeaderLHS}>
                        <Text style={{ fontSize: 36, fontFamily: 'Nunito-Bold' }}>{location.location_name}</Text>
                        <Text
                          style={{ fontSize: 24, fontFamily: 'Nunito-Regular', color: '#504F4F' }}
                        >{location.location_town}
                        </Text>
                      </View>

                      <TouchableOpacity onPress={() => changeFavourite()} style={styles.detailsHeaderRHS}>
                        <Icon style={styles.iconSize} fill="#000000" name={favouriteIcon} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </ImageBackground>
            </View>
            <View style={styles.detailsBody}>
              <Text style={{
                fontSize: 18, fontFamily: 'Nunito-Bold', color: '#707070', marginTop: 10,
              }}
              >Overall rating
              </Text>

              <View style={styles.overallRating}>
                <RatingCircles rating={location.avg_overall_rating} />
                <Text style={{
                  fontSize: 12, fontFamily: 'Nunito-Regular', color: '#707070', marginLeft: 5,
                }}
                >({reviewCount} reviews)
                </Text>
              </View>

              <View style={styles.detailsPrice}>
                <Text style={{ fontSize: 18, fontFamily: 'Nunito-Regular', color: '#707070' }}>Price rating</Text>

                <View style={{ marginLeft: 'auto' }}>
                  <RatingCircles rating={location.avg_price_rating} />
                </View>
              </View>

              <View style={styles.detailsQuality}>
                <Text style={{ fontSize: 18, fontFamily: 'Nunito-Regular', color: '#707070' }}>Quality rating</Text>

                <View style={{ marginLeft: 'auto' }}>
                  <RatingCircles rating={location.avg_quality_rating} />
                </View>
              </View>

              <View style={styles.detailsClenliness}>
                <Text style={{ fontSize: 18, fontFamily: 'Nunito-Regular', color: '#707070' }}>Clenliness rating</Text>

                <View style={{ marginLeft: 'auto' }}>
                  <RatingCircles rating={location.avg_clenliness_rating} />
                </View>
              </View>

              <Divider />

              <TouchableOpacity style={styles.detailsMap} onPress={() => navigation.navigate('NearbyLocations', { location })}>
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
                  scrollEnabled={false}
                  zoomEnabled={false}
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
                </MapView>
              </TouchableOpacity>

              <Divider />

              <View style={styles.detailsReviews}>
                <Text style={{
                  fontSize: 22, fontFamily: 'Nunito-Bold', color: '#504F4F', marginBottom: 5,
                }}
                >
                  Reviews
                </Text>

                {getHighlightReviews(3)}
                { location.location_reviews.length > 0
                  ? (
                    <>
                      <Button
                        style={{ marginTop: 10 }}
                        status="primary"
                        onPress={() => navigation.navigate('AllReviews', { location })}
                      >
                        See all reviews
                      </Button>
                    </>
                  )
                  : <Text style={{ textAlign: 'center', paddingTop: 20, paddingBottom: 20 }}>No reviews yet</Text>}
              </View>
            </View>
          </>
        )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  detailsMain: {
    flex: 1,
  },
  detailsHeader: {
    flex: 1,
  },
  detailsImage: {
    flex: 1,
    resizeMode: 'cover',
    height: 250,
  },
  detailsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: 10,
  },
  iconSize: {
    height: 38,
    width: 38,
  },
  detailsHeaderText: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  detailsHeaderTextWrapper: {
    flexDirection: 'row',
  },
  detailsHeaderLHS: {
    flex: 8,
  },
  detailsHeaderRHS: {
    flex: 1,
    alignSelf: 'flex-end',
    marginBottom: 15,
  },
  detailsBody: {
    flex: 2,
    padding: 10,
    flexDirection: 'column',
  },
  overallRating: {
    flexDirection: 'row',
    marginTop: 10,
  },
  detailsPrice: {
    flexDirection: 'row',
    marginTop: 25,
  },
  detailsQuality: {
    flexDirection: 'row',
    marginTop: 25,
  },
  detailsClenliness: {
    flexDirection: 'row',
    marginTop: 25,
  },
  detailsReviews: {
    flexDirection: 'column',
    marginTop: 20,
  },
  detailsMap: {
    flex: 1,
    marginTop: 20,
  },
  map: {
    height: 180,
  },
});

LocationDetails.propTypes = {
  route: PropTypes.objects,
};

export default LocationDetails;
