/**
 * @format
 * @flow strict-local
*/

import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Icon, Text, Layout } from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';

import DropDownHolder from 'src/services/DropdownHolder.js';
import RatingCircles from 'src/components/RatingCircles.js';
import LocationReviews from 'src/api/LocationReviews.js';
import UserManagement from 'src/api/UserManagement.js';

const ViewReview = ({ navigation, route }) => {
  const isFocused = useIsFocused();
  const {
    reviewID,
    likedReviews,
  } = route.params;
  const [likeIcon, setLikeIcon] = useState('heart-outline');
  const [like, setLike] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [review, setReview] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLike(false);
      setLikeIcon('heart-outline');
      await getReview();
      setIsLoading(false);
    };

    setIsLoading(true);
    fetchData();
  }, [isFocused]);

  useEffect(() => {
    const fetchData = async () => {
      await setReviewLike();
      await getPhoto();
    };

    fetchData();
  }, [review]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flex: 1, flexDirection: 'row', padding: 15 }}>
          <TouchableOpacity onPress={() => navigateToEdit()}>
            <Icon style={{ height: 28, width: 28 }} fill="#000000" name="edit" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => checkUserDeleteReview()} style={{ marginLeft: 10 }}>
            <Icon style={{ height: 28, width: 28 }} fill="#000000" name="trash" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const getReview = async () => {
    const userID = await AsyncStorage.getItem('@userID');
    const response = await UserManagement.getUser(userID);

    if (response.success) {
      const reviewData = await response.body.reviews.find((r) => { return r.review.review_id === reviewID; });

      console.log(reviewData);
      setReview(reviewData.review);
      setLocation(reviewData.location);
    } else {
      DropDownHolder.error('Error', response.error);
    }
  };

  const deleteReview = async () => {
    const response = await LocationReviews.deleteReview(location.location_id, review.review_id);

    if (response.success) {
      navigation.navigate('ReviewsTabNavigation');
      DropDownHolder.success('Success', 'Review Deleted');
    } else {
      DropDownHolder.error('Error', response.error);
    }
  };

  const checkUserDeleteReview = () => {
    Alert.alert(
      'Review Delete',
      'Are you sure you want to delete this review?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'Yes', onPress: () => deleteReview() },
      ],
    );
  };

  const setReviewLike = async () => {
    if (await likedReviews.includes(review.review_id)) {
      setLikeIcon('heart');
      setLike(true);

      return true;
    }

    setLikeIcon('heart-outline');
    setLike(false);

    return false;
  };

  const changeLike = async () => {
    let done = false;

    if (like) {
      done = await unLikeReview();
    } else {
      done = await likeReview();
    }

    return done;
  };

  const unLikeReview = async () => {
    const response = await LocationReviews.removeLikeReview(location.location_id, review.review_id);

    if (response.success) {
      review.likes--;
      setLikeIcon('heart-outline');
      setLike(false);

      return true;
    }

    DropDownHolder.error('Error', response.error);
    return false;
  };

  const likeReview = async () => {
    const response = await LocationReviews.likeReview(location.location_id, review.review_id);

    if (response.success) {
      review.likes++;
      setLikeIcon('heart');
      setLike(true);

      return true;
    }

    DropDownHolder.error('Error', response.error);
    return false;
  };

  const getPhoto = async () => {
    const response = await LocationReviews.getReviewPhoto(location.location_id, review.review_id);

    if (response.success) {
      const reader = new FileReader();
      reader.readAsDataURL(response.body);

      reader.onloadend = () => {
        setPhoto({ uri: reader.result });
      };
    } else if (response.status === 500) {
      DropDownHolder.error('Error', response.error);
    }
  };

  const navigateToEdit = () => {
    navigation.navigate('Edit Review', { review, location });
  };

  return (
    <Layout level="2" style={styles.detailsMain}>
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
          <View style={styles.detailsInformation}>
            <View style={styles.imageWrapper}>
              { photo ? (
                <Image
                  style={styles.reviewImage}
                  source={{ uri: photo.uri }}
                />
              )
                : null}
            </View>

            <View style={styles.sectionStyle}>
              <Text
                style={{ fontFamily: 'Nunito-Bold', fontSize: 22 }}
              >
                {location.location_name}, {location.location_town}
              </Text>

              <Text style={{ fontFamily: 'Nunito-Regular', fontSize: 18, marginTop: 5 }}>"{review.review_body}"</Text>
            </View>

            <View style={styles.sectionStyle}>
              <Text style={{
                fontSize: 18, fontFamily: 'Nunito-Bold', color: '#707070', marginTop: 10,
              }}
              >Overall rating
              </Text>
              <RatingCircles rating={review.overall_rating} />
            </View>

            <View style={styles.sectionStyle}>
              <Text style={{
                fontSize: 18, fontFamily: 'Nunito-Regular', color: '#707070', marginTop: 10,
              }}
              >Price rating
              </Text>
              <RatingCircles rating={review.price_rating} />
            </View>

            <View style={styles.sectionStyle}>
              <Text style={{
                fontSize: 18, fontFamily: 'Nunito-Regular', color: '#707070', marginTop: 10,
              }}
              >Quality rating
              </Text>
              <RatingCircles rating={review.quality_rating} />
            </View>

            <View style={styles.sectionStyle}>
              <Text style={{
                fontSize: 18, fontFamily: 'Nunito-Regular', color: '#707070', marginTop: 10,
              }}
              >Clenliness rating
              </Text>
              <RatingCircles rating={review.clenliness_rating} />
            </View>

            <TouchableOpacity onPress={() => changeLike()} style={styles.likesSection}>
              <Icon style={styles.likesImage} fill="#000000" name={likeIcon} />
              <Text style={styles.likesText}>{review.likes}</Text>
            </TouchableOpacity>
          </View>
        )}
    </Layout>
  );
};

const styles = StyleSheet.create({
  detailsMain: {
    flex: 1,
    flexDirection: 'column',
  },
  iconSize: {
    height: 38,
    width: 38,
  },
  imageWrapper: {
  },
  reviewImage: {
    width: 120,
    height: 120,
    borderRadius: 120 / 2,
  },
  detailsInformation: {
    padding: 25,
  },
  sectionStyle: {
    marginTop: 10,
  },
  likesSection: {
    flexDirection: 'row',
    marginTop: 15,
  },
  likesImage: {
    width: 32,
    height: 32,
  },
  likesText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    alignSelf: 'center',
    marginLeft: 5,
  },
});

ViewReview.propTypes = {

};

export default ViewReview;
