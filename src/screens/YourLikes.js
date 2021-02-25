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
import {
  Layout,
} from '@ui-kitten/components';

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
    <Layout level="1" style={styles.main}>
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
            <View style={{ marginTop: 10 }}>
              <FlatList
                data={likesData}
                renderItem={({ item }) => (
                  <View style={{ marginBottom: 10 }}>
                    <ExpandableReviewWidget
                      review={item.review}
                      location={item.location}
                      myReview
                      likedReviews={[item.review.review_id]}
                    />
                  </View>
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

export default YourLikes;
