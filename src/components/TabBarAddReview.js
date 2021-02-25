/**
 * @format
 * @flow strict-local
*/

import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '@ui-kitten/components';

const AddReviewButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.addReviewStyle}
      onPress={() => navigation.navigate('AddReview')}
    >
      <Icon style={styles.addReviewTextStyle} fill="#000000" name="plus-outline" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  addReviewStyle: {
    height: 70,
    width: 70,
    backgroundColor: '#80956A',
    borderRadius: 100,
    top: -15,
    borderWidth: 7,
    borderColor: '#247BA0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,
    elevation: 24,
  },
  addReviewTextStyle: {
    height: 38,
    width: 38,
  },
});

export default AddReviewButton;
