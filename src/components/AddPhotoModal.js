/**
 * @format
 * @flow strict-local
*/

import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import Modal from 'react-native-modal';
import { Text, Layout } from '@ui-kitten/components';
import * as ImagePicker from 'react-native-image-picker';
import { RNCamera } from 'react-native-camera';

import LocationReviews from 'src/api/LocationReviews.js';
import DropDownHolder from 'src/services/DropdownHolder.js';

const AddPhotoModal = ({
  modalPhotoVisible,
  togglePhotoModal,
  reviewID,
  locationID,
  editPhoto,
}) => {
  const [photo, setPhoto] = useState(null);
  let camera = useRef(null);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      await checkCameraEnabled();
    };

    fetchData();
  }, [modalPhotoVisible]);

  useEffect(() => {
    if (cameraPermission) {
      const fetchData = async () => {
        setPhoto(null);
        setPhotoTaken(false);

        if (editPhoto) {
          setPhoto('');
          await getPhoto();
        }
      };

      fetchData();
    }
  }, [cameraPermission]);

  const checkCameraEnabled = async () => {
    const enabled = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);

    // console.log(enabled);
    setCameraPermission(enabled);
  };

  const requestCamera = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Coffida Camera Permission',
          message:
            'Coffida needs access to your camera '
            + 'so you can add photos to your reviews.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setCameraPermission(true);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleChoosePhoto = () => {
    const options = {
      noData: true,
    };
    ImagePicker.launchImageLibrary(options, (data) => {
      if (data.uri) {
        setPhoto(data);
      }
    });

    setPhotoTaken(true);
  };

  const takePicture = async () => {
    if (camera) {
      const options = { quality: 0.5, base64: true };
      const data = await camera.takePictureAsync(options);

      setPhoto(data);
      setPhotoTaken(true);
    }
  };

  const uploadPhoto = async () => {
    const response = await LocationReviews.addReviewPhoto(locationID, reviewID, photo);

    if (response.success) {
      togglePhotoModal();
      DropDownHolder.success('Success', 'Photo uploaded to review!');
    } else {
      DropDownHolder.error('Error', response.error);
    }
  };

  const retakePhoto = async () => {
    const response = await LocationReviews.deleteReviewPhoto(locationID, reviewID);

    if (response.success) {
      setPhoto(null);
    } else {
      DropDownHolder.error('Error', response.error);
    }
  };

  const getPhoto = async () => {
    const response = await LocationReviews.getReviewPhoto(locationID, reviewID);

    if (response.success) {
      const reader = new global.FileReader();
      reader.readAsDataURL(response.body);

      reader.onloadend = () => {
        setPhoto({ uri: reader.result });
      };
    } else if (response.status === 500) {
      DropDownHolder.error('Error', response.error);
    }
  };

  return (
    <Modal
      isVisible={modalPhotoVisible}
      swipeDirection={['down']}
      style={styles.modalMain}
      onBackdropPress={togglePhotoModal}
    >
      <Layout style={styles.modalContent} level="1">
        {!cameraPermission ? (
          <>
            <Text style={styles.title} category="h3">Camera not enabled</Text>
            <TouchableOpacity style={styles.primaryButton} onPress={() => requestCamera()}>
              <Text category="h6" style={{ color: '#ffffff' }}>
                Enable Camera 📷
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.maybeLater} onPress={togglePhotoModal}>
              <Text category="h6">Maybe Later</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {photo ? (
              <>
                <Text style={styles.title} category="h3">Edit review photo</Text>

                <View style={styles.imageView}>
                  <View style={styles.cameraPreview}>
                    <Image
                      source={{ uri: photo.uri }}
                      style={{ width: 240, height: 300 }}
                    />
                  </View>
                  { !editPhoto || photoTaken
                    ? (
                      <>
                        <TouchableOpacity style={styles.primaryButton} onPress={() => uploadPhoto()}>
                          <Text category="h6" style={{ color: '#ffffff' }}>
                            Upload Photo
                          </Text>
                        </TouchableOpacity>
                      </>
                    ) : null }
                  <TouchableOpacity style={styles.secondaryButton} onPress={() => retakePhoto()}>
                    <Text category="h6">
                      Retake photo
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.maybeLater} onPress={togglePhotoModal}>
                    <Text category="h6">Maybe Later</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>

                <Text style={styles.title} category="h3">Add photo to review</Text>

                <View style={styles.imageView}>
                  <View style={styles.cameraPreview}>
                    <RNCamera ref={(ref) => { camera = ref; }} style={styles.preview} captureAudio={false} />
                  </View>
                  <TouchableOpacity style={styles.primaryButton} onPress={() => takePicture()}>
                    <Text category="h6" style={{ color: '#ffffff' }}>
                      Take Photo 📷
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.secondaryButton} onPress={() => handleChoosePhoto()}>
                    <Text category="h6">
                      Choose From Library
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.maybeLater} onPress={togglePhotoModal}>
                    <Text category="h6">Maybe Later</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </>
        )}
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
  title: {
    marginBottom: 20,
  },
  cameraPreview: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  preview: {
    width: 240,
    height: 300,
  },
  primaryButton: {
    backgroundColor: '#247BA0',
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  secondaryButton: {
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderColor: '#247BA0',
    borderWidth: 1,
  },
  maybeLater: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
});

export default AddPhotoModal;
