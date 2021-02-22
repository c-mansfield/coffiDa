import React, { useState, useEffect, useRef } from 'react';
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
  const [locations, setLocations] = React.useState([{ location_name: 'No results', location_town: '' }]);
  const [message, setMessage] = useState('');
  const [overall, setOverall] = useState(0);
  const [price, setPrice] = useState(0);
  const [quality, setQuality] = useState(0);
  const [cleanliness, setCleanliness] = useState(0);
  const [modalPhotoVisible, setModalPhotoVisible] = useState(false);
  const [reviewID, setReviewID] = useState(0);

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

    if (response) {
      setLocations(response);
    } else {
      setLocations([{ location_name: 'No results', location_town: '' }]);
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
        && message !== ''
        && overall > 0
        && price > 0
        && quality > 0
        && cleanliness > 0) {
      return true;
    }

    DropDownHolder.error('error', 'Unexpected items', 'All fields are requried');
    return false;
  };

  // Checks if message contains any word that wish to be filtered out
  const checkReviewProfanity = async () => {
    const filterRegex = new RegExp(`\\b(${FilterWords.join('|')})\\b`);

    if (!await filterRegex.test(message.toLowerCase())) {
      return true;
    }

    DropDownHolder.error('Unexpected items',
      'Cannot add review due to mention of other aspects of the cafe experience that isn\'t coffee. Please try again!');
    return false;
  };

  const addReview = async () => {
    const reviewData = {
      overall_rating: overall,
      price_rating: price,
      quality_rating: quality,
      clenliness_rating: cleanliness,
      review_body: message,
    };
    const response = await LocationReviews.addReview(locationID, reviewData);

    if (response) {
      await getReviewID();
      resetState();
      togglePhotoModal();
    }
  };

  const togglePhotoModal = () => {
    setModalPhotoVisible(!modalPhotoVisible);
  };

  const resetState = () => {
    setLocation('');
    setLocations([{ location_name: 'No results', location_town: '' }]);
    setMessage('');
    setOverall(0);
    setPrice(0);
    setQuality(0);
    setCleanliness(0);
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
    }
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
        value={message}
        onChangeText={(msg) => setMessage(msg)}
        maxLength={200}
        numberOfLines={5}
      />
      <Text style={{ fontSize: 10, textAlign: 'right' }}>
        {message.length}/200
      </Text>

      <Text style={styles.subHeadingBold}>Overall Rating</Text>
      <Slider
        value={overall}
        onValueChange={(overallInput) => setOverall(overallInput)}
        maximumValue={5}
        minimumValue={0}
        step={1}
        thumbStyle={{ height: 30, width: 30, backgroundColor: '#C3B299' }}
        thumbProps={{
          children: (
            <Text style={styles.sliderText}>{overall}</Text>
          ),
        }}
      />
      <Text style={styles.subHeading}>Price Rating</Text>
      <Slider
        value={price}
        onValueChange={(priceInput) => setPrice(priceInput)}
        maximumValue={5}
        minimumValue={0}
        step={1}
        thumbStyle={{ height: 30, width: 30, backgroundColor: '#C3B299' }}
        thumbProps={{
          children: (
            <Text style={styles.sliderText}>{price}</Text>
          ),
        }}
      />
      <Text style={styles.subHeading}>Quality Rating</Text>
      <Slider
        value={quality}
        onValueChange={(qualityInput) => setQuality(qualityInput)}
        maximumValue={5}
        minimumValue={0}
        step={1}
        thumbStyle={{ height: 30, width: 30, backgroundColor: '#C3B299' }}
        thumbProps={{
          children: (
            <Text style={styles.sliderText}>{quality}</Text>
          ),
        }}
      />
      <Text style={styles.subHeading}>Cleanliness Rating</Text>
      <Slider
        value={cleanliness}
        onValueChange={(cleanlinessInput) => setCleanliness(cleanlinessInput)}
        maximumValue={5}
        minimumValue={0}
        step={1}
        thumbStyle={{ height: 30, width: 30, backgroundColor: '#C3B299' }}
        thumbProps={{
          children: (
            <Text style={styles.sliderText}>{cleanliness}</Text>
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
