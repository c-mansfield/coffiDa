import AsyncStorage from '@react-native-async-storage/async-storage';
import { url, handleUnauthorised } from 'src/api/api.js';

const addUser = async (data) => {
  try {
    const response = await fetch(`${url}/user`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    switch (response.status) {
      case 201:
        return { success: true, status: response.status, body: await response.json() };
      case 400:
        return { success: false, status: response.status, error: 'Error with signing up, email already in use!' };
      case 500:
        return { success: false, status: response.status, error: 'Our server is having a break, please try again later!' };
      default:
        return { success: false, status: response.status };
    }
  } catch (error) {
    return error;
  }
};

const login = async (data) => {
  try {
    const response = await fetch(`${url}/user/login`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    switch (response.status) {
      case 200:
        return { success: true, status: response.status, body: await response.json() };
      case 400:
        return { success: false, status: response.status, error: 'Email or password incorrect, please try again!' };
      case 500:
        return { success: false, status: response.status, error: 'Our server is having a break, please try again later!' };
      default:
        return { success: false, status: response.status };
    }
  } catch (error) {
    return error;
  }
};

const logout = async () => {
  try {
    const token = await AsyncStorage.getItem('@token');
    const response = await fetch(`${url}/user/logout`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
    });

    switch (response.status) {
      case 200:
        return { success: true, status: response.status };
      case 401:
        handleUnauthorised();
        return { success: false, status: response.status };
      case 500:
        return { success: false, status: response.status, error: 'Our server is having a break, please try again later!' };
      default:
        return { success: false, status: response.status };
    }
  } catch (error) {
    return error;
  }
};

const getUser = async (userID) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    const response = await fetch(`${url}/user/${userID}`, {
      headers: {
        'X-Authorization': token,
      },
    });

    switch (response.status) {
      case 200:
        return { success: true, status: response.status, body: await response.json() };
      case 401:
        handleUnauthorised();
        return { success: false, status: response.status };
      case 404:
        return { success: false, status: response.status, error: 'User not found' };
      case 500:
        return { success: false, status: response.status, error: 'Our server is having a break, please try again later!' };
      default:
        return { success: false, status: response.status };
    }
  } catch (error) {
    return error;
  }
};

const updateUser = async (userID, data) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    const response = await fetch(`${url}/user/${userID}`, {
      method: 'patch',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
      body: JSON.stringify(data),
    });

    switch (response.status) {
      case 200:
        return { success: true, status: response.status };
      case 400:
        return { success: false, status: response.status, error: 'Email already in use, please try again!' };
      case 401:
        handleUnauthorised();
        return { success: false, status: response.status };
      case 403:
        return { success: false, status: response.status, error: 'Request forbidden' };
      case 500:
        return { success: false, status: response.status, error: 'Our server is having a break, please try again later!' };
      default:
        return { success: false, status: response.status };
    }
  } catch (error) {
    return error;
  }
};

module.exports = {
  addUser,
  login,
  logout,
  getUser,
  updateUser,
};
