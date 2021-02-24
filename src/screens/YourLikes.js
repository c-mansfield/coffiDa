import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

import ExpandableReviewWidget from 'src/components/ExpandableReviewWidget.js';
import UserManagement from 'src/api/UserManagement.js';
import DropDownHolder from 'src/services/DropdownHolder.js';

const YourLikes = () => {
  const isFocused = useIsFocused();
  const [likesData, setLikesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await getLikedReview();
    };

    fetchData();
  }, [isFocused]);

  const getLikedReview = async () => {
    const userID = await AsyncStorage.getItem('@userID')
    const response = await UserManagement.getUser(userID);

    if (response.success) {
      setLikesData(response.body.liked_reviews);
    } else {
      DropDownHolder.error('Error', response.error);
    }
  };

  return (
    <View style={styles.main}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    padding: 10,
  },
});

export default YourLikes;
