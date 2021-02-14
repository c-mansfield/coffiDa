import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '@ui-kitten/components';

const AddReviewButton = (props) => {

  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.addReviewStyle}
      onPress={() => navigation.navigate('AddReview')}>
        <Icon style={styles.addReviewTextStyle} fill={'#000000'} name={'plus-outline'} />
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
    borderWidth: 6,
    borderColor: '#247BA0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addReviewTextStyle: {
    height: 38,
    width: 38,
  }
});

export default AddReviewButton;
