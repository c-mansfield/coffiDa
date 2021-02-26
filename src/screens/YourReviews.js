/**
 * @format
 * @flow strict-local
*/

import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import {
  Layout, Spinner,
} from '@ui-kitten/components';

import DropDownHolder from 'src/services/DropdownHolder.js';
import ReviewWidget from 'src/components/ReviewWidget.js';
import UserManagement from 'src/api/UserManagement.js';

const YourReviews = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [reviewsData, setReviewsData] = useState([]);
  const [likedReviews, setLikedReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await getReviews();
    };

    setIsLoading(true);
    fetchData();
  }, [isFocused]);

  const getReviews = async () => {
    const userID = await AsyncStorage.getItem('@userID');
    const response = await UserManagement.getUser(userID);

    if (response.success) {
      const likes = await getLikedReviews(response.body);
      response.body.reviews.sort((a, b) => ((a.review.overall_rating > b.review.overall_rating) ? -1 : 1));

      setReviewsData(response.body.reviews);
      setLikedReviews(likes);
      setIsLoading(false);
    } else {
      DropDownHolder.error('Error', response.error);
    }
  };

  const getLikedReviews = async (reviewsFull) => {
    const reviewIDs = [];

    reviewsFull.liked_reviews.forEach((like) => {
      reviewIDs.push(like.review.review_id);
    });

    return reviewIDs;
  };

  return (
    <Layout level="1" style={styles.main}>
      { isLoading
        ? (
          <>
            <View style={{
              flex: 1, justifyContent: 'center', flexDirection: 'row', padding: 10,
            }}
            >
              <Spinner />
            </View>
          </>
        ) : (
          <>
            <View style={{ marginTop: 10 }}>
              <FlatList
                data={reviewsData}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('ViewReview', { reviewID: item.review.review_id, likedReviews })}
                    style={{ marginBottom: 10 }}
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
          </>
        )}
    </Layout>
  );
};

const styles = StyleSheet.create({
  main: {
    paddingLeft: 10,
    paddingRight: 10,
    flex: 1,
  },
});

export default YourReviews;
