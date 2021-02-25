/**
 * @format
 * @flow strict-local
*/

import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import {
  Layout,
} from '@ui-kitten/components';

import UserManagement from 'src/api/UserManagement.js';
import LocationWidget from 'src/components/LocationWidget.js';
import DropDownHolder from 'src/services/DropdownHolder.js';

const YourFavourites = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [locationsData, setLocationsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await getFavouriteLocations();
    };

    setIsLoading(true);
    fetchData();
  }, [isFocused]);

  const getFavouriteLocations = async () => {
    const userID = await AsyncStorage.getItem('@userID');
    const response = await UserManagement.getUser(userID);

    if (response.success) {
      response.body.favourite_locations.sort((a, b) => ((a.avg_overall_rating > b.avg_overall_rating) ? -1 : 1));

      setLocationsData(response.body.favourite_locations);
      setIsLoading(false);
    } else {
      DropDownHolder.error('Error', response.error);
    }
  };

  return (
    <Layout level="1" style={styles.main}>
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
            <View style={{ marginTop: 10 }}>
              <FlatList
                data={locationsData}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => navigation.navigate(
                      'LocationStackReviews',
                      { screen: 'LocationDetails', params: { locationID: item.location_id } },
                    )}
                    style={{ marginBottom: 10 }}
                  >
                    <LocationWidget location={item} />
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.location_id.toString()}
              />
            </View>
          </>
        )}
    </Layout>
  );
};

const styles = StyleSheet.create({
  main: {
    paddingLeft: 10,
    paddingRight: 10,
    flex: 1,
  },
});

export default YourFavourites;
