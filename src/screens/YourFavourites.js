/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

import UserManagement from 'src/api/UserManagement.js';
import LocationWidget from 'src/components/LocationWidget.js';

const YourFavourites = () => {
  const isFocused = useIsFocused();
  const [locationsData, setLocationsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userID = await AsyncStorage.getItem('@userID');
      const response = await UserManagement.getUser(userID);

      if (response.favourite_locations) {
        setLocationsData(response.favourite_locations);
      }
    };

    fetchData();
  }, [isFocused]);

  return (
    <View style={styles.main}>
      <FlatList
        data={locationsData}
        renderItem={({ item }) => (
          <LocationWidget location={item} />
        )}
        keyExtractor={(item) => item.location_id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    padding: 10,
  },
});

export default YourFavourites;
