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
import {
  Text, Icon, Layout, Button,
} from '@ui-kitten/components';
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

  const HeartIcon = (props) => (
    <Icon {...props} name={likeIcon} />
  );

  return (
    <Layout level="3" style={styles.widgetMain}>
      <TouchableOpacity onPress={() => expandWidget()} style={{ flex: 1, flexDirection: 'row' }}>
        { expanded
          ? (
            <>
              <View style={styles.textWrapper}>
                <Text category="h6">"{review.review_body}"</Text>
                {
                  myReview
                    ? (
                      <Text category="s1" appearance="hint">
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
                  <Text style={{ marginLeft: 10 }} category="h6">Overall rating</Text>
                </View>

                <View style={styles.ratingStyle}>
                  <RatingCircles rating={review.price_rating} />
                  <Text style={{ marginLeft: 10 }} category="s1">Price rating</Text>
                </View>

                <View style={styles.ratingStyle}>
                  <RatingCircles rating={review.quality_rating} />
                  <Text style={{ marginLeft: 10 }} category="s1">Quality rating</Text>
                </View>

                <View style={styles.ratingStyle}>
                  <RatingCircles rating={review.clenliness_rating} />
                  <Text style={{ marginLeft: 10 }} category="s1">Cleanliness rating</Text>
                </View>

                <View style={styles.likeButton}>
                  <Button
                    accessoryLeft={HeartIcon}
                    status="danger"
                    onPress={() => changeLike()}
                    size="tiny"
                    appearance="outline"
                  >
                    {review.likes}
                  </Button>
                </View>
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
                <Text numberOfLines={1} category="h6">"{review.review_body}"</Text>
                {
                  myReview
                    ? (
                      <Text category="s1" appearance="hint">
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

                <View style={styles.likeButton}>
                  <Button
                    accessoryLeft={HeartIcon}
                    status="danger"
                    onPress={() => changeLike()}
                    size="tiny"
                    appearance="outline"
                  >
                    {review.likes}
                  </Button>
                </View>
              </View>
            </>
          )}
      </TouchableOpacity>
    </Layout>
  );
};

const styles = StyleSheet.create({
  widgetMain: {
    marginTop: 5,
    flexDirection: 'row',
    flex: 1,
    padding: 15,
    borderWidth: 0.5,
    borderRadius: 4,
    borderColor: 'rgb(224, 224, 224)',
  },
  likeButton: {
    marginTop: 15,
    flexDirection: 'row',
  },
  likesImage: {
    width: 30,
    height: 30,
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
    alignItems: 'center',
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
