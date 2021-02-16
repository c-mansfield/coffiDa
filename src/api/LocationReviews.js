import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const url = "http://10.0.2.2:3333/api/1.0.0";

const addReview = async (locationID, data) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    let response = await fetch(url + '/location/' + locationID + '/review', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token
      },
      body: JSON.stringify(data)
    });

    if(response.status == 201) {
      return await response.json();
    }
  } catch (error) {
    return error;
  };
};

const updateReview = async (locationID, reviewID, data) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    return await fetch(url + '/location/' + locationID + '/review/' + reviewID, {
      method: 'patch',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token
      },
      body: JSON.stringify(data)
    });
  } catch (error) {
    return error;
  };
};

const deleteReview = async (locationID, reviewID) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    return await fetch(url + '/location/' + locationID + '/review/' + reviewID, {
      method: 'delete',
      headers: {
        'X-Authorization': token
      }
    });
  } catch (error) {
    return error;
  };
};

const getReviewPhoto = async (locationID, reviewID) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    return await fetch(url + '/location/' + locationID + '/review/' + reviewID + '/photo', {
      headers: {
        'X-Authorization': token
      }
    });
  } catch (error) {
    return error;
  };
};

const addReviewPhoto = async (locationID, reviewID, data) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    return await fetch(url + '/location/' + locationID + '/review/' + reviewID + '/photo', {
      method: 'post',
      headers: {
        'Content-Type': 'application/octet-stream',
        'X-Authorization': token
      },
      body: JSON.stringify(data)
    });
  } catch (error) {
    return error;
  };
};

const deleteReviewPhoto = async (locationID, reviewID) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    return await fetch(url + '/location/' + locationID + '/review/' + reviewID + '/photo', {
      method: 'delete',
      headers: {
        'X-Authorization': token
      }
    });
  } catch (error) {
    return error;
  };
};

const likeReview = async (locationID, reviewID) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    console.log();
    return await fetch(url + '/location/' + locationID + '/review/' + reviewID + '/like', {
      method: 'post',
      headers: {
        'X-Authorization': token
      }
    });
  } catch (error) {
    return error;
  };
};

const removeLikeReview = async (locationID, reviewID) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    return await fetch(url + '/location/' + locationID + '/review/' + reviewID + '/like', {
      method: 'delete',
      headers: {
        'X-Authorization': token
      }
    });
  } catch (error) {
    return error;
  };
};

module.exports = {
  addReview,
  updateReview,
  deleteReview,
  getReviewPhoto,
  addReviewPhoto,
  deleteReviewPhoto,
  likeReview,
  removeLikeReview
}
