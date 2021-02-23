import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import PropTypes from 'prop-types';
import { Icon, Text, Layout } from '@ui-kitten/components';

import DropDownHolder from 'src/services/DropdownHolder.js';
import RatingCircles from 'src/components/RatingCircles.js';
import LocationReviews from 'src/api/LocationReviews.js';

const ViewReview = ({ navigation, route }) => {
  const isFocused = useIsFocused();
  const {
    location,
    review,
    likedReviews,
  } = route.params;
  const [likeIcon, setLikeIcon] = useState('heart-outline');
  const [like, setLike] = useState(null);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setReviewLike();
      await getPhoto();
    };

    fetchData();
  }, [isFocused]);

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

  const deleteReview = async () => {
    const response = await LocationReviews.deleteReview(location.location_id, review.review_id);

    if (response) {
      navigation.navigate('ReviewsTabNavigation');
      DropDownHolder.success('Success', 'Review Deleted');
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

  const setReviewLike = () => {
    if (likedReviews) {
      if (likedReviews.includes(review.review_id)) {
        setLikeIcon('heart');
        setLike(true);
      }
    } else {
      setLikeIcon('heart-outline');
      setLike(false);
    }
  };

  const changeLike = async () => {
    if (like) {
      const response = await LocationReviews.removeLikeReview(location.location_id, review.review_id);

      if (response) {
        review.likes--;
        setLikeIcon('heart-outline');
        setLike(false);
      }
    } else {
      const response = await LocationReviews.likeReview(location.location_id, review.review_id);

      if (response) {
        setLikeIcon('heart');
        setLike(true);
        review.likes++;
      }
    }
  };

  const getPhoto = async () => {
    const response = await LocationReviews.getReviewPhoto(location.location_id, review.review_id);
    
    if (response) {
      const reader = new FileReader();
      reader.readAsDataURL(response);

      reader.onloadend = () => {
        setPhoto({ uri: reader.result });
      };
    }
  };

  const navigateToEdit = () => {
    navigation.navigate('Edit Review', { review, location });
  };

  return (
    <Layout level="2" style={styles.detailsMain}>
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
          <Text style={{ fontFamily: 'Nunito-Bold', fontSize: 22 }}>{location.location_name}, {location.location_town}</Text>

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

        <View style={styles.likesSection}>
          <TouchableOpacity onPress={() => changeLike()}>
            <Icon style={styles.likesImage} fill="#000000" name={likeIcon} />
          </TouchableOpacity>
          <Text style={styles.likesText}>{review.likes} likes</Text>
        </View>
      </View>
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
