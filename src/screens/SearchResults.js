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
import Modal from 'react-native-modal';

import LocationManagement from 'src/api/LocationManagement.js';
import LocationWidget from 'src/components/LocationWidget.js';
import SearchFilterModal from 'src/components/SearchFilterModal.js';

const SearchResults = () => {

  const [search, setSearch] = useState('');
  const [locations, setLocations] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState({});

  const onSearchChange = (query) => {
    setSearch(query);
    searchLocations();
  };

  const searchLocations = async () => {
    // Append the search query to the filters object
    let sendQuery = searchQuery;
    sendQuery['q'] = search;

    let response = await LocationManagement.searchLocations(sendQuery);

    console.log(response);

    if(response) {
      setLocations(response);
    } else {
      setLocations([]);
    };
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible)
  };

  return (
    <View>
      <SearchBar
        placeholder="Search"
        onChangeText={onSearchChange}
        value={search}
        lightTheme
        cancelIcon={true}
        containerStyle={{backgroundColor: '#FFFFFF'}}
        inputContainerStyle={{backgroundColor: '#FFFFFF'}}
      />
      <Button
        title="Filters"
        buttonStyle={{backgroundColor: '#247BA0'}}
        onPress={toggleModal}
      />
      <SearchFilterModal
        modalVisible={modalVisible}
        toggleModal={toggleModal}
        setSearchQuery={setSearchQuery}
        searchLocations={searchLocations}
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
  },
});

export default SearchResults;
