/**
 * @format
 * @flow strict-local
*/

import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

import ExpandableReviewWidget from 'src/components/ExpandableReviewWidget.js';
import UserManagement from 'src/api/UserManagement.js';
import DropDownHolder from 'src/services/DropdownHolder.js';

const YourLikes = () => {
  const isFocused = useIsFocused();
  const [likesData, setLikesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await getLikedReviews();
    };

    setIsLoading(true);
    fetchData();
  }, [isFocused]);

  const getLikedReviews = async () => {
    const userID = await AsyncStorage.getItem('@userID');
    const response = await UserManagement.getUser(userID);

    if (response.success) {
      response.body.liked_reviews.sort((a, b) => ((a.review.overall_rating > b.review.overall_rating) ? -1 : 1));
      setLikesData(response.body.liked_reviews);
      setIsLoading(false);
    } else {
      DropDownHolder.error('Error', response.error);
    }
  };

  return (
    <View style={styles.main}>
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
            <FlatList
              data={likesData}
              renderItem={({ item }) => (
                <ExpandableReviewWidget
                  review={item.review}
                  location={item.location}
                  myReview
                  likedReviews={[item.review.review_id]}
                />
              )}
              keyExtractor={(item) => item.review.review_id.toString()}
            />
          </>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    padding: 10,
  },
});

export default YourLikes;
