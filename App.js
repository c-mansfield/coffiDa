/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Login from './src/screens/Login.js';
import MainStackNavigation from './src/navigation/MainStackNavigation.js';

const App = () => {
  return (
    <MainStackNavigation/>
  );
};

const styles = StyleSheet.create({

});

export default App;
