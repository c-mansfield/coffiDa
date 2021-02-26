/**
 * @format
 * @flow strict-local
*/

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {
  Text, Icon, Layout, Button,
} from '@ui-kitten/components';
import { useIsFocused } from '@react-navigation/native';

import RatingCircles from 'src/components/RatingCircles.js';
import LocationReviews from 'src/api/LocationReviews.js';
import DropDownHolder from 'src/services/DropdownHolder.js';

const ReviewWidget = (props) => {
  const isFocused = useIsFocused();
  const [likeIcon, setLikeIcon] = useState('heart-outline');
  const [like, setLike] = useState(false);
  const {
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

  const HeartIcon = (propsIcon) => (
    <Icon {...propsIcon} name={likeIcon} />
  );

  return (
    <Layout level="3" style={styles.widgetMain}>
      <View style={styles.widgetWrapper}>
        <Text category="h6" numberOfLines={1}>&ldquo;{review.review_body}&rdquo;</Text>
        <Text category="s1" appearance="hint">
          {location.location_name}
          ,
          {' '}
          {location.location_town}
        </Text>
        <View style={styles.ratingStyle}>
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
      <View style={styles.imageWrapper} />
    </Layout>
  );
};

const styles = StyleSheet.create({
  widgetMain: {
    marginTop: 5,
    flexDirection: 'row',
    flex: 1,
    padding: 15,
    borderColor: 'rgb(224, 224, 224)',
    borderWidth: 0.5,
    borderRadius: 4,
  },
  likesSection: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
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
  ratingStyle: {
    flexDirection: 'row',
    marginTop: 10,
  },
  likeButton: {
    marginTop: 15,
    flexDirection: 'row',
  },
});

export default ReviewWidget;
