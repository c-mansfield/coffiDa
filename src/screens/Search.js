/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Image, FlatList, TouchableHighlight } from 'react-native';
import { useIsFocused } from '@react-navigation/native'

import LocationTile from 'src/components/LocationTile.js';
import LocationManagement from 'src/api/LocationManagement.js';

const Search = ({ navigation }) => {

  const [locationsData, setLocationsData] = useState([]);
  const numColumns = 2;
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchData = async () => {
      let sendQuery = {
        overall_rating: 4
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
      <Text style={styles.title}>Search</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SearchResults')}>
          <View style={styles.searchBar}>
            <Icon style={styles.searchIcon} fill={'#000000'} name={'search'} />
            <Text style={{fontSize: 14, fontFamily: 'Nunito-Regular', color: '#707070', flex: 1 }}>Name, Location, rating...</Text>
          </View>
        </TouchableOpacity>

        <Text style={{fontSize: 18, fontFamily: 'Nunito-Regular', color: '#707070' }}>Top Locations</Text>
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
  searchBar: {
    textAlign: 'left',
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderColor: 'rgb(224, 224, 224)',
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    height: 100
  },
  searchIcon: {
    width: 16,
    height: 16,
    justifyContent: 'center',
  },
  tileWrapper: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

export default Search;
