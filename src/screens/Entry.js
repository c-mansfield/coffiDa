/**
 * @format
 * @flow strict-local
*/

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';
import { Text } from '@ui-kitten/components';
import LinearGradient from 'react-native-linear-gradient';
import Video from 'react-native-video';

import LoginModal from 'src/components/LoginModal.js';
import RegisterModal from 'src/components/RegisterModal.js';

const logoIcon = require('assets/images/coffee_cup_blue.png');
const coffeeVideo = require('assets/images/coffee_video3.mp4');

const { height } = Dimensions.get('window');

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
      <Video
        source={coffeeVideo}
        style={styles.backgroundVideo}
        muted
        repeat
        resizeMode="cover"
        rate={1.0}
        ignoreSilentSwitch="obey"
      />
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <Text style={{
          fontFamily: 'Nunito-Regular', fontSize: 38, color: '#FFFFFF', marginTop: 70,
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
            <Text style={{ fontFamily: 'Nunito-Bold', fontSize: 18, color: '#FFFFFF' }}>
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
  backgroundVideo: {
    height,
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'stretch',
    bottom: 0,
    right: 0,
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
    marginTop: 50,
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
    backgroundColor: 'transparent',
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#247BA0',
    borderWidth: 2,
  },
});

export default Entry;
