import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const url = "http://10.0.2.2:3333/api/1.0.0";

const getLocation = async (locationID) => {
  try {
    let token = await AsyncStorage.getItem('@token');
    return await fetch(url + '/location/' + locationID, {
      headers: {
        'X-Authorization': token
      }
    });
  } catch (error) {
    return error;
  }
}

const favouriteReview = async (locationID) => {
  try {
    let token = await AsyncStorage.getItem('@token');
    let response = await fetch(url + '/location/' + locationID + '/favourite', {
      method: 'post',
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

const unfavouriteReview = async (locationID) => {
  try {
    let token = await AsyncStorage.getItem('@token');
    let response = await fetch(url + '/location/' + locationID + '/favourite', {
      method: 'delete',
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

const searchLocations = async (urlQueries) => {
  try {
    let token = await AsyncStorage.getItem('@token');
    let query = await getUrlQueryString(urlQueries);
    let response = await fetch(url + '/find?' + query, {
      method: 'get',
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

const getUrlQueryString = (urlQueries) => {
  return Object.entries(urlQueries).join('&').replace(/,/g,'=');
}

module.exports = {
  getLocation,
  favouriteReview,
  unfavouriteReview,
  searchLocations
};
