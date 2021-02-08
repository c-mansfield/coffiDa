/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableHighlight } from 'react-native';
import { useIsFocused } from '@react-navigation/native'

import UserManagement from 'src/api/UserManagement.js';
import LocationTile from 'src/components/LocationTile.js';
import LocationManagement from 'src/api/LocationManagement.js';

const Home = ({ navigation }) => {

  const [locationsData, setLocationsData] = useState([]);
  const numColumns = 2;
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchData = async () => {
      let sendQuery = {
        q: 'Manchester'
      };
      let response = await LocationManagement.searchLocations(sendQuery);

      if(response) {
        setLocationsData(response);
      };
    }

    fetchData();
  }, [isFocused]);

  return (
    <View style={styles.main}>
      <Text style={styles.title}>Explore</Text>
      <Text style={styles.subHeading}>Manchester, UK</Text>

      <View style={styles.tileWrapper}>
        <FlatList
            data={locationsData}
            renderItem={({item}) => (
              <TouchableHighlight onPress={() => navigation.navigate('LocationDetails', { location: item })}>
                <LocationTile location={item}/>
              </TouchableHighlight>
            )}
            keyExtractor={(item,index) => item.location_name}
            numColumns={numColumns}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    padding: 15,
    flex: 1
  },
  title: {
    fontSize: 36,
    fontFamily: 'Nunito-Bold'
  },
  subHeading: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular'
  },
  tileWrapper: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

export default Home;
