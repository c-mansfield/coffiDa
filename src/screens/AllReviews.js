/**
 * @format
 * @flow strict-local
*/

import React from 'react';
import {
  StyleSheet, FlatList, TouchableOpacity, View,
} from 'react-native';
import {
  Layout, Icon, TopNavigationAction, TopNavigation,
} from '@ui-kitten/components';

import ExpandableReviewWidget from 'src/components/ExpandableReviewWidget.js';

const AllReviews = ({ navigation, route }) => {
  const { location, likedReviews } = route.params;

  const BackIcon = (props) => (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Icon {...props} name="arrow-back" />
    </TouchableOpacity>
  );

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} />
  );

  return (
    <Layout level="1" style={styles.main}>
      <TopNavigation
        accessoryLeft={BackAction}
        alignment="center"
        title="Nearby Locations"
      />
      <View style={{padding: 15}}>
        <FlatList
          data={location.location_reviews}
          renderItem={({ item }) => (
            <ExpandableReviewWidget review={item} location={location} likedReviews={likedReviews} />
          )}
          keyExtractor={(item) => item.review_id.toString()}
        />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
});

export default AllReviews;
