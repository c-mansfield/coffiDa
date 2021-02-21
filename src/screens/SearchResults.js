/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Button,
  TouchableOpacity,
} from 'react-native';
import { SearchBar } from 'react-native-elements';

import LocationManagement from 'src/api/LocationManagement.js';
import LocationWidget from 'src/components/LocationWidget.js';
import SearchFilterModal from 'src/components/SearchFilterModal.js';

const SearchResults = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [locations, setLocations] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState({});
  const [page, setPage] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await searchLocations();
    };

    fetchData();
  }, [search, isRefreshing, page]);

  const searchLocations = async () => {
    // Append the search query to the filters object
    const sendQuery = searchQuery;
    sendQuery.q = search;
    sendQuery.limit = 8;
    sendQuery.offset = page;

    const response = await LocationManagement.searchLocations(sendQuery);

    if (response) {
      setCorrectLocation(response);
    } else {
      setLocations([]);
    }

    setIsRefreshing(false);
  };

  const setCorrectLocation = (response) => {
    if (page === 0) {
      setLocations([]);
      setLocations(response);
    } else {
      setLocations([...locations, ...response]);
    }
  };

  const handleNextPageSearch = async () => {
    const nextPageNumber = page + 1;

    setPage(nextPageNumber);
  };

  const handleRefreshSearch = async () => {
    setPage(0);
    setIsRefreshing(true);
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <View style={{ flex: 1 }}>
      <SearchBar
        placeholder="Search"
        onChangeText={(value) => setSearch(value)}
        value={search}
        lightTheme
        cancelIcon
        containerStyle={{ backgroundColor: '#FFFFFF' }}
        inputContainerStyle={{ backgroundColor: '#FFFFFF' }}
      />
      <Button
        title="Filters"
        buttonStyle={{ backgroundColor: '#247BA0' }}
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
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('LocationDetailsSearch', { location: item })}>
              <LocationWidget location={item} />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.location_id.toString()}
          refreshing={isRefreshing}
          onRefresh={() => handleRefreshSearch()}
          onEndReached={() => handleNextPageSearch()}
          onEndReachedThreshold={0}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchResultsWrapper: {
    flex: 1,
    padding: 10
  },
});

export default SearchResults;
