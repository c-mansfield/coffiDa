import React, { useState, useEffect, useRef } from 'react';
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
  Button,
  Icon,
} from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { BarPasswordStrengthDisplay } from 'react-native-password-strength-meter';
import PropTypes from 'prop-types';

import DropDownHolder from 'src/services/DropdownHolder.js';
import UserManagement from 'src/api/UserManagement.js';

const ChangePasswordModal = (props) => {
  const isFocused = useIsFocused();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [secureTextEntryOld, setSecureTextEntryOld] = useState(true);
  const [secureTextEntryNew, setSecureTextEntryNew] = useState(true);
  const [textStatus, setTextStatus] = useState({ oldPassword: 'basic', newPassword: 'basic' });
  const [errorMessage, setErrorMessage] = useState({
    oldPassword: '',
    newPassword: '',
  });


  useEffect(() => {
    setOldPassword('');
    setNewPassword('');
  }, [isFocused]);

  const changePassword = async () => {
    const fields = await checkRequiredFields();
    const emailCheck = await testEmail();

    if (!fields && !emailCheck) {
      await updatePassword();
    }
  };

  const updatePassword = async () => {
    const response = await UserManagement.updateUser(props.userData.user_id, { password: newPassword });

    if (response.success) {
      props.toggleModalPassword();
      DropDownHolder.success('Success', 'Password has been updated!');
    }
  };

  const checkOldPassword = async () => {
    const toSend = {
      email: props.userData.email,
      password: oldPassword,
    };
    const response = await UserManagement.login(toSend);

    if (response) {
      await AsyncStorage.setItem('@token', response.token);
      return true;
    }

    DropDownHolder.error('Error', 'Old password is incorrect. Please try again!');
    return false;
  };

  const testPassword = async () => {
    if (await !Utilities.testPasswordValid(newPassword.password)) {
      updateTextStatusState('danger', 'newPassword');
      updateErrorMessageState(
        'Please make sure password is 8 characters and has atleast 1 letter and number', 'newPassword',
      );

      return true;
    }

    updateTextStatusState('basic', 'email');
    updateErrorMessageState('', 'email');

    return false;
  };

  const checkRequiredFields = () => {
    let error = false;

    // Object.keys(user).forEach((key) => {
    //   if (user[key] === '') {
    //     updateTextStatusState('danger', key);
    //     updateErrorMessageState('Required field', key);
    //
    //     error = true;
    //   } else {
    //     updateTextStatusState('basic', key);
    //     updateErrorMessageState('', key);
    //   }
    // });

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
      <View style={styles.modalContent}>
        <Text style={styles.title}>Change Password</Text>

        <View style={styles.sectionStyle}>
          <Text style={styles.sectionHeading}>Old Password</Text>
          <Input
            value={oldPassword}
            onChangeText={(nextValue) => setOldPassword(nextValue)}
            placeholder="Enter old password"
            accessoryRight={renderSecureIconOld}
            secureTextEntry={toggleSecureTextEntryOld}
            style={styles.inputBox}
          />
        </View>

        <View style={styles.sectionStyle}>
          <Text style={styles.sectionHeading}>New Password</Text>
          <Input
            value={newPassword}
            onChangeText={(value) => setNewPassword(value)}
            placeholder="Enter new password"
            accessoryRight={renderSecureIconNew}
            secureTextEntry={toggleSecureTextEntryNew}
            style={styles.inputBox}
          />
        </View>
        <BarPasswordStrengthDisplay
          password={newPassword}
          barContainerStyle={{ alignSelf: 'center' }}
          width={350}
        />

        <TouchableOpacity style={styles.updateButton} onPress={() => changePassword()}>
          <Text style={{ fontFamily: 'Nunito-Bold', fontSize: 18, color: '#FFFFFF' }}>
            Update
          </Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 20,
  },
  sectionStyle: {
    height: 80,
  },
  sectionHeading: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
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

export default ChangePasswordModal;
