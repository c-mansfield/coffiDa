import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
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
import DropdownAlert from 'react-native-dropdownalert';
import { BarPasswordStrengthDisplay } from 'react-native-password-strength-meter';
import PropTypes from 'prop-types';

import UserManagement from 'src/api/UserManagement.js';

const ChangePasswordModal = (props) => {
  const isFocused = useIsFocused();
  let dropDownAlertRef = useRef(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureTextEntrys, setSecureTextEntrys] = useState({
    oldPasswordEntry: true,
    newPasswordEntry: true,
    confirmPasswordEntry: true,
  });

  useEffect(() => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }, [isFocused]);

  const changePassword = async () => {
    if (await checkOldPassword()) {
      if (await checkPasswordCriteria()) {
        if (await checkPasswordsMatch()) {
          await updatePassword();
        }
      }
    }
  };

  const updatePassword = async () => {
    const response = await UserManagement.updateUser(props.userData.user_id, { password: newPassword });

    if (response.status === 200) {
      props.toggleModalPassword();
      props.showDropdownMessage('success', 'Success', 'Password has been updated!');
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

    dropDownAlertRef.alertWithType('error', 'Error', 'Old password is incorrect. Please try again!');
    return false;
  };

  const checkPasswordCriteria = async () => {
    if (newPassword.length >= 8) {
      return true;
    }

    dropDownAlertRef.alertWithType('error', 'Error', 'Password does not match criteria. Please try again!');
    return false;
  };

  const checkPasswordsMatch = async () => {
    console.log(confirmPassword);
    console.log(newPassword);
    if (newPassword === confirmPassword) {
      return true;
    }

    dropDownAlertRef.alertWithType('error', 'Error', 'Passwords do not match. Please try again!');
    return false;
  };


  const toggleSecureTextEntry = (field) => {
    setSecureTextEntrys(!secureTextEntrys[field]);
  };

  const renderSecureIcon = (field) => (
    <TouchableWithoutFeedback onPress={toggleSecureTextEntry}>
      <Icon {...props} name={secureTextEntrys[field] ? 'eye-off' : 'eye'} />
    </TouchableWithoutFeedback>
  );

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
            accessoryRight={renderSecureIcon}
            secureTextEntry={secureTextEntrys.oldPasswordEntry}
            style={styles.inputBox}
          />
        </View>

        <View style={styles.sectionStyle}>
          <Text style={styles.sectionHeading}>New Password</Text>
          <Input
            value={newPassword}
            onChangeText={(value) => setNewPassword(value)}
            placeholder="Enter new password"
            caption="Should contain at least 8 charecters"
            accessoryRight={renderSecureIcon}
            captionIcon={AlertIcon}
            secureTextEntry={secureTextEntrys.newPasswordEntry}
            style={styles.inputBox}
          />
        </View>
        <BarPasswordStrengthDisplay
          password={newPassword}
          barContainerStyle={{ alignSelf: 'center' }}
          width={350}
        />
        <View style={styles.sectionStyle}>
          <Text style={styles.sectionHeading}>Confirm Password</Text>
          <Input
            value={confirmPassword}
            onChangeText={(value) => setConfirmPassword(value)}
            placeholder="Confirm new password"
            accessoryRight={renderSecureIcon}
            secureTextEntry={secureTextEntrys.confirmPasswordEntry}
            style={styles.inputBox}
          />
        </View>

        <Button style={styles.button} status="success" onPress={() => changePassword()}>
          Update
        </Button>
        <DropdownAlert ref={(ref) => {
          if (ref) {
            dropDownAlertRef = ref;
          }
        }}
        />
      </View>
    </Modal>
  );
};

const AlertIcon = (props) => (
  <Icon {...props} name="alert-circle-outline" />
);

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
    height: 100,
  },
  sectionHeading: {
    fontSize: 18,
    fontFamily: 'Nunito-Regular',
  },
  button: {
    marginTop: 20,
  },
  inputBox: {
    marginTop: 5,
    height: 10,
  },
});

ChangePasswordModal.propTypes = {
  modalPasswordVisible: PropTypes.bool.isRequired,
  toggleModalPassword: PropTypes.func.isRequired,
  successMessage: PropTypes.func.isRequired,
  userData: PropTypes.object.isRequired,
};

export default ChangePasswordModal;
