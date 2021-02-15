/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Autocomplete, AutocompleteItem, Input } from '@ui-kitten/components';
import { Slider, Button } from 'react-native-elements';

import LocationManagement from 'src/api/LocationManagement.js';
import LocationReviews from 'src/api/LocationReviews.js';

const AddReview = ({ navigation }) => {

  const [location, setLocation] = useState('');
  const [locationID, setLocationID] = useState('');
  const [locations, setLocations] = React.useState([{location_name: 'No results', location_town: ''}]);
  const [message, setMessage] = useState('');
  const [overall, setOverall] = useState(0);
  const [price, setPrice] = useState(0);
  const [quality, setQuality] = useState(0);
  const [cleanliness, setCleanliness] = useState(0);

  const onSelectLocation = (index) => {
    setLocation(locations[index].location_name + ', ' + locations[index].location_town);
    setLocationID(locations[index].location_id);
  };

  const onChangeLocation = async (query) => {
    setLocation(query);
    let sendQuery = {
      q: query
    };
    let response = await LocationManagement.searchLocations(sendQuery);

    if(response) {
      setLocations(response);
    } else {
      setLocations([{location_name: 'No results', location_town: ''}]);
    };
  };

  const renderLocations = (item, index) => (
    <AutocompleteItem
      key={index}
      title={item.location_name + ', ' + item.location_town}
    />
  );

  const addReview = async () => {
    let reviewData = {
      "overall_rating": overall,
      "price_rating": price,
      "quality_rating": quality,
      "clenliness_rating": cleanliness,
      "review_body": message
    };
    let response = await LocationReviews.addReview(locationID, reviewData);

    if(response) {
      navigation.navigate('Home')
    };
  };

  return (
    <View style={styles.main}>
      <Text style={styles.title}>Add Review</Text>

      <Autocomplete
        placeholder='Find Location'
        value={location}
        onSelect={onSelectLocation}
        onChangeText={onChangeLocation}>
        {locations.map(renderLocations)}
      </Autocomplete>
      <Input
        multiline={true}
        textStyle={{ minHeight: 64, maxHeight: 64 }}
        placeholder='Review Message...'
        value={message}
        onChangeText={message => setMessage(message)}
      />

      <Text style={styles.subHeadingBold}>Overall Rating</Text>
      <Slider
        value={overall}
        onValueChange={(overall) => setOverall(overall)}
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
        onValueChange={(price) => setPrice(price)}
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
        onValueChange={(quality) => setQuality(quality)}
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
        onValueChange={(cleanliness) => setCleanliness(cleanliness)}
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

      <Text style={styles.subHeadingBold}>Photo</Text>
      <Button
        title="Save"
        buttonStyle={{backgroundColor: '#247BA0'}}
        onPress={() => addReview()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    padding: 15,
    flex: 1
  },
  title: {
    fontSize: 36,
    fontFamily: 'Nunito-Bold'
  },
  subHeadingBold: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold'
  },
  subHeading: {
    fontSize: 18,
    fontFamily: 'Nunito-Regular'
  },
  sliderText: {
    marginTop: 30,
    alignSelf: 'center',
    fontFamily: 'Nunito-Regular'
  }
});

export default AddReview;
