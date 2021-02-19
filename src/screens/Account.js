import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import {
  Button,
  Icon,
  Layout,
  MenuItem,
  Text,
} from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropdownAlert from 'react-native-dropdownalert';

import UserManagement from 'src/api/UserManagement.js';
import EditDetailsModal from 'src/components/EditDetailsModal.js';
import ChangePasswordModal from 'src/components/ChangePasswordModal.js';

const Account = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [userData, setUserData] = useState({});
  const [modalDetailsVisible, setModalDetailsVisible] = useState(false);
  const [modalPasswordVisible, setModalPasswordVisible] = useState(false);
  let dropDownAlertRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const userID = await AsyncStorage.getItem('@userID');
      const response = await UserManagement.getUser(userID);

      setUserData(response);
    };

    fetchData();
  }, [isFocused, modalDetailsVisible]);

  const logoutUser = async () => {
    const response = await UserManagement.logout();

    if (response) {
      await AsyncStorage.clear();
      navigation.navigate('Login');
    }
  };

  const toggleModalDetails = () => {
    setModalDetailsVisible(!modalDetailsVisible);
  };

  const toggleModalPassword = () => {
    setModalPasswordVisible(!modalPasswordVisible);
  };

  const showDropdownMessage = (option, title, message) => {
    dropDownAlertRef.alertWithType(option, title, message);
  };

  return (
    <Layout level="1" style={styles.main}>
      <Text style={styles.title}>{userData.first_name} {userData.last_name}</Text>
      <Text style={styles.subHeading}>{userData.email}</Text>

      <View style={styles.sectionMain}>
        <Text style={styles.sectionHeader}>Account Settings</Text>

        <MenuItem
          title="Edit Details"
          accessoryLeft={PersonIcon}
          accessoryRight={ForwardIcon}
          onPress={toggleModalDetails}
        />
        <EditDetailsModal
          modalDetailsVisible={modalDetailsVisible}
          toggleModalDetails={toggleModalDetails}
          userData={userData}
          showDropdownMessage={showDropdownMessage}
        />
        <MenuItem
          title="Change Password"
          accessoryLeft={EditIcon}
          accessoryRight={ForwardIcon}
          onPress={toggleModalPassword}
        />
        <ChangePasswordModal
          modalPasswordVisible={modalPasswordVisible}
          toggleModalPassword={toggleModalPassword}
          userData={userData}
          showDropdownMessage={showDropdownMessage}
        />
      </View>

      <View style={styles.sectionMain}>
        <Text style={styles.sectionHeader}>Accessibility</Text>

        <MenuItem
          title="Edit Details"
          accessoryLeft={PersonIcon}
          accessoryRight={ForwardIcon}
        />
        <MenuItem
          title="Change Password"
          accessoryLeft={EditIcon}
          accessoryRight={ForwardIcon}
        />
      </View>

      <View styles={styles.sectionMain}>
        <Button style={styles.button} status="danger" onPress={() => logoutUser()} appearance="outline">
          Sign Out
        </Button>
      </View>
      <DropdownAlert ref={(ref) => {
        if (ref) {
          dropDownAlertRef = ref;
        }
      }}
      />
    </Layout>
  );
};

const PersonIcon = (props) => (
  <Icon {...props} name="person" />
);

const EditIcon = (props) => (
  <Icon {...props} name="edit" />
);

const ForwardIcon = (props) => (
  <Icon {...props} name="arrow-ios-forward" />
);

const styles = StyleSheet.create({
  main: {
    padding: 15,
    flex: 1,
  },
  title: {
    fontSize: 36,
    fontFamily: 'Nunito-Bold',
  },
  subHeading: {
    fontSize: 20,
    fontFamily: 'Nunito-Regular',
  },
  button: {
    marginTop: 10,
  },
  sectionHeader: {
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    marginBottom: 5,
  },
  sectionMain: {
    marginTop: 20,
  },
});

export default Account;
