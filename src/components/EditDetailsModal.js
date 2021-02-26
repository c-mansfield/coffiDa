/**
 * @format
 * @flow strict-local
*/

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import { Text, Input, Layout } from '@ui-kitten/components';

import DropDownHolder from 'src/services/DropdownHolder.js';
import UserManagement from 'src/api/UserManagement.js';
import Utilities from 'src/components/Utilities.js';

const EditDetailsModal = (props) => {
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });
  const [textStatus, setTextStatus] = useState({ first_name: 'basic', last_name: 'basic', email: 'basic' });
  const [errorMessage, setErrorMessage] = useState({
    main: '',
    first_name: '',
    last_name: '',
    email: '',
  });
  const { modalDetailsVisible, userData, toggleModalDetails } = props;

  useEffect(() => {
    updateUserState(userData.first_name, 'first_name');
    updateUserState(userData.last_name, 'last_name');
    updateUserState(userData.email, 'email');

    setTextStatus({ first_name: 'basic', last_name: 'basic', email: 'basic' });
    setErrorMessage({
      main: '', first_name: '', last_name: '', email: '',
    });
  }, [modalDetailsVisible]);

  const updateUser = async () => {
    const updatedDetails = await getUserUpdates();
    const response = await UserManagement.updateUser(userData.user_id, updatedDetails);

    if (response.success) {
      toggleModalDetails();
      DropDownHolder.success('Success', 'User updated');
    } else {
      updateErrorMessageState(response.error, 'main');
    }
  };

  const getUserUpdates = async () => {
    const updatedDetails = { ...user };

    // Checks if element in user has been updated, if not then delete that element
    // so doesn't get patched
    await Object.entries(user).forEach((property) => {
      if (property[1] === userData[property[0]]) {
        delete updatedDetails[property[0]];
      }
    });

    return updatedDetails;
  };

  const checkCanUpdate = async () => {
    const fields = await checkRequiredFields();
    const emailCheck = await testEmail();

    if (!fields && !emailCheck) {
      await updateUser();
    }
  };

  const checkRequiredFields = () => {
    let error = false;

    Object.keys(user).forEach((key) => {
      if (user[key] === '') {
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
    if (!Utilities.testEmailValid(user.email)) {
      updateTextStatusState('danger', 'email');
      updateErrorMessageState('Please input email in correct format', 'email');

      return true;
    }

    updateTextStatusState('basic', 'email');
    updateErrorMessageState('', 'email');

    return false;
  };

  const updateUserState = (val, field) => {
    setUser((prevState) => ({ ...prevState, [field]: val }));
  };

  const updateTextStatusState = (val, field) => {
    setTextStatus((prevState) => ({ ...prevState, [field]: val }));
  };

  const updateErrorMessageState = (val, field) => {
    setErrorMessage((prevState) => ({ ...prevState, [field]: val }));
  };

  return (
    <Modal
      isVisible={modalDetailsVisible}
      swipeDirection={['down']}
      style={styles.modalMain}
      onBackdropPress={toggleModalDetails}
    >
      <Layout style={styles.modalContent} level="1">
        <Text category="h3">Edit Details</Text>
        <Text status="danger" category="c1">{errorMessage.main}</Text>

        <View style={{ marginTop: 10 }}>
          <Text category="s1">First Name</Text>
          <Input
            placeholder="Enter first name"
            value={user.first_name}
            onChangeText={(firstName) => updateUserState(firstName, 'first_name')}
            style={styles.inputsStyle}
            status={textStatus.first_name}
            caption={errorMessage.first_name}
          />
        </View>

        <View style={styles.sectionStyle}>
          <Text category="s1">Last Name</Text>
          <Input
            placeholder="Enter last name"
            value={user.last_name}
            onChangeText={(lastName) => updateUserState(lastName, 'last_name')}
            style={styles.inputsStyle}
            status={textStatus.last_name}
            caption={errorMessage.last_name}
          />
        </View>

        <View style={styles.sectionStyle}>
          <Text category="s1">Email</Text>
          <Input
            placeholder="Enter email"
            value={user.email}
            onChangeText={(email) => updateUserState(email, 'email')}
            style={styles.inputsStyle}
            status={textStatus.email}
            caption={errorMessage.email}
          />
        </View>

        <TouchableOpacity style={styles.updateButton} onPress={() => checkCanUpdate()}>
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
    marginTop: 25,
  },
  inputsStyle: {
    marginTop: 5,
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

EditDetailsModal.propTypes = {
  // userData: PropTypes.InstanceOf(Object).isRequired,
};

export default EditDetailsModal;
