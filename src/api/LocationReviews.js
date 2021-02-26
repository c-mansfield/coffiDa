import AsyncStorage from '@react-native-async-storage/async-storage';
import { url, handleUnauthorised, errorMessages } from 'src/api/api.js';

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
        return { success: false, status: response.status, error: errorMessages.badRequest };
      case 401:
        handleUnauthorised();
        return { success: false, status: response.status };
      case 403:
        return { success: false, status: response.status, error: errorMessages.forbiddenRequest };
      case 404:
        return { success: false, status: response.status, error: errorMessages.reviewError };
      case 500:
        return { success: false, status: response.status, error: errorMessages.serverError };
      default:
        return { success: false, status: response.status };
    }
  } catch (error) {
    return { success: false, status: error, error: errorMessages.requestError };
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
        return { success: false, status: response.status, error: errorMessages.badRequest };
      case 401:
        handleUnauthorised();
        return { success: false, status: response.status };
      case 403:
        return { success: false, status: response.status, error: errorMessages.forbiddenRequest };
      case 404:
        return { success: false, status: response.status, error: errorMessages.reviewError };
      case 500:
        return { success: false, status: response.status, error: errorMessages.serverError };
      default:
        return { success: false, status: response.status };
    }
  } catch (error) {
    return { success: false, status: error, error: errorMessages.requestError };
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
        return { success: false, status: response.status, error: errorMessages.serverError };
      default:
        return { success: false, status: response.status };
    }
  } catch (error) {
    return { success: false, status: error, error: errorMessages.requestError };
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
        return { success: false, status: response.status, error: errorMessages.reviewError };
      case 500:
        return { success: false, status: response.status, error: errorMessages.serverError };
      default:
        return { success: false, status: response.status };
    }
  } catch (error) {
    return { success: false, status: error, error: errorMessages.requestError };
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
        return { success: false, status: response.status, error: errorMessages.forbiddenRequest };
      case 404:
        return { success: false, status: response.status, error: errorMessages.reviewError };
      case 500:
        return { success: false, status: response.status, error: errorMessages.serverError };
      default:
        return { success: false, status: response.status };
    }
  } catch (error) {
    return { success: false, status: error, error: errorMessages.requestError };
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
        return { success: false, status: response.status, error: errorMessages.badRequest };
      case 401:
        handleUnauthorised();
        return { success: false, status: response.status };
      case 404:
        return { success: false, status: response.status, error: errorMessages.reviewError };
      case 500:
        return { success: false, status: response.status, error: errorMessages.serverError };
      default:
        return { success: false, status: response.status };
    }
  } catch (error) {
    return { success: false, status: error, error: errorMessages.requestError };
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
        return { success: false, status: response.status, error: errorMessages.badRequest };
      case 401:
        handleUnauthorised();
        return { success: false, status: response.status };
      case 404:
        return { success: false, status: response.status, error: errorMessages.reviewError };
      case 500:
        return { success: false, status: response.status, error: errorMessages.serverError };
      default:
        return { success: false, status: response.status };
    }
  } catch (error) {
    return { success: false, status: error, error: errorMessages.requestError };
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
  removeLikeReview,
};
