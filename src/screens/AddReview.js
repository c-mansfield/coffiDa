/**
 * @format
 * @flow strict-local
*/

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
  const [selectedLocation, setSelectedLocation] = useState('');
  const [locationID, setLocationID] = useState(0);
  const [locations, setLocations] = useState([]);
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
    setSelectedLocation(`${locations[index].location_name}, ${locations[index].location_town}`);
    setLocationID(locations[index].location_id);
  };

  const checkLocationSelect = async (query) => {
    setLocation(query);

    if (query !== '') {
      if (locationID === 0 || location !== selectedLocation) {
        await onChangeLocation(query);
      } else {
        setLocation('');
        setSelectedLocation('');
        setLocationID(0);
      }
    }
  };

  const onChangeLocation = async (query) => {
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

  const renderLocations = (item, index) => {
    console.log('item ', item);
    console.log('index ', index);
    // if (item.location_name) {
      return (
        <AutocompleteItem
          key={index}
          title={`${item.location_name}, ${item.location_town}`}
        />
      );
    // }
    //
    // return null;
  };

  const checkReview = async () => {
    if (checkReviewFields() && checkLocationAdded() && await checkReviewProfanity()) {
      await addReview();
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

    DropDownHolder.error('Error', 'Unexpected items, all fields are requried');
    return false;
  };

  const checkLocationAdded = () => {
    if (locationID !== 0) {
      return true;
    }

    DropDownHolder.error('Error', 'Invalid location, please select a valid location');
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
      <Text category="h1" style={{ marginBottom: 10 }}>Add Review</Text>

      <Autocomplete
        placeholder="Find Location"
        value={location}
        onSelect={onSelectLocation}
        onChangeText={checkLocationSelect}
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

      <Text style={styles.subHeadingBold} category="h6">Overall Rating</Text>
      <Slider
        value={reviewData.overall_rating}
        onValueChange={(overallInput) => updateReviewDataState(overallInput, 'overall_rating')}
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
        onValueChange={(priceInput) => updateReviewDataState(priceInput, 'price_rating')}
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
        onValueChange={(qualityInput) => updateReviewDataState(qualityInput, 'quality_rating')}
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
        onValueChange={(cleanlinessInput) => updateReviewDataState(cleanlinessInput, 'clenliness_rating')}
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
      <TouchableOpacity style={styles.addButton} onPress={() => checkReview()}>
        <Text style={{ color: '#FFFFFF' }} category="h6">
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
  subHeadingBold: {
    fontFamily: 'Nunito-Bold',
    marginTop: 15,
  },
  subHeading: {
    fontFamily: 'Nunito-Regular',
    marginTop: 25,
  },
  sliderText: {
    marginTop: 30,
    alignSelf: 'center',
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
