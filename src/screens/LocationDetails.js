/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button, ImageBackground, FlatList } from 'react-native';

import ReviewWidget from 'src/components/ReviewWidget.js';

const LocationDetails = ({ navigation, route }) => {

  const { location } = route.params;
  const reviewCount = location.location_reviews.length;

  return (
    <View style={styles.detailsMain}>
      <View style={styles.detailsHeader}>
        <ImageBackground source={require('assets/images/location_placeholder.jpg')} style={styles.detailsImage}>
          <View style={styles.detailsOverlay}>

            <View style={styles.detailsHeaderText}>
              <Text style={{ fontSize: 36, fontFamily: 'Nunito-Bold' }}>{location.location_name}</Text>
              <Text style={{ fontSize: 24, fontFamily: 'Nunito-Regular', color: '#504F4F' }}>{location.location_town}</Text>
            </View>
          </View>
        </ImageBackground>
      </View>
      <View style={styles.detailsBody}>
        <Text style={{ fontSize: 18, fontFamily: 'Nunito-Bold', color: '#707070' }}>Overall rating</Text>
        <Text style={{ fontSize: 12, fontFamily: 'Nunito-Regular', color: '#707070' }}>{location.avg_overall_rating} - ({reviewCount} reviews)</Text>

        <View style={styles.detailsPrice}>
          <Text style={{ fontSize: 18, fontFamily: 'Nunito-Regular', color: '#707070' }}>Price rating</Text>
        </View>

        <View style={styles.detailsQuality}>
          <Text style={{ fontSize: 18, fontFamily: 'Nunito-Regular', color: '#707070' }}>Quality rating</Text>
        </View>

        <View style={styles.detailsClenliness}>
          <Text style={{ fontSize: 18, fontFamily: 'Nunito-Regular', color: '#707070' }}>Clenliness rating</Text>
        </View>

        <View style={styles.detailsReviews}>
          <Text style={{ fontSize: 22, fontFamily: 'Nunito-Bold', color: '#504F4F' }}>Reviews</Text>

          <FlatList
              data={location.location_reviews}
              renderItem={({item}) => (
                  <ReviewWidget review={item} location_name={location.location_name} location_town={location.location_town}/>
              )}
              keyExtractor={(item,index) => item.review_id.toString()}
            />
        </View>
      </View>
    </View>
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
  },
  detailsOverlay: {
    flex: 1,
    backgroundColor:'rgba(255,255,255,0.7)',
    justifyContent: 'flex-end',
    padding: 10
  },
  detailsBody: {
    flex: 2,
    padding: 10
  },
  detailsPrice: {

  },
  detailsQuality : {

  },
  detailsClenliness : {

  },
  detailsReviews: {

  }
});

export default LocationDetails;
