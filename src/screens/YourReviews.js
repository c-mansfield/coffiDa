/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native'

import ReviewWidget from 'src/components/ReviewWidget.js';
import UserManagement from 'src/api/UserManagement.js';

const YourReviews = () => {

  const isFocused = useIsFocused();
  const [reviewsData, setReviewsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {

      const userID = await AsyncStorage.getItem('@userID')
      let response = await UserManagement.getUser(userID);

      setReviewsData(response.reviews);
    }

    fetchData();
  }, [isFocused]);

  return (
    <View style={styles.main}>
      <FlatList
          data={reviewsData}
          renderItem={({item}) => (
              <ReviewWidget review={item.review} location={item.location} myReview={true}/>
          )}
          keyExtractor={(item,index) => item.review.review_id.toString()}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  main : {
    padding: 10
  }
});

export default YourReviews;
