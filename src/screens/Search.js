/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Button, Layout } from '@ui-kitten/components';

const Search = ({ navigation }) => {
  return (
    <View style={styles.main}>
      <Text style={styles.title}>Search</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SearchResults')}>
          <View style={styles.searchBar}>
            <Image
              style={styles.searchIcon}
              source={require('assets/images/search.png')}
            />
            <Text style={{fontSize: 14, fontFamily: 'Nunito-Regular', color: '#707070', flex: 1 }}>Name, Location, rating...</Text>
          </View>
        </TouchableOpacity>
        <Button style={styles.button} status='basic' accessoryLeft={require('assets/images/search.png')}>
          Name, Location, rating...
        </Button>
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
    flexDirection: 'row'
  },
  searchBar: {
    textAlign: 'left',
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderColor: 'rgb(224, 224, 224)',
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row'
  },
  searchIcon: {
    width: 16,
    height: 16,
    justifyContent: 'center',
  }
});

export default Search;
