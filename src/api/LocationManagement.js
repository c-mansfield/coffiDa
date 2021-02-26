import AsyncStorage from '@react-native-async-storage/async-storage';
import { url, handleUnauthorised, errorMessages } from 'src/api/api.js';

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
        return { success: false, status: response.status, error: errorMessages.locationError };
      case 500:
        return { success: false, status: response.status, error: errorMessages.serverError };
      default:
        return { success: false, status: response.status };
    }
  } catch (error) {
    return { success: false, status: error, error: errorMessages.requestError };
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
        return { success: false, status: response.status, error: errorMessages.badRequest };
      case 401:
        handleUnauthorised();
        return { success: false, status: response.status };
      case 404:
        return { success: false, status: response.status, error: errorMessages.locationError };
      case 500:
        return { success: false, status: response.status, error: errorMessages.serverError };
      default:
        return { success: false, status: response.status };
    }
  } catch (error) {
    return { success: false, status: error, error: errorMessages.requestError };
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
        return { success: false, status: response.status, error: errorMessages.forbiddenRequest };
      case 404:
        return { success: false, status: response.status, error: errorMessages.locationError };
      case 500:
        return { success: false, status: response.status, error: errorMessages.serverError };
      default:
        return { success: false, status: response.status };
    }
  } catch (error) {
    return { success: false, status: error, error: errorMessages.requestError };
  }
};

const searchLocations = async (urlQueries) => {
  try {
    const query = await getUrlQueryString(urlQueries);
    const token = await AsyncStorage.getItem('@token');
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
        return { success: false, status: response.status, error: errorMessages.badRequest };
      case 401:
        handleUnauthorised();
        return { success: false, status: response.status };
      case 500:
        return { success: false, status: response.status, error: errorMessages.serverError };
      default:
        return { success: false, status: response.status };
    }
  } catch (error) {
    return { success: false, status: error, error: errorMessages.requestError };
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
