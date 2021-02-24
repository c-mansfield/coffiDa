import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import {
  Icon,
  Layout,
  MenuItem,
  Text,
} from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';

import UserManagement from 'src/api/UserManagement.js';
import EditDetailsModal from 'src/components/EditDetailsModal.js';
import ChangePasswordModal from 'src/components/ChangePasswordModal.js';
import DropDownHolder from 'src/services/DropdownHolder.js';

const Account = ({ navigation }) => {
  const [userData, setUserData] = useState({});
  const [modalDetailsVisible, setModalDetailsVisible] = useState(false);
  const [modalPasswordVisible, setModalPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await getCurrentUser();

      setIsLoading(false);
    };

    fetchData();
  }, [modalDetailsVisible]);

  const getCurrentUser = async () => {
    const userID = await AsyncStorage.getItem('@userID');
    const response = await UserManagement.getUser(userID);

    if (response.success) {
      setUserData(response.body);
    } else {
      DropDownHolder.error('Error', response.error);
    }
  };

  const logoutUser = async () => {
    setIsLoading(true);
    const response = await UserManagement.logout();

    if (response.success) {
      navigation.navigate('Entry');
      await AsyncStorage.clear();
    }
  };

  const toggleModalDetails = () => {
    setModalDetailsVisible(!modalDetailsVisible);
  };

  const toggleModalPassword = () => {
    setModalPasswordVisible(!modalPasswordVisible);
  };

  return (
    <Layout level="1" style={styles.main}>
      { isLoading
        ? (
          <>
            <View style={{
              flex: 1, justifyContent: 'center', flexDirection: 'row', padding: 10,
            }}
            >
              <ActivityIndicator />
            </View>
          </>
        ) : (
          <>
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
              />
            </View>

            <View style={styles.sectionMain}>
              <Text style={styles.sectionHeader}>Accessibility</Text>

              <MenuItem
                title="Language"
                accessoryLeft={GlobeIcon}
                accessoryRight={ForwardIcon}
              />
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={() => logoutUser()}>
              <Text style={{ fontFamily: 'Nunito-Bold', fontSize: 18, color: '#FFFFFF' }}>
                LOGOUT
              </Text>
            </TouchableOpacity>
          </>
        )}
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

const GlobeIcon = (props) => (
  <Icon {...props} name="globe-3" />
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
  logoutButton: {
    backgroundColor: '#A02323',
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
});

export default Account;
