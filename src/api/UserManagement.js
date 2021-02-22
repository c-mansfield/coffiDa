import AsyncStorage from '@react-native-async-storage/async-storage';

const url = 'http://10.0.2.2:3333/api/1.0.0';

const addUser = async (data) => {
  try {
    const response = await fetch(`${url}/user`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.status === 201) {
      const body = await response.json();
      return { success: true, status: response.status, body };
    }

    return { success: false, status: response.status };
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
    if (response.status === 200) {
      return { success: true, status: response.status, body: await response.json() };
    }

    return { success: false, status: response.status };
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

    if (response.status === 200) {
      return { success: true, status: response.status };
    }

    return { success: false, status: response.status };
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

    if (response.status === 200) {
      return { success: true, status: response.status, body: await response.json() };
    }

    return { success: false, status: response.status };
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

    if (response.status === 200) {
      return { success: true, status: response.status };
    }

    return { success: false, status: response.status };
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
