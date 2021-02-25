/**
 * @format
 * @flow strict-local
*/

import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  Input,
  Text,
  TopNavigationAction,
  TopNavigation,
  Icon,
  Layout,
} from '@ui-kitten/components';
import { Slider } from 'react-native-elements';
import { useIsFocused } from '@react-navigation/native';

import DropDownHolder from 'src/services/DropdownHolder.js';
import AddPhotoModal from 'src/components/AddPhotoModal.js';
import LocationReviews from 'src/api/LocationReviews.js';
import { FilterWords } from 'assets/globals.js';

const EditReview = ({ navigation, route }) => {
  const isFocused = useIsFocused();
  const [modalPhotoVisible, setModalPhotoVisible] = useState(false);
  const { locationData, reviewDefault } = route.params;
  const [reviewData, setReviewData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setReviewData(reviewDefault);
    setIsLoading(false);
  }, []);

  const togglePhotoModal = () => {
    setModalPhotoVisible(!modalPhotoVisible);
  };

  const editReview = async () => {
    const updatedDetails = await getReviewUpdates();
    const response = await LocationReviews.updateReview(locationData.location_id, reviewDefault.review_id, updatedDetails);

    if (response.success) {
      DropDownHolder.success('Success', 'Review has been updated!');
    } else {
      DropDownHolder.error('Error', response.error);
    }
  };

  const checkEditReview = async () => {
    if (checkReviewFields() && await checkReviewProfanity()) {
      await editReview();
    }
  };
  const getReviewUpdates = async () => {
    const updatedDetails = { ...reviewData };

    // Checks if element in review has been updated, if not then delete that element
    // so doesn't get patched
    await Object.entries(reviewData).forEach((property) => {
      if (property[1] === reviewDefault[property[0]]) {
        delete updatedDetails[property[0]];
      }
    });

    return updatedDetails;
  };

  const checkReviewFields = () => {
    if (reviewData.review_body !== ''
        && reviewData.overall_rating > 0
        && reviewData.price_rating > 0
        && reviewData.quality_rating > 0
        && reviewData.clenliness_rating > 0) {
      return true;
    }

    DropDownHolder.error('Error', 'Unexpected items, all fields are requried');
    return false;
  };

  // Checks if message contains any word that wish to be filtered out
  const checkReviewProfanity = async () => {
    const filterRegex = new RegExp(`\\b(${FilterWords.join('|')})\\b`);

    if (!await filterRegex.test(reviewData.review_body.toLowerCase())) {
      return true;
    }

    DropDownHolder.error('Unexpected items',
      'Cannot add review due to mention of other aspects of the cafe experience that isn\'t coffee. Please try again!');
    return false;
  };

  const updateReviewDataState = (val, field) => {
    setReviewData((prevState) => ({ ...prevState, [field]: val }));
  };

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} />
  );

  const BackIcon = (props) => (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Icon {...props} name="arrow-back" />
    </TouchableOpacity>
  );

  return (
    <Layout level="2" style={styles.main}>
      <TopNavigation
        accessoryLeft={BackAction}
        alignment="center"
        title="Edit Review"
      />
      { isLoading
        ? (
          <>
            <View style={{
              flex: 1, justifyContent: 'center', flexDirection: 'row', padding: 10,
            }}
            >
              <ActivityIndicator />
            </View>
          </>
        ) : (
          <>
            <View style={styles.editMain}>
              <Text
                style={styles.subHeadingBold}
                category="h5"
              >
                {locationData.location_name}, {locationData.location_town}
              </Text>

              <Input
                multiline
                textStyle={{ minHeight: 64, maxHeight: 64 }}
                placeholder="Review Message..."
                value={reviewData.review_body}
                onChangeText={(reviewBody) => updateReviewDataState(reviewBody, 'review_body')}
              />
              <Text style={{ fontSize: 10, textAlign: 'right' }}>
                {reviewData.review_body.length}/200
              </Text>

              <Text style={styles.subHeadingOverall} category="h6">Overall Rating</Text>
              <Slider
                value={reviewData.overall_rating}
                onValueChange={(overall) => updateReviewDataState(overall, 'overall_rating')}
                maximumValue={5}
                minimumValue={0}
                step={1}
                thumbStyle={{ height: 30, width: 30, backgroundColor: '#C3B299' }}
                thumbProps={{
                  children: (
                    <Text style={styles.sliderText} category="s2">{reviewData.overall_rating}</Text>
                  ),
                }}
              />
              <Text style={styles.subHeading} category="s1">Price Rating</Text>
              <Slider
                value={reviewData.price_rating}
                onValueChange={(price) => updateReviewDataState(price, 'price_rating')}
                maximumValue={5}
                minimumValue={0}
                step={1}
                thumbStyle={{ height: 30, width: 30, backgroundColor: '#C3B299' }}
                thumbProps={{
                  children: (
                    <Text style={styles.sliderText} category="s2">{reviewData.price_rating}</Text>
                  ),
                }}
              />
              <Text style={styles.subHeading} category="s1">Quality Rating</Text>
              <Slider
                value={reviewData.quality_rating}
                onValueChange={(quality) => updateReviewDataState(quality, 'quality_rating')}
                maximumValue={5}
                minimumValue={0}
                step={1}
                thumbStyle={{ height: 30, width: 30, backgroundColor: '#C3B299' }}
                thumbProps={{
                  children: (
                    <Text style={styles.sliderText} category="s2">{reviewData.quality_rating}</Text>
                  ),
                }}
              />
              <Text style={styles.subHeading} category="s1">Cleanliness Rating</Text>
              <Slider
                value={reviewData.clenliness_rating}
                onValueChange={(clenliness) => updateReviewDataState(clenliness, 'clenliness_rating')}
                maximumValue={5}
                minimumValue={0}
                step={1}
                thumbStyle={{ height: 30, width: 30, backgroundColor: '#C3B299' }}
                thumbProps={{
                  children: (
                    <Text style={styles.sliderText} category="s2">{reviewData.clenliness_rating}</Text>
                  ),
                }}
              />

              <TouchableOpacity style={styles.secondaryButton} onPress={() => togglePhotoModal()}>
                <Text style={{ fontFamily: 'Nunito-Bold', fontSize: 18, color: '#247BA0' }}>
                  Edit Photo 📷
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={() => checkEditReview()}>
                <Text style={{ fontFamily: 'Nunito-Bold', fontSize: 18, color: '#FFFFFF' }}>
                  Update Review
                </Text>
              </TouchableOpacity>

              <AddPhotoModal
                modalPhotoVisible={modalPhotoVisible}
                togglePhotoModal={togglePhotoModal}
                reviewID={reviewDefault.review_id}
                locationID={locationData.location_id}
                editPhoto
              />
            </View>
          </>
        )}
    </Layout>
  );
};

const styles = StyleSheet.create({
  detailsMain: {
    flex: 1,
    flexDirection: 'column',
  },
  editMain: {
    paddingLeft: 25,
    paddingRight: 25,
  },
  iconSize: {
    height: 38,
    width: 38,
  },
  subHeadingBold: {
    marginBottom: 10,
    marginTop: 10,
  },
  subHeadingOverall: {
    marginTop: 5,
  },
  subHeading: {
    marginTop: 15,
  },
  sliderText: {
    marginTop: 30,
    alignSelf: 'center',
  },
  primaryButton: {
    backgroundColor: '#247BA0',
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryButton: {
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    borderColor: '#247BA0',
    borderWidth: 1,
  },
});

EditReview.propTypes = {
  // route: PropTypes.InstanceOf(Object).isRequired,
};

export default EditReview;
