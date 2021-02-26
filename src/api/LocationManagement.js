import AsyncStorage from '@react-native-async-storage/async-storage';
import { url, handleUnauthorised } from 'src/api/api.js';

const getLocation = async (locationID) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    const response = await fetch(`${url}/location/${locationID}`, {
      headers: {
        'X-Authorization': token,
      },
    });

    switch (response.status) {
      case 200:
        return { success: true, status: response.status, body: await response.json() };
      case 404:
        return { success: false, status: response.status, error: 'Location not found' };
      case 500:
        return { success: false, status: response.status, error: 'Our server is having a break, please try again later!' };
      default:
        return { success: false, status: response.status };
    }
  } catch (error) {
    return { success: false, status: error, error: 'Error making request!' };
  }
};

const favouriteReview = async (locationID) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    const response = await fetch(`${url}/location/${locationID}/favourite`, {
      method: 'post',
      headers: {
        'X-Authorization': token,
      },
    });

    switch (response.status) {
      case 200:
        return { success: true, status: response.status };
      case 400:
        return { success: false, status: response.status, error: 'Bad request, please try again!' };
      case 401:
        handleUnauthorised();
        return { success: false, status: response.status };
      case 404:
        return { success: false, status: response.status, error: 'Location not found' };
      case 500:
        return { success: false, status: response.status, error: 'Our server is having a break, please try again later!' };
      default:
        return { success: false, status: response.status };
    }
  } catch (error) {
    return { success: false, status: error, error: 'Error making request!' };
  }
};

const unfavouriteReview = async (locationID) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    const response = await fetch(`${url}/location/${locationID}/favourite`, {
      method: 'delete',
      headers: {
        'X-Authorization': token,
      },
    });

    switch (response.status) {
      case 200:
        return { success: true, status: response.status };
      case 401:
        handleUnauthorised();
        return { success: false, status: response.status };
      case 403:
        return { success: false, status: response.status, error: 'Forbidden request' };
      case 404:
        return { success: false, status: response.status, error: 'Location not found' };
      case 500:
        return { success: false, status: response.status, error: 'Our server is having a break, please try again later!' };
      default:
        return { success: false, status: response.status };
    }
  } catch (error) {
    return { success: false, status: error, error: 'Error making request!' };
  }
};

const searchLocations = async (urlQueries) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    const query = await getUrlQueryString(urlQueries);
    const response = await fetch(`${url}/find?${query}`, {
      method: 'get',
      headers: {
        'X-Authorization': token,
      },
    });

    switch (response.status) {
      case 200:
        return { success: true, status: response.status, body: await response.json() };
      case 400:
        return { success: false, status: response.status, error: 'Bad request, please try again!' };
      case 401:
        handleUnauthorised();
        return { success: false, status: response.status };
      case 500:
        return { success: false, status: response.status, error: 'Our server is having a break, please try again later!' };
      default:
        return { success: false, status: response.status };
    }
  } catch (error) {
    return { success: false, status: error, error: 'Error making request!' };
  }
};

const getUrlQueryString = (urlQueries) => {
  return Object.entries(urlQueries).join('&').replace(/,/g, '=');
};

module.exports = {
  getLocation,
  favouriteReview,
  unfavouriteReview,
  searchLocations,
};
