/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import UserManagement from 'src/api/UserManagement.js';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginUser = async () => {
    let to_send = {
      email: email,
      password: password
    };

    let response = await UserManagement.login(to_send);

    if (response.token) {
      setEmail('');
      setPassword('');

      await AsyncStorage.setItem('@token', response.token)
      navigation.navigate('BottomTabNavigation')
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TextInput
          style={{height: 40}}
          placeholder="Email"
          onChangeText={email => setEmail(email)}
          defaultValue={email}
        />
        <TextInput
          style={{height: 40}}
          placeholder="Password"
          onChangeText={password => setPassword(password)}
          defaultValue={password}
        />
      <Button
        title="Login"
        onPress={() => loginUser()}
      />
      <Text
        onPress={() => navigation.navigate('Register')}
      >
        Sign Up
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
});

export default Login;
