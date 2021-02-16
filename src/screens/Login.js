/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import UserManagement from 'src/api/UserManagement.js';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginUser = async () => {
    const toSend = {
      email,
      password,
    };
    const response = await UserManagement.login(toSend);

    if (response) {
      setEmail('');
      setPassword('');

      await AsyncStorage.setItem('@token', response.token);
      await AsyncStorage.setItem('@userID', response.id.toString());

      navigation.navigate('BottomTabNavigation');
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TextInput
        style={{ height: 40 }}
        placeholder="Email"
        onChangeText={(emailValue) => setEmail(emailValue)}
        defaultValue={email}
      />
      <TextInput
        style={{ height: 40 }}
        placeholder="Password"
        onChangeText={(passwordValue) => setPassword(passwordValue)}
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

export default Login;
