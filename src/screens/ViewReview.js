import React, { useEffect, useState, useRef } from 'react';
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

import RatingCircles from 'src/components/RatingCircles.js';
import LocationReviews from 'src/api/LocationReviews.js';

const ViewReview = ({ navigation, route }) => {
  const isFocused = useIsFocused();
  const { location, review, likedReviews, alertMessage } = route.params;
  const [likeIcon, setLikeIcon] = useState('heart-outline');
  const [like, setLike] = useState(null);

  useEffect(() => {
    setReviewLike();
  }, [isFocused]);

  const deleteReview = async () => {
    const response = await LocationReviews.deleteReview(location.location_id, review.review_id);

    if (response) {
      navigation.navigate('ReviewsTabNavigation');
      alertMessage('success', 'Success', 'Review Deleted');
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

  return (
    <Layout level="2" style={styles.detailsMain}>
      <View style={styles.detailsHeader}>
        <View style={styles.headerLeftIcons}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon style={styles.iconSize} fill="#000000" name="arrow-back" />
          </TouchableOpacity>
        </View>
        <View style={styles.headerRightIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('EditReview', { review, location })}>
            <Icon style={styles.iconSize} fill="#000000" name="edit" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => checkUserDeleteReview()} style={{ marginLeft: 15 }}>
            <Icon style={styles.iconSize} fill="#000000" name="trash" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.detailsInformation}>
        <View style={styles.imageWrapper}>
          <Image
            style={styles.reviewImage}
            source={require('assets/images/reviews_placeholder.jpg')}
          />
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
  detailsHeader: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 15,
    paddingBottom: 15,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  headerLeftIcons: {
    flexDirection: 'row',
    flex: 3,
  },
  headerRightIcons: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flex: 1,
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
    marginLeft: 5
  },
});

ViewReview.propTypes = {

};

export default ViewReview;
