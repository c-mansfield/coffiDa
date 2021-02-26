/**
 * @format
 * @flow strict-local
*/

import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import {
  Icon, Text, Layout, TopNavigationAction, TopNavigation, Button, Spinner,
} from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';

import DropDownHolder from 'src/services/DropdownHolder.js';
import RatingCircles from 'src/components/RatingCircles.js';
import LocationReviews from 'src/api/LocationReviews.js';
import UserManagement from 'src/api/UserManagement.js';

const placeholderImage = require('assets/images/reviews_placeholder.png');

const ViewReview = ({ navigation, route }) => {
  const isFocused = useIsFocused();
  const [likeIcon, setLikeIcon] = useState('heart-outline');
  const [like, setLike] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [review, setReview] = useState(null);
  const [location, setLocation] = useState(null);
  const [dataLoading, setDataLoading] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLike(false);
      setLikeIcon('heart-outline');
      await getReview();
      setDataLoading(true);
    };

    fetchData();
  }, [isFocused]);

  useEffect(() => {
    if (dataLoading) {
      const fetchData = async () => {
        await setReviewLike();

        await getPhoto();
        setIsLoading(false);
      };

      fetchData();
    }
  }, [dataLoading]);

  const getReview = async () => {
    const userID = await AsyncStorage.getItem('@userID');
    const response = await UserManagement.getUser(userID);

    if (response.success) {
      const reviewData = await response.body.reviews.find((r) => { return r.review.review_id === route.params.reviewID; });

      setLocation(reviewData.location);
      setReview(reviewData.review);
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
    if (await route.params.likedReviews.includes(review.review_id)) {
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


  const renderRightActions = () => {
    return (
      <>
        <TopNavigationAction icon={EditIcon} />
        <TopNavigationAction icon={TrashIcon} />
      </>
    );
  };

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} />
  );

  const BackIcon = (props) => (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Icon {...props} name="arrow-back" />
    </TouchableOpacity>
  );

  const EditIcon = (props) => (
    <TouchableOpacity onPress={() => navigation.navigate('EditReview', { reviewDefault: review, locationData: location })}>
      <Icon {...props} name="edit" />
    </TouchableOpacity>
  );

  const TrashIcon = (props) => (
    <TouchableOpacity onPress={() => checkUserDeleteReview()}>
      <Icon {...props} name="trash" />
    </TouchableOpacity>
  );

  const HeartIcon = (props) => (
    <Icon {...props} name={likeIcon} />
  );

  return (
    <Layout level="2" style={styles.detailsMain}>
      <TopNavigation
        accessoryLeft={BackAction}
        alignment="center"
        title="View Review"
        accessoryRight={renderRightActions}
      />
      { isLoading
        ? (
          <>
            <View style={{
              flex: 1, justifyContent: 'center', flexDirection: 'row', padding: 10,
            }}
            >
              <Spinner />
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
                : (
                  <Image
                    style={styles.reviewImage}
                    source={placeholderImage}
                  />
                )}
            </View>

            <View style={styles.sectionStyle}>
              <Text category="h4" numberOfLines={1}>
                {location.location_name}, {location.location_town}
              </Text>

              <Text category="s1" style={{ marginTop: 5 }}>"{review.review_body}"</Text>
            </View>

            <View style={styles.sectionStyle}>
              <Text style={{ marginBottom: 5 }} category="h6" appearance="hint">Overall rating</Text>
              <RatingCircles rating={review.overall_rating} />
            </View>

            <View style={styles.sectionStyle}>
              <Text style={{ marginBottom: 5 }} category="s1" appearance="hint">Price rating</Text>
              <RatingCircles rating={review.price_rating} />
            </View>

            <View style={styles.sectionStyle}>
              <Text style={{ marginBottom: 5 }} category="s1" appearance="hint">Quality rating</Text>
              <RatingCircles rating={review.quality_rating} />
            </View>

            <View style={styles.sectionStyle}>
              <Text style={{ marginBottom: 5 }} category="s1" appearance="hint">Clenliness rating</Text>
              <RatingCircles rating={review.clenliness_rating} />
            </View>

            <View style={styles.likeButton}>
              <Button
                accessoryLeft={HeartIcon}
                status="danger"
                onPress={() => changeLike()}
                appearance="outline"
                size="small"
              >
                {review.likes}
              </Button>
            </View>
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
  },
  likesImage: {
    width: 32,
    height: 32,
  },
  likesText: {
    alignSelf: 'center',
    marginLeft: 5,
  },
  likeButton: {
    marginTop: 15,
    flexDirection: 'row',
  }
});

ViewReview.propTypes = {

};

export default ViewReview;
