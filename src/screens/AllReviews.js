/**
 * @format
 * @flow strict-local
*/

import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import {
  Layout,
} from '@ui-kitten/components';

import ExpandableReviewWidget from 'src/components/ExpandableReviewWidget.js';

const AllReviews = ({ route }) => {
  const { location, likedReviews } = route.params;

  return (
    <Layout level="1" style={styles.main}>
      <FlatList
        data={location.location_reviews}
        renderItem={({ item }) => (
          <ExpandableReviewWidget review={item} location={location} likedReviews={likedReviews} />
        )}
        keyExtractor={(item) => item.review_id.toString()}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  main: {
    padding: 15,
    flex: 1,
  },
});

export default AllReviews;
