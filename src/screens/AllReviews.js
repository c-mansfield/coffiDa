/**
 * @format
 * @flow strict-local
*/

import React, { useEffect } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import {
  Layout,
} from '@ui-kitten/components';
import { useIsFocused } from '@react-navigation/native';

import ExpandableReviewWidget from 'src/components/ExpandableReviewWidget.js';

const AllReviews = ({ route }) => {
  const isFocused = useIsFocused();
  const { location } = route.params;

  useEffect(() => {
  }, [isFocused]);

  return (
    <Layout level="1" style={styles.main}>
      <FlatList
        data={location.location_reviews}
        renderItem={({ item }) => (
          <ExpandableReviewWidget review={item} location={location} />
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
