/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';

import UserManagement from 'src/api/UserManagement.js';

const Register = ({ navigation }) => {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signUpUser = async () => {
    let to_send = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password
    };
    let response = await UserManagement.addUser(to_send);

    if (response) {
      navigation.navigate('Login')
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TextInput
        style={{height: 40}}
        placeholder="First Name"
        onChangeText={firstName => setFirstName(firstName)}
        defaultValue={firstName}
      />
      <TextInput
        style={{height: 40}}
        placeholder="Last Name"
        onChangeText={lastName => setLastName(lastName)}
        defaultValue={lastName}
      />
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

const styles = StyleSheet.create({

});

export default Register;
