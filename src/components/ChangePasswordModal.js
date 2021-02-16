import React, { useState } from 'react';
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

import UserManagement from 'src/api/UserManagement.js';

const ChangePasswordModal = (props) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureTextEntrys, setSecureTextEntrys] = useState({
    oldPasswordEntry: true,
    newPasswordEntry: true,
    confirmPasswordEntry: true,
  });

  const changePassword = async () => {
    const oldPasswordPassed = await checkOldPassword();
    console.log(oldPasswordPassed);
  };

  const checkOldPassword = async () => {
    const toSend = {
      email: props.userData.email,
      password: oldPassword,
    };
    const response = await UserManagement.login(toSend);

    console.log(response);
    if (response) {
      await AsyncStorage.setItem('@token', response.token);
      console.log(response);
      return true;
    }

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
            caption="Should contain at least 8 charecters"
            accessoryRight={renderSecureIcon}
            captionIcon={AlertIcon}
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

        <View style={styles.sectionStyle}>
          <Text style={styles.sectionHeading}>Confirm Password</Text>
          <Input
            value={confirmPassword}
            onChangeText={(value) => setConfirmPassword(value)}
            placeholder="Confir new password"
            caption="Should contain at least 8 charecters"
            accessoryRight={renderSecureIcon}
            captionIcon={AlertIcon}
            secureTextEntry={secureTextEntrys.confirmPasswordEntry}
            style={styles.inputBox}
          />
        </View>

        <Button style={styles.button} status="success" onPress={() => changePassword()}>
          Update
        </Button>
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
    height: 10
  }
});

export default ChangePasswordModal;
