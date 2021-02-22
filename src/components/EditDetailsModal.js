import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { Text, Input, Button } from '@ui-kitten/components';
import PropTypes from 'prop-types';

import DropDownHolder from 'src/services/DropdownHolder.js';
import UserManagement from 'src/api/UserManagement.js';

const EditDetailsModal = (props) => {
  const isFocused = useIsFocused();
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });

  useEffect(() => {
    updateUserState(props.userData.first_name, 'first_name');
    updateUserState(props.userData.last_name, 'last_name');
    updateUserState(props.userData.email, 'email');
  }, [isFocused, props.modalDetailsVisible]);

  const updateUser = async () => {
    const updatedDetails = await getUserUpdates();
    const response = await UserManagement.updateUser(props.userData.user_id, updatedDetails);

    if (response.status === 200) {
      props.toggleModalDetails();
      DropDownHolder.success('Success', 'User updated');
    }
  };

  const getUserUpdates = async () => {
    const updatedDetails = user;

    // Checks if element in user has been updated, if not then delete that element
    // so doesn't get patched
    await Object.entries(user).forEach((property) => {
      if (property[1] === props.userData[property[0]]) {
        delete updatedDetails[property[0]];
      }
    });

    return updatedDetails;
  };

  const updateUserState = (val, field) => {
    setUser((prevState) => ({ ...prevState, [field]: val }));
  };

  return (
    <Modal
      isVisible={props.modalDetailsVisible}
      swipeDirection={['down']}
      style={styles.modalMain}
      onBackdropPress={props.toggleModalDetails}
    >
      <View style={styles.modalContent}>
        <Text style={styles.title}>Edit Details</Text>

        <View style={styles.sectionStyle}>
          <Text style={styles.sectionHeading}>First Name</Text>
          <Input
            placeholder="Enter first name"
            value={user.first_name}
            onChangeText={(firstName) => updateUserState(firstName, 'first_name')}
            style={styles.inputsStyle}
          />
        </View>

        <View style={styles.sectionStyle}>
          <Text style={styles.sectionHeading}>Last Name</Text>
          <Input
            placeholder="Enter first name"
            value={user.last_name}
            onChangeText={(lastName) => updateUserState(lastName, 'last_name')}
            style={styles.inputsStyle}
          />
        </View>

        <View style={styles.sectionStyle}>
          <Text style={styles.sectionHeading}>Email</Text>
          <Input
            placeholder="Enter first name"
            value={user.email}
            onChangeText={(email) => updateUserState(email, 'email')}
            style={styles.inputsStyle}
          />
        </View>

        <Button style={styles.button} status="success" onPress={() => updateUser()}>
          Update
        </Button>
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
    marginBottom: 10,
  },
  sectionStyle: {
    marginTop: 20,
  },
  sectionHeading: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
  },
  inputsStyle: {
    marginTop: 5,
  },
  button: {
    marginTop: 40,
  },
});

EditDetailsModal.propTypes = {
  // userData: PropTypes.InstanceOf(Object).isRequired,
};

export default EditDetailsModal;
