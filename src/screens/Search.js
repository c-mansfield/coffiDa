/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const Search = ({ navigation }) => {
  return (
    <View>
      <Text>Search</Text>
      <Button
        onPress={() => navigation.navigate('SearchResults')}
        title="Search Results"
        color="#841584"
      />
    </View>
  );
};

const styles = StyleSheet.create({



});

export default Search;
