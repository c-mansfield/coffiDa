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
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import LocationTile from 'src/components/LocationTile.js';
import LocationManagement from 'src/api/LocationManagement.js';

const Home = ({ navigation }) => {
  const [locationsData, setLocationsData] = useState([]);
  const numColumns = 2;
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchData = async () => {
      const sendQuery = {
        q: 'Manchester',
      };
      const response = await LocationManagement.searchLocations(sendQuery);

      if (response) {
        setLocationsData(response);
      }
    };

    fetchData();
  }, [isFocused]);

  return (
    <View style={styles.main}>
      <Text style={styles.title}>Explore</Text>
      <Text style={styles.subHeading}>Manchester, UK</Text>

      <View style={styles.tileWrapper}>
        <FlatList
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          data={locationsData}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('LocationDetails', { location: item })}>
              <LocationTile location={item} />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.location_name}
          numColumns={numColumns}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    padding: 15,
    flex: 1,
  },
  title: {
    fontSize: 36,
    fontFamily: 'Nunito-Bold',
  },
  subHeading: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
  },
  tileWrapper: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Home;
