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
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

import DropDownHolder from 'src/services/DropdownHolder.js';
import ReviewWidget from 'src/components/ReviewWidget.js';
import UserManagement from 'src/api/UserManagement.js';

const YourReviews = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [reviewsData, setReviewsData] = useState([]);
  const [likedReviews, setLikedReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userID = await AsyncStorage.getItem('@userID');
      const response = await UserManagement.getUser(userID);
      const likes = await getLikedReviews(response);

      setReviewsData(response.reviews);
      setLikedReviews(likes);
    };

    fetchData();
  }, [isFocused]);

  const getLikedReviews = (reviewsFull) => {
    const reviewIDs = [];

    reviewsFull.liked_reviews.forEach((like) => {
      reviewIDs.push(like.review.review_id);
    });

    return reviewIDs;
  };

  const alertMessage = (type, title, message) => {
    DropDownHolder.any(type, title, message);
  };

  return (
    <View style={styles.main}>
      <FlatList
        data={reviewsData}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('View Review', {
            review: item.review, location: item.location, likedReviews, alertMessage,
          })}
          >
            <ReviewWidget
              review={item.review}
              location={item.location}
              myReview
              likedReviews={likedReviews}
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.review.review_id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    padding: 10,
  },
});

export default YourReviews;
