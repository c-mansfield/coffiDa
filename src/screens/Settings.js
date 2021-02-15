/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Button, Divider } from '@ui-kitten/components';

import AsyncStorage from '@react-native-async-storage/async-storage';
import UserManagement from 'src/api/UserManagement.js';


const Settings = ({ navigation }) => {

  const isFocused = useIsFocused();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchData = async () => {

      const userID = await AsyncStorage.getItem('@userID')
      let response = await UserManagement.getUser(userID);

      setUserData(response);
    }

    fetchData();
  }, [isFocused]);

  const logoutUser = async () => {
    let response = await UserManagement.logout();

    if (response) {
      await AsyncStorage.clear();
      navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.main}>
      <Text style={styles.title}>{userData.first_name} {userData.last_name}</Text>
      <Text style={styles.subHeading}>{userData.email}</Text>

      <Divider/>

      <View styles={styles.sectionStyle}>
        <Button style={styles.button} status='primary' onPress={() => logoutUser()}>
          Edit details
        </Button>

        <Button style={styles.button} status='primary' onPress={() => logoutUser()}>
          Change Password
        </Button>
      </View>

      <Divider/>

      <View styles={styles.sectionStyle}>
        <Button style={styles.button} status='danger' onPress={() => logoutUser()}>
          Sign Out
        </Button>
      </View>
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
    fontFamily: 'Nunito-Bold'
  },
  subHeading: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular'
  },
  button: {
    marginTop: 10
  }
});

export default Settings;
