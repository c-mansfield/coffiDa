import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AddReviewButton = (props) => {

  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.addReviewStyle}
      onPress={() => navigation.navigate('AddReview')}>
      <Text style={styles.addReviewTextStyle}>+</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  addReviewStyle: {
    height: 90,
    width: 90,
    backgroundColor: '#964B00',
    borderRadius: 100
  },
  addReviewTextStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    flex:1
  }
});

export default AddReviewButton;
