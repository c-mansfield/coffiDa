/**
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
import {
  Icon, Input, Layout,
} from '@ui-kitten/components';

import LocationManagement from 'src/api/LocationManagement.js';
import LocationWidget from 'src/components/LocationWidget.js';
import SearchFilterModal from 'src/components/SearchFilterModal.js';
import DropDownHolder from 'src/services/DropdownHolder.js';

const SearchResults = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [locations, setLocations] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (searchQuery !== '') {
        await searchLocations();
      }
    };

    fetchData();
  }, [search, searchQuery]);

  const searchLocations = async () => {
    // Append the search query to the filters object
    const sendQuery = searchQuery;
    sendQuery.q = search;
    sendQuery.limit = 10;

    const response = await LocationManagement.searchLocations(sendQuery);

    if (response.success) {
      setLocations(response.body);
    } else {
      DropDownHolder.error('Error', response.error);
      setLocations([]);
    }
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <Layout level="1" style={{ flex: 1 }}>
      <Layout level="3" style={styles.searchBarContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
          <Icon style={styles.iconSize} fill="#50514F" name="arrow-back" />
        </TouchableOpacity>
        <Input
          placeholder="Search"
          accessoryLeft={searchIcon}
          value={search}
          onChangeText={(value) => setSearch(value)}
          style={styles.searchBarStyle}
          autoFocus
        />
        <TouchableOpacity onPress={toggleModal}>
          <Icon style={styles.iconSize} fill="#50514F" name="funnel" />
        </TouchableOpacity>
      </Layout>

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
          keyExtractor={(item) => item.location_id.toString() + Math.floor(Math.random() * 100)}
        />
      </View>
    </Layout>
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
