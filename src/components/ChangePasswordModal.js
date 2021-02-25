/**
 * @format
 * @flow strict-local
*/

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import {
  Text,
  Input,
  Layout,
  Icon,
} from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarPasswordStrengthDisplay } from 'react-native-password-strength-meter';
import PropTypes from 'prop-types';

import DropDownHolder from 'src/services/DropdownHolder.js';
import UserManagement from 'src/api/UserManagement.js';
import Utilities from 'src/components/Utilities.js';

const ChangePasswordModal = (props) => {
  const newPasswordMessage = 'Password should be greater than 8 characters and have atleast 1 letter and number';
  const [secureTextEntryOld, setSecureTextEntryOld] = useState(true);
  const [secureTextEntryNew, setSecureTextEntryNew] = useState(true);
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });
  const [textStatus, setTextStatus] = useState({ oldPassword: 'basic', newPassword: 'basic' });
  const [errorMessage, setErrorMessage] = useState({
    oldPassword: '', newPassword: newPasswordMessage, main: '',
  });

  useEffect(() => {
    setPasswords({ oldPassword: '', newPassword: '' });
    setErrorMessage({ oldPassword: '', newPassword: newPasswordMessage });
    setTextStatus({ oldPassword: 'basic', newPassword: 'basic' });
  }, []);

  const changePassword = async () => {
    const fields = await checkRequiredFields();
    const emailCheck = await testPassword();

    if (!fields && !emailCheck) {
      const oldPassed = await checkOldPassword();

      if (oldPassed) {
        await updatePassword();
      }
    }
  };

  const updatePassword = async () => {
    const response = await UserManagement.updateUser(props.userData.user_id, { password: passwords.newPassword });

    if (response.success) {
      props.toggleModalPassword();
      DropDownHolder.success('Success', 'Password has been updated!');
    } else {
      updateErrorMessageState(response.error, 'main');
    }
  };

  const checkOldPassword = async () => {
    const toSend = {
      email: props.userData.email,
      password: passwords.oldPassword,
    };
    const response = await UserManagement.login(toSend);

    if (response.success) {
      await AsyncStorage.setItem('@token', response.body.token);
      return true;
    }

    updateTextStatusState('danger', 'oldPassword');
    updateErrorMessageState('Old password incorrect', 'oldPassword');
    return false;
  };

  const testPassword = async () => {
    updateErrorMessageState(newPasswordMessage, 'newPassword');

    if (await !Utilities.testPasswordValid(passwords.newPassword)) {
      updateTextStatusState('danger', 'newPassword');

      return true;
    }

    updateTextStatusState('basic', 'newPassword');

    return false;
  };

  const checkRequiredFields = () => {
    let error = false;

    Object.keys(passwords).forEach((key) => {
      if (passwords[key] === '') {
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

  const toggleSecureTextEntryOld = (field) => {
    setSecureTextEntryOld(!secureTextEntryOld);
  };

  const toggleSecureTextEntryNew = (field) => {
    setSecureTextEntryNew(!secureTextEntryNew);
  };

  const renderSecureIconOld = (props) => (
    <TouchableWithoutFeedback onPress={toggleSecureTextEntryOld}>
      <Icon {...props} name={secureTextEntryOld ? 'eye-off' : 'eye'} />
    </TouchableWithoutFeedback>
  );

  const renderSecureIconNew = (props) => (
    <TouchableWithoutFeedback onPress={toggleSecureTextEntryNew}>
      <Icon {...props} name={secureTextEntryNew ? 'eye-off' : 'eye'} />
    </TouchableWithoutFeedback>
  );

  const updatePasswordsState = (val, field) => {
    setPasswords((prevState) => ({ ...prevState, [field]: val }));
  };

  const updateTextStatusState = (val, field) => {
    setTextStatus((prevState) => ({ ...prevState, [field]: val }));
  };

  const updateErrorMessageState = (val, field) => {
    setErrorMessage((prevState) => ({ ...prevState, [field]: val }));
  };

  return (
    <Modal
      isVisible={props.modalPasswordVisible}
      swipeDirection={['down']}
      style={styles.modalMain}
      onBackdropPress={props.toggleModalPassword}
    >
      <Layout style={styles.modalContent} level="1">
        <Text category="h3">Change Password</Text>
        <Text status="danger" category="c1">{errorMessage.main}</Text>

        <View style={styles.sectionStyle}>
          <Text category="s1">Old Password</Text>
          <Input
            value={passwords.oldPassword}
            onChangeText={(value) => updatePasswordsState(value, 'oldPassword')}
            placeholder="Enter old password"
            accessoryRight={renderSecureIconOld}
            secureTextEntry={secureTextEntryOld}
            style={styles.inputBox}
            status={textStatus.oldPassword}
            caption={errorMessage.oldPassword}
          />
        </View>

        <View style={styles.sectionStyle}>
          <Text category="s1">New Password</Text>
          <Input
            value={passwords.newPassword}
            onChangeText={(value) => updatePasswordsState(value, 'newPassword')}
            placeholder="Enter new password"
            accessoryRight={renderSecureIconNew}
            secureTextEntry={secureTextEntryNew}
            style={styles.inputBox}
            status={textStatus.newPassword}
            caption={errorMessage.newPassword}
            captionIcon={AlertIcon}
          />
        </View>
        <BarPasswordStrengthDisplay
          password={passwords.newPassword}
          barContainerStyle={{ alignSelf: 'center' }}
          width={350}
        />

        <TouchableOpacity style={styles.updateButton} onPress={() => changePassword()}>
          <Text style={{ color: '#FFFFFF' }} category="h6">
            Update
          </Text>
        </TouchableOpacity>
      </Layout>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalMain: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    padding: 22,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  sectionStyle: {
    height: 110,
  },
  button: {
    marginTop: 20,
  },
  inputBox: {
    marginTop: 5,
    height: 10,
  },
  updateButton: {
    backgroundColor: '#247BA0',
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
});

ChangePasswordModal.propTypes = {
  modalPasswordVisible: PropTypes.bool.isRequired,
  toggleModalPassword: PropTypes.func.isRequired,
  userData: PropTypes.object.isRequired,
};

const AlertIcon = (props) => (
  <Icon {...props} name="alert-circle-outline"/>
);

export default ChangePasswordModal;
