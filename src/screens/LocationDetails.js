/**
 * @format
 * @flow strict-local
*/

import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Icon, Divider, Layout, Text,
} from '@ui-kitten/components';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { useIsFocused } from '@react-navigation/native';

import ExpandableReviewWidget from 'src/components/ExpandableReviewWidget.js';
import RatingCircles from 'src/components/RatingCircles.js';
import UserManagement from 'src/api/UserManagement.js';
import LocationManagement from 'src/api/LocationManagement.js';
import mapstyle from 'assets/theme/mapstyle.js';
import DropDownHolder from 'src/services/DropdownHolder.js';

const LocationDetails = ({ navigation, route }) => {
  const { locationID } = route.params;
  const [location, setLocation] = useState(null);
  const [favouriteIcon, setFavouriteIcon] = useState('star-outline');
  const [favourite, setFavourite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [likedReviews, setLikedReviews] = useState([]);
  const isFocused = useIsFocused();

  // Get liked locations each time page reloads
  useEffect(() => {
    const fetchData = async () => {
      await getLikedReviews();
    };

    setIsLoading(true);
    fetchData();
  }, [isFocused]);

  useEffect(() => {
    const fetchData = async () => {
      await getLikedReviews();
      await getLocationDetails();
    };

    setIsLoading(true);
    fetchData();
  }, []);

  // Get favourite location when location is added to state
  useEffect(() => {
    if (location && likedReviews) {
      const fetchData = async () => {
        await setLocationFavourite();
        setIsLoading(false);
      };

      fetchData();
    }
  }, [location, likedReviews]);

  const getLocationDetails = async () => {
    const response = await LocationManagement.getLocation(locationID);

    if (response.success) {
      setLocation(response.body);
    } else {
      navigation.goBack();
      DropDownHolder.error('Error', response.error);
    }
  };

  const setLocationFavourite = async () => {
    const userID = await AsyncStorage.getItem('@userID');
    const response = await UserManagement.getUser(userID);

    if (response.success) {
      if (response.body.favourite_locations.some((item) => item.location_name === location.location_name)) {
        setFavouriteIcon('star');
        setFavourite(true);
      }
    } else {
      DropDownHolder.error('Error', response.error);
    }
  };

  const changeFavourite = async () => {
    if (favourite) {
      await unfavouriteLocation();
    } else {
      await favouriteLocation();
    }
  };

  const favouriteLocation = async () => {
    const response = await LocationManagement.favouriteReview(location.location_id);

    if (response.success) {
      setFavouriteIcon('star');
      setFavourite(true);
    } else {
      DropDownHolder.error('Error', response.error);
    }
  };

  const unfavouriteLocation = async () => {
    const response = await LocationManagement.unfavouriteReview(location.location_id);

    if (response.success) {
      setFavouriteIcon('star-outline');
      setFavourite(false);
    } else {
      DropDownHolder.error('Error', response.error);
    }
  };

  const getHighlightReviews = (highlightsLength) => {
    const reviews = [];

    for (let i = 0; i < highlightsLength; i++) {
      if (location.location_reviews[i]) {
        reviews.push(
          <ExpandableReviewWidget
            key={`Review_${i.toString()}`}
            review={location.location_reviews[i]}
            location={location}
            likedReviews={likedReviews}
          />
        );
      }
    }

    return reviews;
  };

  const getLikedReviews = async () => {
    const userID = await AsyncStorage.getItem('@userID');
    const response = await UserManagement.getUser(userID);

    if (response.success) {
      const liked = response.body.liked_reviews.map((review) => review.review.review_id);

      setLikedReviews(liked);
    } else {
      DropDownHolder.error('Error', response.error);
    }
  };

  return (
    <Layout level="1" style={styles.detailsMain}>
      <ScrollView>
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
                <ImageBackground
                  source={{ uri: location.photo_path }}
                  style={styles.detailsImage}
                  imageStyle={{ opacity: 0.4 }}
                >
                  <View style={styles.detailsOverlay}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                      <Icon style={styles.iconSize} fill="#000000" name="arrow-back" />
                    </TouchableOpacity>

                    <View style={styles.detailsHeaderText}>
                      <View style={styles.detailsHeaderTextWrapper}>
                        <View style={styles.detailsHeaderLHS}>
                          <Text category="h1">{location.location_name}</Text>
                          <Text
                            category="s1"
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
                <Text
                  style={{ marginTop: 10 }}
                  category="h6"
                >Overall rating
                </Text>

                <View style={styles.overallRating}>
                  <RatingCircles rating={location.avg_overall_rating} />
                  <Text
                    style={{ marginLeft: 5 }}
                    category="c2"
                  >({location.location_reviews.length} reviews)
                  </Text>
                </View>

                <View style={styles.detailsPrice}>
                  <Text category="s1">Price rating</Text>

                  <View style={{ marginLeft: 'auto' }}>
                    <RatingCircles rating={location.avg_price_rating} />
                  </View>
                </View>

                <View style={styles.detailsQuality}>
                  <Text category="s1">Quality rating</Text>

                  <View style={{ marginLeft: 'auto' }}>
                    <RatingCircles rating={location.avg_quality_rating} />
                  </View>
                </View>

                <View style={styles.detailsClenliness}>
                  <Text category="s1">Clenliness rating</Text>

                  <View style={{ marginLeft: 'auto' }}>
                    <RatingCircles rating={location.avg_clenliness_rating} />
                  </View>
                </View>

                <Divider />

                <TouchableOpacity
                  style={styles.detailsMap}
                  onPress={() => navigation.navigate('NearbyLocations', { location })}
                >
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
                  <Text style={{ marginBottom: 5 }} category="h4">
                    Reviews
                  </Text>

                  {getHighlightReviews(3)}
                  { location.location_reviews.length > 0
                    ? (
                      <>
                        <TouchableOpacity
                          style={styles.allReviewsButton}
                          onPress={() => navigation.navigate('AllReviews', { location, likedReviews })}
                        >
                          <Text style={{ color: '#FFFFFF' }} category="h6">
                            See all reviews
                          </Text>
                        </TouchableOpacity>

                      </>
                    )
                    : <Text style={{ textAlign: 'center', paddingTop: 20, paddingBottom: 20 }}>No reviews yet</Text>}
                </View>
              </View>
            </>
          )}
      </ScrollView>
    </Layout>
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
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 20,
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
    paddingBottom: 20,
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
  allReviewsButton: {
    backgroundColor: '#247BA0',
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
});

LocationDetails.propTypes = {
};

export default LocationDetails;
