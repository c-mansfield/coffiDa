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

const Home = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home</Text>
      <Button
        onPress={() => testApi()}
        title="Learn More"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
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



});

export default Home;
