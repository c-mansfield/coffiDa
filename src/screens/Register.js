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
  TextInput,
  Button,
} from 'react-native';

import UserManagement from 'src/api/UserManagement.js';

const Register = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signUpUser = async () => {
    const toSend = {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    };
    const response = await UserManagement.addUser(toSend);

    if (response) {
      navigation.navigate('Login');
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TextInput
        style={{ height: 40 }}
        placeholder="First Name"
        onChangeText={(firstNameInput) => setFirstName(firstNameInput)}
        defaultValue={firstName}
      />
      <TextInput
        style={{ height: 40 }}
        placeholder="Last Name"
        onChangeText={(lastNameInput) => setLastName(lastNameInput)}
        defaultValue={lastName}
      />
      <TextInput
        style={{ height: 40 }}
        placeholder="Email"
        onChangeText={(emailInput) => setEmail(emailInput)}
        defaultValue={email}
      />
      <TextInput
        style={{ height: 40 }}
        placeholder="Password"
        onChangeText={(passwordInput) => setPassword(passwordInput)}
        defaultValue={password}
      />
      <Button
        title="Sign Up"
        onPress={() => signUpUser()}
      />
      <Text
        onPress={() => navigation.navigate('Login')}
      >
        Back to Login
      </Text>
    </View>
  );
};

export default Register;
