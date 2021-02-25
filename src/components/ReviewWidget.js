/**
 * @format
 * @flow strict-local
*/

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Text, Icon } from '@ui-kitten/components';
import { useIsFocused } from '@react-navigation/native';
import PropTypes from 'prop-types';

import RatingCircles from 'src/components/RatingCircles.js';
import LocationReviews from 'src/api/LocationReviews.js';
import DropDownHolder from 'src/services/DropdownHolder.js';

const ReviewWidget = (props) => {
  const isFocused = useIsFocused();
  const [likeIcon, setLikeIcon] = useState('heart-outline');
  const [like, setLike] = useState(false);
  let {
    likedReviews,
    location,
    review,
  } = props;

  useEffect(() => {
    const fetchData = async () => {
      await setReviewLike();
    };

    setLikeIcon('heart-outline');
    setLike(false);
    fetchData();
  }, [isFocused]);

  const setReviewLike = () => {
    if (likedReviews.includes(review.review_id)) {
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

      const index = likedReviews.indexOf(review.review_id);
      if (index > -1) {
        likedReviews.splice(index, 1);
      }

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
      likedReviews.push(review.review_id);

      return true;
    }

    DropDownHolder.error('Error', response.error);
    return false;
  };

  return (
    <View style={styles.widgetMain}>
      <View style={styles.textWrapper}>
        <Text style={styles.header} numberOfLines={1}>"{review.review_body}"</Text>
        <Text style={styles.subHeading}>
          {location.location_name}
          ,
          {' '}
          {location.location_town}
        </Text>
        <View style={styles.ratingStyle}>
          <RatingCircles rating={review.overall_rating} />
        </View>

        <TouchableOpacity onPress={() => changeLike()} style={styles.likesSection}>
          <Icon style={styles.likesImage} fill="#000000" name={likeIcon} />
          <Text style={styles.likesText}>{review.likes}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.imageWrapper} />
    </View>
  );
};

const styles = StyleSheet.create({
  widgetMain: {
    marginTop: 5,
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderColor: 'rgb(224, 224, 224)',
    borderWidth: 1,
    borderRadius: 4,
  },
  textWrapper: {
  },
  header: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: '#707070',
  },
  subHeading: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#707070',
  },
  likesSection: {
    flexDirection: 'row',
    marginTop: 10,
  },
  likesImage: {
    width: 30,
    height: 30,
  },
  likesText: {
    fontSize: 10,
    fontFamily: 'Nunito-Regular',
    alignSelf: 'center',
  },
  imageWrapper: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    flex: 1,
  },
  reviewImage: {
    width: 80,
    height: 80,
    borderRadius: 80 / 2,
  },
  ratingStyle: {
    marginTop: 10,
  },
});

ReviewWidget.propTypes = {
  review: PropTypes.object.isRequired,
  likedReviews: PropTypes.array.isRequired,
  location: PropTypes.object.isRequired,
};

export default ReviewWidget;
