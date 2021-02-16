import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

import ReviewWidget from 'src/components/ReviewWidget.js';
import UserManagement from 'src/api/UserManagement.js';

const YourLikes = () => {
  const isFocused = useIsFocused();
  const [likesData, setLikesData] = useState([]);
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const userID = await AsyncStorage.getItem('@userID')
      const response = await UserManagement.getUser(userID);

      setLikesData(response.liked_reviews);
    };

    fetchData();
  }, [isFocused, refresh]);

  return (
    <View style={styles.main}>
      <FlatList
        data={likesData}
        renderItem={({ item }) => (
          <ReviewWidget
            review={item.review}
            location={item.location}
            myReview
            likedReviews={[item.review.review_id]}
            refresh
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
