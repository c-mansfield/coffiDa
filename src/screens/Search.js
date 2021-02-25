/**
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
  ActivityIndicator,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Icon, Input } from '@ui-kitten/components';

import LocationTile from 'src/components/LocationTile.js';
import LocationManagement from 'src/api/LocationManagement.js';
import DropDownHolder from 'src/services/DropdownHolder.js';

const Search = ({ navigation }) => {
  const [locationsData, setLocationsData] = useState([]);
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await getTopLocations();
    };

    fetchData();
  }, [isFocused]);

  const getTopLocations = async () => {
    const sendQuery = {
      overall_rating: 0,
    };
    const response = await LocationManagement.searchLocations(sendQuery);

    if (response.success) {
      response.body.sort((a, b) => ((a.avg_overall_rating > b.avg_overall_rating) ? -1 : 1));
      setLocationsData(response.body.slice(0, 8)); // Get top 8 locations
      setIsLoading(false);
    } else {
      DropDownHolder.error('Error', response.error);
    }
  };

  return (
    <ScrollView style={styles.main}>
      { isLoading
        ? (
          <>
            <View style={{
              flex: 1, justifyContent: 'center', flexDirection: 'row', padding: 10,
            }}
            >
              <ActivityIndicator />
            </View>
          </>
        ) : (
          <>
            <Text style={styles.title}>Search</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SearchResults')} style={styles.searchBar}>
              <Input
                placeholder="Name, Location, rating..."
                accessoryLeft={searchIcon}
                status="info"
                disabled
              />
            </TouchableOpacity>

            <Text style={styles.subHeading}>Top Rated Locations</Text>
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
                        key={`${location.location_id}_searchTouchableOpacity`}
                      >
                        <LocationTile location={location} key={`${location.location_id}_searchLocationTile`} />
                      </TouchableOpacity>
                    </>
                  ))}
                </>
              )
                : null}
            </View>
          </>
        )}

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
