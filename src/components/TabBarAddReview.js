import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AddReviewButton = (props) => {

  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.addReviewStyle}
      onPress={() => navigation.navigate('AddReview')}>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  addReviewStyle: {
    height: 70,
    width: 70,
    backgroundColor: '#C3B299',
    borderRadius: 100,
    top: -15,
    borderWidth: 7,
    borderColor: '#247BA0'
  },
  addReviewTextStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,

  }
});

export default AddReviewButton;
