/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import { Slider } from 'react-native-elements';
import { Toggle, Button } from '@ui-kitten/components';

const SearchFilterModal = (props) => {

  const [filters, setFilters] = useState({ overall_rating: 0, price_rating: 0, quality_rating: 0, clenliness_rating: 0 });
  const [filterChecked, setFilterChecked] = useState({ overall_rating_checked: false, price_rating_checked: false, quality_rating_checked: false, cleanliness_rating_checked: false });

  const setFilterObject = async () => {
    let filtersObj = await buildFiltersObject();
    props.setSearchQuery(filtersObj);
    props.toggleModal();
    await props.searchLocations();
  };

  //FIX - async await here
  const buildFiltersObject = async () => {
    let filtersCopy = filters;

    // Checks if element in object is toggled to be filtered
    await Object.entries(filters).forEach(filter => {
      if(!filterChecked[filter[0] + '_checked']) {
        delete filtersCopy[filter[0]];
      }
    });

    return filtersCopy;
  };

  return (
    <Modal
      isVisible={props.modalVisible}
      swipeDirection={['down']}
      style={styles.modalMain}
      onBackdropPress={props.toggleModal}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Filter by</Text>

          <View style={styles.filterSection}>
            <View style={styles.filterTitleToggle}>
              <Text style={styles.subHeadingBold}>Overall Rating</Text>
              <Toggle
                checked={filterChecked['overall_rating_checked']}
                onChange={(checked) => setFilterChecked(filterChecked => ({ ...filterChecked, overall_rating_checked: checked }))}
                style={styles.toggleStyle}
                status={'info'}
              />
            </View>
            { filterChecked['overall_rating_checked'] ?
              <Slider
                value={filters['overall_rating']}
                onValueChange={(value) => setFilters(filterChecked => ({ ...filterChecked, overall_rating: value }))}
                maximumValue={5}
                minimumValue={0}
                step={1}
                thumbStyle={{ height: 30, width: 30, backgroundColor: '#C3B299' }}
                thumbProps={{
                  children: (
                    <Text style={styles.sliderText}>{filters['overall_rating']}</Text>
                  ),
              }}
              />
              : null
            }

            <View style={styles.filterTitleToggle}>
              <Text style={styles.subHeadingBold}>Price Rating</Text>
              <Toggle
                checked={filterChecked['price_rating_checked']}
                onChange={(checked) => setFilterChecked(filterChecked => ({ ...filterChecked, price_rating_checked: checked }))}
                style={styles.toggleStyle}
                status={'info'}
              />
            </View>
            { filterChecked['price_rating_checked'] ?
              <Slider
                value={filters['price_rating']}
                onValueChange={(value) => setFilters(filterChecked => ({ ...filterChecked, price_rating: value }))}
                maximumValue={5}
                minimumValue={0}
                step={1}
                thumbStyle={{ height: 30, width: 30, backgroundColor: '#C3B299' }}
                thumbProps={{
                  children: (
                    <Text style={styles.sliderText}>{filters['price_rating']}</Text>
                  ),
              }}
              />
              : null
            }

            <View style={styles.filterTitleToggle}>
              <Text style={styles.subHeadingBold}>Quality Rating</Text>
              <Toggle
                checked={filterChecked['quality_rating_checked']}
                onChange={(checked) => setFilterChecked(filterChecked => ({ ...filterChecked, quality_rating_checked: checked }))}
                style={styles.toggleStyle}
                status={'info'}
              />
            </View>
            { filterChecked['quality_rating_checked'] ?
              <Slider
                value={filters['quality_rating']}
                onValueChange={(value) => setFilters(filterChecked => ({ ...filterChecked, quality_rating: value }))}
                maximumValue={5}
                minimumValue={0}
                step={1}
                thumbStyle={{ height: 30, width: 30, backgroundColor: '#C3B299' }}
                thumbProps={{
                  children: (
                    <Text style={styles.sliderText}>{filters['quality_rating']}</Text>
                  ),
              }}
              />
              : null
            }

            <View style={styles.filterTitleToggle}>
              <Text style={styles.subHeadingBold}>Cleanliness Rating</Text>
              <Toggle
                checked={filterChecked['cleanliness_rating_checked']}
                onChange={(checked) => setFilterChecked(filterChecked => ({ ...filterChecked, cleanliness_rating_checked: checked }))}
                style={styles.toggleStyle}
                status={'info'}
              />
            </View>
            { filterChecked['cleanliness_rating_checked'] ?
              <Slider
                value={filters['cleanliness_rating']}
                onValueChange={(value) => setFilters(filterChecked => ({ ...filterChecked, cleanliness_rating: value }))}
                maximumValue={5}
                minimumValue={0}
                step={1}
                thumbStyle={{ height: 30, width: 30, backgroundColor: '#C3B299' }}
                thumbProps={{
                  children: (
                    <Text style={styles.sliderText}>{filters['cleanliness_rating']}</Text>
                  ),
              }}
              />
              : null
            }
            </View>

          <Button onPress={setFilterObject} status={'success'}>
            Apply filters
          </Button>

        </View>
    </Modal>
  );

};

const styles = StyleSheet.create({
  modalMain: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: 26,
    fontFamily: 'Nunito-Bold'
  },
  subHeadingBold: {
    fontSize: 18,
    fontFamily: 'Nunito-Regular'
  },
  filterSection: {
    marginTop: 10,
    marginBottom: 20
  },
  filterTitleToggle: {
    flexDirection: 'row',
    marginTop: 20
  },
  toggleStyle: {
    marginLeft: 'auto'
  },
  sliderText: {
    marginTop: 30,
    alignSelf: 'center',
    fontFamily: 'Nunito-Regular'
  },
  buttonStyle: {
    fontFamily: 'Nunito-Regular'
  }
});

export default SearchFilterModal;
