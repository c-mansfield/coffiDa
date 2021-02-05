/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import UserManagement from 'src/api/UserManagement.js';

const Settings = ({ navigation }) => {

  const logoutUser = async () => {
    let response = await UserManagement.logout();

    if (response) {
      await AsyncStorage.setItem('@token', '')
      navigation.navigate('Login')
    }
  };

  return (
    <Button
      title="Logout"
      onPress={() => logoutUser()}
    />
  );
};

const styles = StyleSheet.create({

});

export default Settings;
