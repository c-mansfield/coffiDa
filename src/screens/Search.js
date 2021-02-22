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
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Icon, Input } from '@ui-kitten/components';

import LocationTile from 'src/components/LocationTile.js';
import LocationManagement from 'src/api/LocationManagement.js';

const Search = ({ navigation }) => {
  const [locationsData, setLocationsData] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchData = async () => {
      const sendQuery = {
        overall_rating: 3,
      };
      const response = await LocationManagement.searchLocations(sendQuery);

      if (response) {
        setLocationsData(response);
      }
    };

    fetchData();
  }, [isFocused]);

  return (
    <ScrollView style={styles.main}>
      <Text style={styles.title}>Search</Text>
      <TouchableOpacity onPress={() => navigation.navigate('SearchResults')} style={styles.searchBar}>
        <Input
          placeholder="Name, Location, rating..."
          accessoryLeft={searchIcon}
          status="info"
          disabled
        />
      </TouchableOpacity>

      <Text style={styles.subHeading}>Top Locations</Text>
      <View style={styles.tileWrapper}>
        { locationsData !== null ? (
          <>
            {locationsData.map((location) => (
              <>
                <TouchableOpacity
                  onPress={() => navigation.navigate(
                    'LocationStackNavigationSearch',
                    { screen: 'LocationDetails', params: { locationID: location.location_id } },
                  )}
                >
                  <LocationTile location={location} />
                </TouchableOpacity>
              </>
            ))}
          </>
        )
          : null}
      </View>
    </ScrollView>
  );
};

const searchIcon = (props) => (
  <Icon {...props} name="search" />
);

const styles = StyleSheet.create({
  main: {
    padding: 15,
    flex: 1,
  },
  title: {
    fontSize: 36,
    fontFamily: 'Nunito-Bold',
  },
  searchBar: {
    marginTop: 5,
  },
  subHeading: {
    fontSize: 18,
    fontFamily: 'Nunito-Regular',
    color: '#707070',
    marginTop: 10,
  },
  tileWrapper: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
});

export default Search;
