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

 import ReviewWidget from 'src/components/ReviewWidget.js';
 import UserManagement from 'src/api/UserManagement.js';

const YourLikes = () => {

  const [likesData, setLikesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {

      const userID = await AsyncStorage.getItem('@userID')
      let response = await UserManagement.getUser(userID);

      setLikesData(response.liked_reviews);
    }

    fetchData();
  }, []);


  return (
    <View style={styles.main}>
      <FlatList
        data={likesData}
        renderItem={({item}) => (
            <ReviewWidget review={item}/>
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

export default YourLikes;
