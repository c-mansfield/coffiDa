import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Button,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import { Text } from '@ui-kitten/components';
import PropTypes from 'prop-types';
import * as ImagePicker from 'react-native-image-picker';
import { RNCamera } from 'react-native-camera';

import LocationReviews from 'src/api/LocationReviews.js';

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

  useEffect(() => {
    const fetchData = async () => {
      setPhoto(null);
      setPhotoTaken(false);

      if (editPhoto) {
        setPhoto('PLACEHOLDER');
        await getPhoto();
      }
    };

    fetchData();
  }, [modalPhotoVisible]);

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

    if (response) {
      togglePhotoModal();
    }
  };

  const retakePhoto = async () => {
    const response = await LocationReviews.deleteReviewPhoto(locationID, reviewID);

    if (response) {
      setPhoto(null);
    }
  };

  const getPhoto = async () => {
    const response = await LocationReviews.getReviewPhoto(locationID, reviewID);
    const reader = new FileReader();
    reader.readAsDataURL(response);

    reader.onloadend = () => {
      setPhoto({ uri: reader.result });
    };
  };

  return (
    <Modal
      isVisible={modalPhotoVisible}
      swipeDirection={['down']}
      style={styles.modalMain}
      onBackdropPress={togglePhotoModal}
    >
      <View style={styles.modalContent}>
        { editPhoto
          ? <Text style={styles.title}>Edit review photo</Text>
          : <Text style={styles.title}>Add photo to review</Text>}

        <View style={styles.imageView}>
          {photo ? (
            <>
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
                      <Text style={{ fontFamily: 'Nunito-Bold', fontSize: 18, color: '#FFFFFF' }}>
                        Upload Photo
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : null }
              <TouchableOpacity style={styles.secondaryButton} onPress={() => retakePhoto()}>
                <Text style={{ fontFamily: 'Nunito-Bold', fontSize: 18, color: '#247BA0' }}>
                  Retake photo
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.cameraPreview}>
                <RNCamera ref={(ref) => { camera = ref; }} style={styles.preview} />
              </View>
              <TouchableOpacity style={styles.primaryButton} onPress={() => takePicture()}>
                <Text style={{ fontFamily: 'Nunito-Bold', fontSize: 18, color: '#FFFFFF' }}>
                  Take Photo 📷
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => handleChoosePhoto()}>
                <Text style={{ fontFamily: 'Nunito-Bold', fontSize: 18, color: '#247BA0' }}>
                  Choose From Library
                </Text>
              </TouchableOpacity>
            </>
          )}

          { editPhoto
            ? (
              <>
                <TouchableOpacity style={styles.maybeLater} onPress={togglePhotoModal}>
                  <Text style={{ fontFamily: 'Nunito-Bold', fontSize: 16, color: '#000000' }}>Edit Photo Later</Text>
                </TouchableOpacity>
              </>
            )
            : (
              <>
                <TouchableOpacity style={styles.maybeLater} onPress={togglePhotoModal}>
                  <Text style={{ fontFamily: 'Nunito-Bold', fontSize: 16, color: '#000000' }}>Add a Photo Later</Text>
                </TouchableOpacity>
              </>
            )}

        </View>

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
  imageView: {
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

AddPhotoModal.propTypes = {
  modalPhotoVisible: PropTypes.bool.isRequired,
  togglePhotoModal: PropTypes.func.isRequired,
  reviewID: PropTypes.number.isRequired,
  locationID: PropTypes.number.isRequired,
  editPhoto: PropTypes.bool,
};

export default AddPhotoModal;
