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
  TouchableOpacity,
} from 'react-native';
import { Icon, Input } from '@ui-kitten/components';

import LocationManagement from 'src/api/LocationManagement.js';
import LocationWidget from 'src/components/LocationWidget.js';
import SearchFilterModal from 'src/components/SearchFilterModal.js';
import DropDownHolder from 'src/services/DropdownHolder.js';

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
  }, [search, isRefreshing, page, searchQuery]);

  const searchLocations = async () => {
    // Append the search query to the filters object
    const sendQuery = searchQuery;
    sendQuery.q = search;
    sendQuery.limit = 8;
    sendQuery.offset = page;

    const response = await LocationManagement.searchLocations(sendQuery);

    if (response.success) {
      setCorrectLocation(response.body);
    } else {
      DropDownHolder.error('Error', response.error);
      setLocations([]);
    }

    setIsRefreshing(false);
  };

  const setCorrectLocation = (response) => {
    if (page === 0) {
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
      <View style={styles.searchBarContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
          <Icon style={styles.iconSize} fill="#000000" name="arrow-back" />
        </TouchableOpacity>
        <Input
          placeholder="Search"
          accessoryLeft={searchIcon}
          status="info"
          value={search}
          onChangeText={(value) => setSearch(value)}
          style={styles.searchBarStyle}
          autoFocus
        />
        <TouchableOpacity onPress={toggleModal}>
          <Icon style={styles.iconSize} fill="#000000" name="funnel-outline" />
        </TouchableOpacity>
      </View>

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
            <TouchableOpacity
              onPress={() => navigation.navigate(
                'LocationStackNavigationSearch',
                { screen: 'LocationDetails', params: { locationID: item.location_id } },
              )}
            >
              <LocationWidget location={item} key={item.location_id.toString()} />
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

const searchIcon = (props) => (
  <Icon {...props} name="search" />
);

const styles = StyleSheet.create({
  searchResultsWrapper: {
    flex: 1,
    padding: 10,
  },
  searchBarContainer: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBarStyle: {
    flex: 1,
    marginRight: 10,
  },
  iconSize: {
    height: 28,
    width: 28,
  },
});

export default SearchResults;
