import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Button,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
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
  const isFocused = useIsFocused();
  let camera = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setPhoto(null);

      if (editPhoto) {
        setPhoto('PLACEHOLDER');
        await getPhoto();
      }
    };

    fetchData();
  }, [isFocused, modalPhotoVisible]);

  const handleChoosePhoto = () => {
    const options = {
      noData: true,
    };
    ImagePicker.launchImageLibrary(options, (data) => {
      if (data.uri) {
        setPhoto(data);
      }
    });
  };

  const takePicture = async () => {
    if (camera) {
      const options = { quality: 0.5, base64: true };
      const data = await camera.takePictureAsync(options);

      setPhoto(data);
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
          ? <Text style={styles.title}>Edit photo</Text>
          : <Text style={styles.title}>Add photo</Text>}

        <View style={styles.imageView}>
          {photo ? (
            <>
              <Image
                source={{ uri: photo.uri }}
                style={{ width: 300, height: 300 }}
              />
              <Button title="Upload" onPress={() => uploadPhoto()} />
              <Button title="Retake Photo" onPress={() => retakePhoto()} />
              <Button title="Maybe Later" onPress={togglePhotoModal} />
            </>
          ) : (
            <>
              <RNCamera ref={(ref) => { camera = ref; }} style={styles.preview} />
              <Button title="Take Photo" onPress={() => takePicture()} />
              <Button title="Choose From Library" onPress={() => handleChoosePhoto()} />
              <Button title="Maybe Later" onPress={togglePhotoModal} />
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
  preview: {
    width: 200,
    height: 250,
    alignItems: 'center',
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
