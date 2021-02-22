/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { Text } from '@ui-kitten/components';
import LinearGradient from 'react-native-linear-gradient';

import LoginModal from 'src/components/LoginModal.js';
import RegisterModal from 'src/components/RegisterModal.js';

const logoIcon = require('assets/images/coffee_cup_blue.png');

const Entry = ({ navigation }) => {
  const [loginModalVisible, setModalLoginVisible] = useState(false);
  const [registerModalVisible, setModalRegisterVisible] = useState(false);

  const toggleLoginModal = () => {
    setModalLoginVisible(!loginModalVisible);
  };

  const toggleRegisterModal = () => {
    setModalRegisterVisible(!registerModalVisible);
  };

  const navigateHome = () => {
    navigation.navigate('BottomTabNavigation');
  };

  return (
    <LinearGradient style={styles.main} colors={['#C3B299', '#CBD4C2']}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <View style={styles.logoWrapper}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image
              style={styles.logoIconStyle}
              source={logoIcon}
            />
          </View>
        </View>

        <Text style={{
          fontFamily: 'Nunito-Regular', fontSize: 38, color: '#FFFFFF', marginTop: 20,
        }}
        >
          Find the perfect cup...
        </Text>

        <View style={styles.buttonsStyles}>
          <TouchableOpacity style={styles.loginButton} onPress={() => toggleLoginModal()}>
            <Text style={{ fontFamily: 'Nunito-Bold', fontSize: 18, color: '#FFFFFF' }}>
              LOGIN
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.registerButton} onPress={() => toggleRegisterModal()}>
            <Text style={{ fontFamily: 'Nunito-Bold', fontSize: 18, color: '#247BA0' }}>
              REGISTER
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <LoginModal
        loginModalVisible={loginModalVisible}
        toggleLoginModal={toggleLoginModal}
        navigateHome={navigateHome}
      />
      <RegisterModal
        registerModalVisible={registerModalVisible}
        toggleRegisterModal={toggleRegisterModal}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  main: {
    padding: 25,
    flex: 1,
  },
  logoWrapper: {
    height: 88,
    width: 88,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginTop: 30,
  },
  logoIconStyle: {
    width: 60,
    height: 44,
  },
  buttonsStyles: {
    flex: 1,
    paddingBottom: 50,
    justifyContent: 'flex-end',
  },
  loginButton: {
    backgroundColor: '#247BA0',
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  registerButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#247BA0',
    borderWidth: 1,
  },
});

export default Entry;
