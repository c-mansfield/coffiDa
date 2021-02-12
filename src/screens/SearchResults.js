/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';
import { SearchBar } from 'react-native-elements';

import LocationManagement from 'src/api/LocationManagement.js';
import LocationWidget from 'src/components/LocationWidget.js'

const SearchResults = () => {

  const [search, setSearch] = useState('');
  const [locations, setLocations] = useState([]);

  const onChangeSearch = async (query) => {
    setSearch(query);
    let sendQuery = {
      q: query
    };
    let response = await LocationManagement.searchLocations(sendQuery);

    if(response) {
      setLocations(response);
    } else {
      setLocations([]);
    };
  };

  return (
    <View>
      <SearchBar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={search}
        lightTheme
        cancelIcon={true}
        containerStyle={{backgroundColor: '#FFFFFF'}}
        inputContainerStyle={{backgroundColor: '#FFFFFF'}}
      />
      <Button
        title="Filters"
        buttonStyle={{backgroundColor: '#247BA0'}}
      />
      <View style={styles.searchResultsWrapper}>
        <FlatList
            data={locations}
            renderItem={({item}) => (
              <LocationWidget location={item}/>
            )}
            keyExtractor={(item,index) => item.location_id.toString()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchResultsWrapper: {
    padding: 15
  }
});

export default SearchResults;
