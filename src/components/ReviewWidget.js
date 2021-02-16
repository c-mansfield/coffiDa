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

const ReviewWidget = (props) => {
  const isFocused = useIsFocused();
  const [likeIcon, setLikeIcon] = useState('heart-outline');
  const [like, setLike] = useState(false);
  const { likedReviews } = props;

  useEffect(() => {
    const fetchData = async () => {
      await setReviewLike();
    };

    fetchData();
  }, [isFocused, props.refresh]);

  const setReviewLike = () => {
    if (likedReviews) {
      if (likedReviews.includes(props.review.review_id)) {
        console.log('Hit ', props.review.review_id);
        setLikeIcon('heart');
        setLike(true);
      }
    }
  };

  const changeLike = async () => {
    if (like) {
      const response = await LocationReviews.removeLikeReview(props.location.location_id, props.review.review_id);

      if (response) {
        props.review.likes--;
        setLikeIcon('heart-outline');
        setLike(false);
      }
    } else {
      const response = await LocationReviews.likeReview(props.location.location_id, props.review.review_id);

      if (response) {
        setLikeIcon('heart');
        setLike(true);
        props.review.likes++;
      }
    }

    // Refresh the screen when like/unlike
    props.refresh = !props.refresh;
  };

  return (
    <TouchableOpacity>
      <View style={styles.widgetMain}>
        <View style={styles.textWrapper}>
          <Text style={styles.header} numberOfLines={1}>"{props.review.review_body}"</Text>
          {
            props.myReview
              ? (
                <Text style={styles.subHeading}>
                  {props.location.location_name}
                  ,
                  {' '}
                  {props.location.location_town}
                </Text>
)
              : null
          }
          <View style={styles.ratingStyle}>
            <RatingCircles rating={props.review.overall_rating} />
          </View>

          <View style={styles.likesSection}>
            <TouchableOpacity onPress={() => changeLike()} style={styles.detailsHeaderRHS}>
              <Icon style={styles.likesImage} fill="#000000" name={likeIcon} />
            </TouchableOpacity>
            <Text style={styles.likesText}>{props.review.likes}</Text>
          </View>
        </View>
        <View style={styles.imageWrapper}>
          <Image
            style={styles.reviewImage}
            source={require('assets/images/reviews_placeholder.jpg')}
          />
        </View>
      </View>
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
    borderRadius: 4
  },
  textWrapper: {
    flex: 3,
  },
  header: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: '#707070'
  },
  subHeading: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#707070'
  },
  likesSection: {
    flexDirection: 'row',
    marginTop: 10,
  },
  likesImage: {
    width: 25,
    height: 25,
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
  review: PropTypes.object,
  likedReviews: PropTypes.array,
  location: PropTypes.object,
  myReview: PropTypes.bool
};

export default ReviewWidget;
