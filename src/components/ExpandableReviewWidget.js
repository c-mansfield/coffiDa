/**
 * @format
 * @flow strict-local
*/

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Text, Icon } from '@ui-kitten/components';
import { useIsFocused } from '@react-navigation/native';
import PropTypes from 'prop-types';

import RatingCircles from 'src/components/RatingCircles.js';
import LocationReviews from 'src/api/LocationReviews.js';
import DropDownHolder from 'src/services/DropdownHolder.js';

const ExpandableReviewWidget = (props) => {
  const isFocused = useIsFocused();
  const [likeIcon, setLikeIcon] = useState('heart-outline');
  const [like, setLike] = useState(null);
  const {
    likedReviews,
    myReview,
    location,
    review,
  } = props;
  const [expanded, setExpanded] = useState(false);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLike(false);
      setLikeIcon('heart-outline');
      await setReviewLike();
    };

    fetchData();
  }, [isFocused]);

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
    let done = false;

    if (like) {
      done = await likeReview();
    } else {
      done = await unLikeReview();
    }

    return done;
  };

  const likeReview = async () => {
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

  const unLikeReview = async () => {
    const response = await LocationReviews.likeReview(location.location_id, review.review_id);

    if (response.success) {
      setLikeIcon('heart');
      setLike(true);
      review.likes++;

      return true;
    }

    DropDownHolder.error('Error', response.error);
    return false;
  };

  const expandWidget = async () => {
    setExpanded(!expanded);

    await checkReviewPhoto();
  };

  // Checks if photo already pulled from db, stops uneccassary calls to the DB
  const checkReviewPhoto = async () => {
    if (!photo) {
      await getPhoto();
    }
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

  return (
    <TouchableOpacity onPress={() => expandWidget()} style={styles.widgetMain}>
      { expanded
        ? (
          <>
            <View style={styles.textWrapper}>
              <Text style={styles.header}>"{review.review_body}"</Text>
              {
                myReview
                  ? (
                    <Text style={styles.subHeading}>
                      {location.location_name}
                      ,
                      {' '}
                      {location.location_town}
                    </Text>
                  )
                  : null
              }
              <View style={styles.ratingStyleOverall}>
                <RatingCircles rating={review.overall_rating} />
                <Text style={{ fontSize: 14, fontFamily: 'Nunito-Bold', marginLeft: 10 }}>Overall rating</Text>
              </View>

              <View style={styles.ratingStyle}>
                <RatingCircles rating={review.price_rating} />
                <Text style={{ fontSize: 14, fontFamily: 'Nunito-Regular', marginLeft: 10 }}>Price rating</Text>
              </View>

              <View style={styles.ratingStyle}>
                <RatingCircles rating={review.quality_rating} />
                <Text style={{ fontSize: 14, fontFamily: 'Nunito-Regular', marginLeft: 10 }}>Quality rating</Text>
              </View>

              <View style={styles.ratingStyle}>
                <RatingCircles rating={review.clenliness_rating} />
                <Text style={{ fontSize: 14, fontFamily: 'Nunito-Regular', marginLeft: 10 }}>Cleanliness rating</Text>
              </View>

              <TouchableOpacity onPress={() => changeLike()} style={styles.likesSection}>
                <Icon style={styles.likesImage} fill="#000000" name={likeIcon} />
                <Text style={styles.likesText}>{review.likes}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.imageWrapper}>
              { photo ? (
                <Image
                  style={styles.reviewImage}
                  source={{ uri: photo.uri }}
                />
              )
                : null }
            </View>
          </>
        )
        : (
          <>
            <View style={styles.textWrapper}>
              <Text style={styles.header} numberOfLines={1}>"{review.review_body}"</Text>
              {
                myReview
                  ? (
                    <Text style={styles.subHeading}>
                      {location.location_name}
                      ,
                      {' '}
                      {location.location_town}
                    </Text>
                  )
                  : null
              }
              <View style={styles.ratingStyleOverall}>
                <RatingCircles rating={review.overall_rating} />
              </View>

              <TouchableOpacity onPress={() => changeLike()} style={styles.likesSection}>
                <Icon style={styles.likesImage} fill="#000000" name={likeIcon} />
                <Text style={styles.likesText}>{review.likes}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
    </TouchableOpacity>
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
  ratingStyleOverall: {
    flexDirection: 'row',
    marginTop: 10,
  },
  ratingStyle: {
    flexDirection: 'row',
    marginTop: 20,
  },
});

ExpandableReviewWidget.propTypes = {
  review: PropTypes.object,
  likedReviews: PropTypes.array,
  location: PropTypes.object,
  myReview: PropTypes.bool,
  removeLike: PropTypes.bool,
};

export default ExpandableReviewWidget;
