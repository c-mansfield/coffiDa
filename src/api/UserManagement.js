import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const url = "http://10.0.2.2:3333/api/1.0.0";

const addUser = async (data) => {
  try {
    let response = await fetch(url + '/user', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if(response.status == 201) {
      return await response.json();
    }
  } catch (error) {
    return error;
  }
}

const login = async (data) => {
  try {
    let response = await fetch(url + '/user/login', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if(response.status == 200) {
      return await response.json();
    }
  } catch (error) {
    return error;
  }
}

const logout = async () => {
  try {
    const token = await AsyncStorage.getItem('@token');
    let response = await fetch(url + '/user/logout', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token
      }
    });

    if(response.status == 200) {
      return await response.json();
    }
  } catch (error) {
    return error;
  }
}

const getUser = async (userID) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    let response = await fetch(url + '/user/' + userID, {
      headers: {
        'X-Authorization': token
      }
    });

    if(response.status == 200) {
      return await response.json();
    }
  } catch (error) {
    return error;
  }
}

const updateUser = async (userID, data) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    let response = await fetch(url + '/user/' + userID, {
      method: 'patch',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token
      },
      body: JSON.stringify(data)
    });

    if(response.status == 200) {
      return await response.json();
    }
  } catch (error) {
    return error;
  }
}

module.exports = {
  addUser,
  login,
  logout,
  getUser,
  updateUser
}
