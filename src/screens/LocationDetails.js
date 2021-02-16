/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ImageBackground, FlatList, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { Divider } from '@ui-kitten/components';
import { useIsFocused } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon } from '@ui-kitten/components';

import ReviewWidget from 'src/components/ReviewWidget.js';
import RatingCircles from 'src/components/RatingCircles.js';
import UserManagement from 'src/api/UserManagement.js';
import LocationManagement from 'src/api/LocationManagement.js';

const LocationDetails = ({ navigation, route }) => {
  const { location } = route.params;
  const reviewCount = location.location_reviews.length;
  const [favouriteIcon, setFavouriteIcon] = useState('star-outline');
  const [favourite, setFavourite] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchData = async () => {

      let userID = await AsyncStorage.getItem('@userID')
      let response = await UserManagement.getUser(userID);

      if(response.favourite_locations.some(item => item.location_name === location.location_name)) {
        setFavouriteIcon('star');
        setFavourite(true);
      }
    }

    fetchData();
  }, [isFocused]);

  const changeFavourite = async () => {
    if(favourite) {
      let response = await LocationManagement.unfavouriteReview(location.location_id);

      if(response) {
        setFavouriteIcon('star-outline');
        setFavourite(false);
      }
    } else {
      let response = await LocationManagement.favouriteReview(location.location_id);

      if(response) {
        setFavouriteIcon('star');
        setFavourite(true);
      }
    }
  };

  return (
    <SafeAreaView style={styles.detailsMain}>
      <View style={styles.detailsHeader}>
        <ImageBackground source={require('assets/images/location_placeholder.jpg')} style={styles.detailsImage}>
          <View style={styles.detailsOverlay}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon style={styles.iconSize} fill={'#000000'} name={'arrow-back'} />
            </TouchableOpacity>

            <View style={styles.detailsHeaderText}>
            <View style={styles.detailsHeaderTextWrapper}>
                <View style={styles.detailsHeaderLHS}>
                  <Text style={{ fontSize: 36, fontFamily: 'Nunito-Bold' }}>{location.location_name}</Text>
                  <Text style={{ fontSize: 24, fontFamily: 'Nunito-Regular', color: '#504F4F' }}>{location.location_town}</Text>
                </View>

                <TouchableOpacity onPress={() => changeFavourite()} style={styles.detailsHeaderRHS}>
                  <Icon style={styles.iconSize} fill={'#000000'} name={favouriteIcon} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
      <View style={styles.detailsBody}>
        <Text style={{ fontSize: 18, fontFamily: 'Nunito-Bold', color: '#707070', marginTop: 10 }}>Overall rating</Text>

        <View style={styles.overallRating}>
          <RatingCircles rating={location.avg_overall_rating}/>
          <Text style={{ fontSize: 12, fontFamily: 'Nunito-Regular', color: '#707070', marginLeft: 5 }}>({reviewCount} reviews)</Text>
        </View>

        <View style={styles.detailsPrice}>
          <Text style={{ fontSize: 18, fontFamily: 'Nunito-Regular', color: '#707070' }}>Price rating</Text>

          <View style={{marginLeft: 'auto'}}>
            <RatingCircles rating={location.avg_price_rating} />
          </View>
        </View>

        <View style={styles.detailsQuality}>
          <Text style={{ fontSize: 18, fontFamily: 'Nunito-Regular', color: '#707070' }}>Quality rating</Text>

          <View style={{marginLeft: 'auto'}}>
            <RatingCircles rating={location.avg_quality_rating}/>
          </View>
        </View>

        <View style={styles.detailsClenliness}>
          <Text style={{ fontSize: 18, fontFamily: 'Nunito-Regular', color: '#707070' }}>Clenliness rating</Text>

          <View style={{marginLeft: 'auto'}}>
            <RatingCircles rating={location.avg_clenliness_rating}/>
          </View>
        </View>

        <Divider/>

        <View style={styles.detailsReviews}>
          <Text style={{ fontSize: 22, fontFamily: 'Nunito-Bold', color: '#504F4F', marginBottom: 10 }}>Reviews</Text>

          <FlatList
              data={location.location_reviews}
              renderItem={({item}) => (
                  <ReviewWidget review={item} location={location}/>
              )}
              keyExtractor={(item,index) => item.review_id.toString()}
            />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  detailsMain: {
    flex: 1
  },
  detailsHeader: {
    flex: 1
  },
  detailsImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  detailsOverlay: {
    flex: 1,
    backgroundColor:'rgba(255,255,255,0.7)',
    padding: 10
  },
  iconSize: {
    height: 38,
    width: 38
  },
  detailsHeaderText: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  detailsHeaderTextWrapper: {
    flexDirection: 'row',
  },
  detailsHeaderLHS: {
    flex: 8
  },
  detailsHeaderRHS: {
    flex: 1,
    alignSelf: 'flex-end',
    marginBottom: 15
  },
  detailsBody: {
    flex: 2,
    padding: 10,
    flexDirection: 'column'
  },
  overallRating : {
    flexDirection: 'row',
    marginTop: 10
  },
  detailsPrice: {
    flexDirection: 'row',
    marginTop: 25
  },
  detailsQuality : {
    flexDirection: 'row',
    marginTop: 25
  },
  detailsClenliness : {
    flexDirection: 'row',
    marginTop: 25
  },
  detailsReviews: {
    flexDirection: 'column',
    marginTop: 30
  }
});

export default LocationDetails;
