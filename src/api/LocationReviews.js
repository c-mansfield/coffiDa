import AsyncStorage from '@react-native-async-storage/async-storage';
import { url, handleUnauthorised } from 'src/api/api.js';

const addReview = async (locationID, data) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    const response = await fetch(`${url}/location/${locationID}/review`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
      body: JSON.stringify(data),
    });

    switch (response.status) {
      case 201:
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

const updateReview = async (locationID, reviewID, data) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    const response = await fetch(`${url}/location/${locationID}/review/${reviewID}`, {
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
        return { success: false, status: response.status, error: 'Bad request, please try again!' };
      case 401:
        handleUnauthorised();
        return { success: false, status: response.status };
      case 403:
        return { success: false, status: response.status, error: 'Forbidden request' };
      case 404:
        return { success: false, status: response.status, error: 'Review not found' };
      case 500:
        return { success: false, status: response.status, error: 'Our server is having a break, please try again later!' };
      default:
        return { success: false, status: response.status };
    }
  } catch (error) {
    return { success: false, status: error, error: 'Error making request!' };
  }
};

const deleteReview = async (locationID, reviewID) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    const response = await fetch(`${url}/location/${locationID}/review/${reviewID}`, {
      method: 'delete',
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
      case 403:
        return { success: false, status: response.status, error: 'Forbidden request' };
      case 404:
        return { success: false, status: response.status, error: 'Review not found' };
      case 500:
        return { success: false, status: response.status, error: 'Our server is having a break, please try again later!' };
      default:
        return { success: false, status: response.status };
    }
  } catch (error) {
    return { success: false, status: error, error: 'Error making request!' };
  }
};

const getReviewPhoto = async (locationID, reviewID) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    const response = await fetch(`${url}/location/${locationID}/review/${reviewID}/photo`, {
      headers: {
        'X-Authorization': token,
      },
    });

    switch (response.status) {
      case 200:
        return { success: true, status: response.status, body: await response.blob() };
      case 404:
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

const addReviewPhoto = async (locationID, reviewID, data) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    const response = await fetch(`${url}/location/${locationID}/review/${reviewID}/photo`, {
      method: 'post',
      headers: {
        'Content-Type': 'image/jpeg',
        'X-Authorization': token,
      },
      body: data,
    });

    switch (response.status) {
      case 200:
        return { success: true, status: response.status };
      case 400:
        return { success: false, status: response.status, error: 'Issue with uploading photo to review, please try again!' };
      case 401:
        handleUnauthorised();
        return { success: false, status: response.status };
      case 404:
        return { success: false, status: response.status, error: 'Review not found' };
      case 500:
        return { success: false, status: response.status, error: 'Our server is having a break, please try again later!' };
      default:
        return { success: false, status: response.status };
    }
  } catch (error) {
    return { success: false, status: error, error: 'Error making request!' };
  }
};

const deleteReviewPhoto = async (locationID, reviewID) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    const response = await fetch(`${url}/location/${locationID}/review/${reviewID}/photo`, {
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
        return { success: false, status: response.status, error: 'Review not found' };
      case 500:
        return { success: false, status: response.status, error: 'Our server is having a break, please try again later!' };
      default:
        return { success: false, status: response.status };
    }
  } catch (error) {
    return { success: false, status: error, error: 'Error making request!' };
  }
};

const likeReview = async (locationID, reviewID) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    const response = await fetch(`${url}/location/${locationID}/review/${reviewID}/like`, {
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
        return { success: false, status: response.status, error: 'Review not found' };
      case 500:
        return { success: false, status: response.status, error: 'Our server is having a break, please try again later!' };
      default:
        return { success: false, status: response.status };
    }
  } catch (error) {
    return { success: false, status: error, error: 'Error making request!' };
  }
};

const removeLikeReview = async (locationID, reviewID) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    const response = await fetch(`${url}/location/${locationID}/review/${reviewID}/like`, {
      method: 'delete',
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
        return { success: false, status: response.status, error: 'Review not found' };
      case 500:
        return { success: false, status: response.status, error: 'Our server is having a break, please try again later!' };
      default:
        return { success: false, status: response.status };
    }
  } catch (error) {
    return { success: false, status: error, error: 'Error making request!' };
  }
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
