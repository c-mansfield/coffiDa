/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';

const Login = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title="Home"
        onPress={() => navigation.navigate('BottomTabNavigation')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
});

export default Login;
