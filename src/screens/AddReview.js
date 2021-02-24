import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import {
  Autocomplete,
  AutocompleteItem,
  Input,
  Layout,
  Text,
} from '@ui-kitten/components';
import { Slider } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

import DropDownHolder from 'src/services/DropdownHolder.js';
import LocationManagement from 'src/api/LocationManagement.js';
import LocationReviews from 'src/api/LocationReviews.js';
import AddPhotoModal from 'src/components/AddPhotoModal.js';
import UserManagement from 'src/api/UserManagement.js';
import { FilterWords } from 'assets/globals.js';

const AddReview = () => {
  const isFocused = useIsFocused();
  const [location, setLocation] = useState('');
  const [locationID, setLocationID] = useState(0);
  const [locations, setLocations] = React.useState([{ location_name: '', location_town: '' }]);
  const [modalPhotoVisible, setModalPhotoVisible] = useState(false);
  const [reviewID, setReviewID] = useState(0);
  const [reviewData, setReviewData] = useState({
    review_body: '',
    overall_rating: 0,
    price_rating: 0,
    quality_rating: 0,
    clenliness_rating: 0,
  });

  useEffect(() => {
  }, [isFocused]);

  const onSelectLocation = (index) => {
    setLocation(`${locations[index].location_name}, ${locations[index].location_town}`);
    setLocationID(locations[index].location_id);
  };

  const onChangeLocation = async (query) => {
    setLocation(query);
    const sendQuery = {
      q: query,
    };
    const response = await LocationManagement.searchLocations(sendQuery);

    if (response.success) {
      setLocations(response.body);
    } else {
      DropDownHolder.error('error', response.error);
      setLocations([{ location_name: '', location_town: '' }]);
    }
  };

  const renderLocations = (item, index) => (
    <AutocompleteItem
      key={index}
      title={`${item.location_name}, ${item.location_town}`}
    />
  );

  const checkReview = async () => {
    if (checkReviewFields()) {
      if (await checkReviewProfanity()) {
        await addReview();
      }
    }
  };

  const checkReviewFields = () => {
    if (location !== ''
        && reviewData.review_body !== ''
        && reviewData.overall_rating > 0
        && reviewData.price_rating > 0
        && reviewData.quality_rating > 0
        && reviewData.clenliness_rating > 0) {
      return true;
    }

    DropDownHolder.error('error', 'Unexpected items', 'All fields are requried');
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

  const addReview = async () => {
    const response = await LocationReviews.addReview(locationID, reviewData);

    if (response.success) {
      await getReviewID();
      resetState();
      togglePhotoModal();
    } else {
      DropDownHolder.error('Error', response.error);
    }
  };

  const togglePhotoModal = () => {
    setModalPhotoVisible(!modalPhotoVisible);
  };

  const resetState = () => {
    setLocation('');
    setLocations([{ location_name: 'No results', location_town: '' }]);
    setReviewData({
      review_body: '',
      overall_rating: 0,
      price_rating: 0,
      quality_rating: 0,
      clenliness_rating: 0,
    });
  };

  // Get the review ID as not returned when created
  const getReviewID = async () => {
    const userID = await AsyncStorage.getItem('@userID');
    const response = await UserManagement.getUser(userID);
    let maxReviewID = 0;

    if (response.success) {
      response.body.reviews.find((item) => {
        // Check reviews from correct current location
        // and review id is the highest value
        if (item.location.location_id === locationID
            && item.review.review_id > maxReviewID) {
          maxReviewID = item.review.review_id;
        }
      });

      setReviewID(maxReviewID);
    } else {
      DropDownHolder.error('Error', response.error);
    }
  };

  const updateReviewDataState = (val, field) => {
    setReviewData((prevState) => ({ ...prevState, [field]: val }));
  };

  return (
    <Layout level="2" style={styles.main}>
      <Text style={styles.title}>Add Review</Text>

      <Autocomplete
        placeholder="Find Location"
        value={location}
        onSelect={onSelectLocation}
        onChangeText={onChangeLocation}
      >
        {locations.map(renderLocations)}
      </Autocomplete>
      <Input
        multiline
        textStyle={{ maxHeight: 80 }}
        placeholder="Review Message..."
        value={reviewData.review_body}
        onChangeText={(msg) => updateReviewDataState(msg, 'review_body')}
        maxLength={200}
        numberOfLines={5}
      />
      <Text style={{ fontSize: 10, textAlign: 'right' }}>
        {reviewData.review_body.length}/200
      </Text>

      <Text style={styles.subHeadingBold}>Overall Rating</Text>
      <Slider
        value={reviewData.overall_rating}
        onValueChange={(overallInput) => updateReviewDataState(overallInput, 'overall_rating')}
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
        onValueChange={(priceInput) => updateReviewDataState(priceInput, 'price_rating')}
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
        onValueChange={(qualityInput) => updateReviewDataState(qualityInput, 'quality_rating')}
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
        onValueChange={(cleanlinessInput) => updateReviewDataState(cleanlinessInput, 'clenliness_rating')}
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
      <TouchableOpacity style={styles.addButton} onPress={() => checkReview()}>
        <Text style={{ fontFamily: 'Nunito-Bold', fontSize: 18, color: '#FFFFFF' }}>
          Add
        </Text>
      </TouchableOpacity>

      <AddPhotoModal
        modalPhotoVisible={modalPhotoVisible}
        togglePhotoModal={togglePhotoModal}
        reviewID={reviewID}
        locationID={locationID}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  main: {
    padding: 15,
    flex: 1,
  },
  title: {
    fontSize: 36,
    fontFamily: 'Nunito-Bold',
  },
  subHeadingBold: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    marginTop: 15,
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
  addButton: {
    backgroundColor: '#247BA0',
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 25,
  },
});

export default AddReview;
