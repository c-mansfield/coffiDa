import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  Input,
  Layout,
  Icon,
  Text,
  Button,
} from '@ui-kitten/components';
import { Slider } from 'react-native-elements';
import { useIsFocused } from '@react-navigation/native';
import PropTypes from 'prop-types';
import DropdownAlert from 'react-native-dropdownalert';

import AddPhotoModal from 'src/components/AddPhotoModal.js';
import LocationReviews from 'src/api/LocationReviews.js';

const EditReview = ({ navigation, route }) => {
  const isFocused = useIsFocused();
  let dropDownAlertRef = useRef(null);
  const [modalPhotoVisible, setModalPhotoVisible] = useState(false);
  const { location, review } = route.params;
  const [reviewData, setReviewData] = useState({
    review_body: '',
    overall_rating: 0,
    price_rating: 0,
    quality_rating: 0,
    clenliness_rating: 0,
  });

  useEffect(() => {
    updateReviewDataState(review.review_body, 'review_body');
    updateReviewDataState(review.overall_rating, 'overall_rating');
    updateReviewDataState(review.price_rating, 'price_rating');
    updateReviewDataState(review.quality_rating, 'quality_rating');
    updateReviewDataState(review.clenliness_rating, 'clenliness_rating');
  }, [isFocused]);

  const togglePhotoModal = () => {
    setModalPhotoVisible(!modalPhotoVisible);
  };

  const editReview = async () => {
    const updatedDetails = await getReviewUpdates();
    console.log(updatedDetails);
    const response = await LocationReviews.updateReview(location.location_id, review.review_id, updatedDetails);

    if (response) {
      dropDownAlertRef.alertWithType('success', 'Success', 'Review has been updated!');
    }
  };

  const getReviewUpdates = async () => {
    const updatedDetails = reviewData;

    // Checks if element in review has been updated, if not then delete that element
    // so doesn't get patched
    await Object.entries(reviewData).forEach((property) => {
      if (property[1] === review[property[0]]) {
        delete updatedDetails[property[0]];
      }
    });

    return updatedDetails;
  };

  const updateReviewDataState = (val, field) => {
    setReviewData((prevState) => ({ ...prevState, [field]: val }));
  };

  return (
    <Layout level="1" style={styles.main}>
      <View style={styles.editHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon style={styles.iconSize} fill="#000000" name="arrow-back" />
        </TouchableOpacity>
      </View>

      <View style={styles.editMain}>
        <Text style={styles.subHeadingBold}>{location.location_name}, {location.location_town}</Text>

        <Input
          multiline
          textStyle={{ minHeight: 64, maxHeight: 64 }}
          placeholder="Review Message..."
          value={reviewData.review_body}
          onChangeText={(reviewBody) => updateReviewDataState(reviewBody, 'review_body')}
        />

        <Text style={styles.subHeadingBold}>Overall Rating</Text>
        <Slider
          value={reviewData.overall_rating}
          onValueChange={(overall) => updateReviewDataState(overall, 'overall_rating')}
          maximumValue={5}
          minimumValue={0}
          step={1}
          thumbStyle={{ height: 30, width: 30, backgroundColor: '#C3B299' }}
          thumbProps={{
            children: (
              <Text style={styles.sliderText}>{reviewData.overall_rating}</Text>
            ),
          }}
        />
        <Text style={styles.subHeading}>Price Rating</Text>
        <Slider
          value={reviewData.price_rating}
          onValueChange={(price) => updateReviewDataState(price, 'price_rating')}
          maximumValue={5}
          minimumValue={0}
          step={1}
          thumbStyle={{ height: 30, width: 30, backgroundColor: '#C3B299' }}
          thumbProps={{
            children: (
              <Text style={styles.sliderText}>{reviewData.price_rating}</Text>
            ),
          }}
        />
        <Text style={styles.subHeading}>Quality Rating</Text>
        <Slider
          value={reviewData.quality_rating}
          onValueChange={(quality) => updateReviewDataState(quality, 'quality_rating')}
          maximumValue={5}
          minimumValue={0}
          step={1}
          thumbStyle={{ height: 30, width: 30, backgroundColor: '#C3B299' }}
          thumbProps={{
            children: (
              <Text style={styles.sliderText}>{reviewData.quality_rating}</Text>
            ),
          }}
        />
        <Text style={styles.subHeading}>Cleanliness Rating</Text>
        <Slider
          value={reviewData.clenliness_rating}
          onValueChange={(clenliness) => updateReviewDataState(clenliness, 'clenliness_rating')}
          maximumValue={5}
          minimumValue={0}
          step={1}
          thumbStyle={{ height: 30, width: 30, backgroundColor: '#C3B299' }}
          thumbProps={{
            children: (
              <Text style={styles.sliderText}>{reviewData.clenliness_rating}</Text>
            ),
          }}
        />
        <Button
          buttonStyle={{ marginTop: 40 }}
          status="primary"
          onPress={() => togglePhotoModal()}
        >
          Edit Photo
        </Button>
        <Button
          buttonStyle={{ marginTop: 40 }}
          status="success"
          onPress={() => editReview()}
        >
          Update Review
        </Button>
        <AddPhotoModal
          modalPhotoVisible={modalPhotoVisible}
          togglePhotoModal={togglePhotoModal}
          reviewID={review.review_id}
          locationID={location.location_id}
          editPhoto
        />
        <DropdownAlert ref={(ref) => {
          if (ref) {
            dropDownAlertRef = ref;
          }
        }}
        />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  detailsMain: {
    flex: 1,
    flexDirection: 'column',
  },
  editHeader: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 15,
  },
  editMain: {
    padding: 25,
  },
  iconSize: {
    height: 38,
    width: 38,
  },
  subHeadingBold: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    marginTop: 10,
  },
  subHeading: {
    fontSize: 18,
    fontFamily: 'Nunito-Regular',
    marginTop: 25,
  },
  sliderText: {
    marginTop: 30,
    alignSelf: 'center',
    fontFamily: 'Nunito-Regular',
  },
});

EditReview.propTypes = {
  // route: PropTypes.InstanceOf(Object).isRequired,
};

export default EditReview;
