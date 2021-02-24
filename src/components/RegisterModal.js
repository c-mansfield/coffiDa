import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Modal from 'react-native-modal';
import { Text, Input, Icon } from '@ui-kitten/components';

import UserManagement from 'src/api/UserManagement.js';
import Utilities from 'src/components/Utilities.js';

const RegisterModal = ({ registerModalVisible, toggleRegisterModal }) => {
  const [userDetails, setUserDetails] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [textStatus, setTextStatus] = useState({
    firstName: 'basic', lastName: 'basic', email: 'basic', password: 'basic',
  });
  const [errorMessage, setErrorMessage] = useState({
    main: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    setTextStatus({
      first_name: 'basic', last_name: 'basic', email: 'basic', password: 'basic',
    });
    setErrorMessage({
      main: '', first_name: '', last_name: '', email: '', password: '',
    });
    setUserDetails({
      first_name: '',
      last_name: '',
      email: '',
      password: '',
    });
  }, [registerModalVisible]);

  const signUpUser = async () => {
    const response = await UserManagement.addUser(userDetails);

    if (response.success) {
      setUserDetails({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      });
      toggleRegisterModal();
    } else {
      Keyboard.dismiss()
      updateErrorMessageState(response.error, 'main');
    }
  };

  const checkCanSignUp = async () => {
    const fields = await checkRequiredFields();
    const emailCheck = await testEmail();
    const passwordCheck = await testPassword();

    if (!fields && !emailCheck && !passwordCheck) {
      await signUpUser();
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

  const testPassword = async () => {
    if (await !Utilities.testPasswordValid(userDetails.password)) {
      updateTextStatusState('danger', 'password');
      updateErrorMessageState(
        'Please make sure password is 8 characters and has atleast 1 letter and number', 'password',
      );

      return true;
    }

    updateTextStatusState('basic', 'email');
    updateErrorMessageState('', 'email');

    return false;
  };

  const updateUserDetailsState = (val, field) => {
    setUserDetails((prevState) => ({ ...prevState, [field]: val }));
  };

  const renderIcon = (props) => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'} />
    </TouchableWithoutFeedback>
  );

  const updateTextStatusState = (val, field) => {
    setTextStatus((prevState) => ({ ...prevState, [field]: val }));
  };

  const updateErrorMessageState = (val, field) => {
    setErrorMessage((prevState) => ({ ...prevState, [field]: val }));
  };

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <Modal
      isVisible={registerModalVisible}
      swipeDirection={['down']}
      style={styles.modalMain}
      onBackdropPress={toggleRegisterModal}
    >
      <KeyboardAvoidingView style={styles.modalContent}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.errorMain}>{errorMessage.main}</Text>

        <Text style={styles.inputHeader}>First Name</Text>
        <Input
          style={styles.inputStyle}
          placeholder="First Name"
          onChangeText={(firstNameInput) => updateUserDetailsState(firstNameInput, 'first_name')}
          defaultValue={userDetails.first_name}
          caption={errorMessage.first_name}
          status={textStatus.first_name}
        />

        <Text style={styles.inputHeader}>Last Name</Text>
        <Input
          style={styles.inputStyle}
          placeholder="Last Name"
          onChangeText={(lastNameInput) => updateUserDetailsState(lastNameInput, 'last_name')}
          defaultValue={userDetails.last_name}
          caption={errorMessage.last_name}
          status={textStatus.last_name}
        />

        <Text style={styles.inputHeader}>Email</Text>
        <Input
          style={styles.inputStyle}
          placeholder="Email"
          onChangeText={(emailInput) => updateUserDetailsState(emailInput, 'email')}
          defaultValue={userDetails.email}
          caption={errorMessage.email}
          status={textStatus.email}
        />

        <Text style={styles.inputHeader}>Password</Text>
        <Input
          style={styles.inputStylePassword}
          placeholder="Password"
          secureTextEntry={secureTextEntry}
          onChangeText={(passwordInput) => updateUserDetailsState(passwordInput, 'password')}
          defaultValue={userDetails.password}
          accessoryRight={renderIcon}
          caption={errorMessage.password}
          status={textStatus.password}
        />

        <TouchableOpacity style={styles.registerButton} onPress={() => checkCanSignUp()}>
          <Text style={{ fontFamily: 'Nunito-Bold', fontSize: 18, color: '#FFFFFF' }}>
            REGISTER
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
    fontSize: 32,
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
  inputStylePassword: {
    height: 40,
    marginBottom: 35,
  },
  registerButton: {
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#247BA0',
    marginBottom: 10,
    marginTop: 10,
  },
});

export default RegisterModal;
