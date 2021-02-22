import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import {
  Text, Input, Icon,
} from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';

import UserManagement from 'src/api/UserManagement.js';
import Utilities from 'src/components/Utilities.js';

const LoginModal = ({ navigateHome, loginModalVisible, toggleLoginModal }) => {
  const [userDetails, setUserDetails] = useState({
    email: '',
    password: '',
  });
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [textStatus, setTextStatus] = useState({ email: 'basic', password: 'basic' });
  const [errorMessage, setErrorMessage] = useState({
    main: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    setTextStatus({ email: 'basic', password: 'basic' });
    setErrorMessage({ main: '', email: '', password: '' });
    setUserDetails({ email: '', password: '' });
  }, [loginModalVisible]);

  const loginUser = async () => {
    const response = await UserManagement.login(userDetails);

    if (response.success) {
      setUserDetails({ email: '', password: '' });

      await AsyncStorage.setItem('@token', response.body.token);
      await AsyncStorage.setItem('@userID', response.body.id.toString());

      toggleLoginModal();
      navigateHome();
    } else if (response.status === 400) {
      // Error message username or password incorrect
      updateErrorMessageState('Email or password incorrect, please try again!', 'main');
    } else {
      // Server Error
      updateErrorMessageState('Error on our end sorry, please try again later!', 'main');
    }
  };

  const checkCanLogin = async () => {
    const fields = await checkRequiredFields();
    const emailCheck = await testEmail();

    if (!fields && !emailCheck) {
      await loginUser();
    }
  };

  const checkRequiredFields = () => {
    let error = false;

    Object.keys(userDetails).forEach((key) => {
      if (userDetails[key] === '') {
        updateTextStatusState('danger', key);
        updateErrorMessageState('Required field', key);

        error = true;
      } else {
        updateTextStatusState('basic', key);
        updateErrorMessageState('', key);
      }
    });

    return error;
  };

  const testEmail = async () => {
    if (!Utilities.testEmailValid(userDetails.email)) {
      updateTextStatusState('danger', 'email');
      updateErrorMessageState('Please input email in correct format', 'email');

      return true;
    }

    updateTextStatusState('basic', 'email');
    updateErrorMessageState('', 'email');

    return false;
  };

  const updateUserDetailsState = (val, field) => {
    setUserDetails((prevState) => ({ ...prevState, [field]: val }));
  };

  const updateTextStatusState = (val, field) => {
    setTextStatus((prevState) => ({ ...prevState, [field]: val }));
  };

  const updateErrorMessageState = (val, field) => {
    setErrorMessage((prevState) => ({ ...prevState, [field]: val }));
  };

  const renderIcon = (props) => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'} />
    </TouchableWithoutFeedback>
  );

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <Modal
      isVisible={loginModalVisible}
      swipeDirection={['down']}
      style={styles.modalMain}
      onBackdropPress={toggleLoginModal}
    >
      <KeyboardAvoidingView style={styles.modalContent} keyboardVerticalOffset={200}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.errorMain}>{errorMessage.main}</Text>

        <Text style={styles.inputHeader}>Email</Text>
        <Input
          style={styles.inputStyle}
          placeholder="Email"
          onChangeText={(emailValue) => updateUserDetailsState(emailValue, 'email')}
          defaultValue={userDetails.email}
          status={textStatus.email}
          caption={errorMessage.email}
        />

        <Text style={styles.inputHeader}>Password</Text>
        <Input
          style={styles.inputStyle}
          placeholder="Password"
          secureTextEntry={secureTextEntry}
          onChangeText={(passwordValue) => updateUserDetailsState(passwordValue, 'password')}
          defaultValue={userDetails.password}
          accessoryRight={renderIcon}
          status={textStatus.password}
          caption={errorMessage.password}
        />

        <TouchableOpacity style={styles.loginButton} onPress={() => checkCanLogin()}>
          <Text style={{ fontFamily: 'Nunito-Bold', fontSize: 18, color: '#FFFFFF' }}>
            LOGIN
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalMain: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: 26,
    fontFamily: 'Nunito-Bold',
  },
  errorMain: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    marginBottom: 15,
    color: '#B74171',
    marginTop: 5,
  },
  inputHeader: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    marginBottom: 5,
  },
  inputStyle: {
    height: 40,
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: '#247BA0',
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
});

export default LoginModal;
