/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

import UserManagement from 'src/api/UserManagement.js';
import LocationTile from 'src/components/LocationTile.js';

const Home = () => {
  return (
    <View style={styles.main}>
      <Text style={styles.title}>Explore</Text>
      <Text style={styles.subHeading}>Manchester, UK</Text>

      <View style={styles.tileWrapper}>
        <LocationTile />
        <LocationTile />
      </View>
    </View>
  );
};

const testApi = async () => {

  let to_send = {
    email: 'cole@email.com',
    password: 'password'
  };

  let res = await UserManagement.login(to_send);

  console.log(res);

}

const styles = StyleSheet.create({
  main: {
    padding: 15,
    flex: 1
  },
  title: {
    fontSize: 36,
    fontFamily: 'Nunito-Bold'
  },
  subHeading: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular'
  },
  tileWrapper: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

export default Home;
