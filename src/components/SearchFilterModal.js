/**
 * @format
 * @flow strict-local
*/

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { Slider } from 'react-native-elements';
import {
  Toggle,
  Text,
  RadioGroup,
  Radio,
  Layout,
} from '@ui-kitten/components';

const SearchFilterModal = (props) => {
  const [filters, setFilters] = useState({
    overall_rating: 0,
    price_rating: 0,
    quality_rating: 0,
    clenliness_rating: 0,
    search_in: 'favourite',
  });
  const [filterChecked, setFilterChecked] = useState({
    overall_rating_checked: false,
    price_rating_checked: false,
    quality_rating_checked: false,
    cleanliness_rating_checked: false,
    search_in_checked: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { modalVisible, toggleModal } = props;

  const setFilterObject = async () => {
    const filtersObj = await buildFiltersObject();
    props.setSearchQuery(filtersObj);
    props.toggleModal();
    await props.searchLocations();
  };

  // FIX - async await here
  const buildFiltersObject = async () => {
    const filtersCopy = filters;

    // Checks if element in object is toggled to be filtered
    await Object.entries(filters).forEach((filter) => {
      if (!filterChecked[`${filter[0]}_checked`]) {
        delete filtersCopy[filter[0]];
      }
    });

    return filtersCopy;
  };

  const updateFilterChecker = (val, field) => {
    setFilterChecked((prevState) => ({ ...prevState, [field]: val }));
  };

  const updateFilters = (val, field) => {
    setFilters((prevState) => ({ ...prevState, [field]: val }));
  };

  const updateIncludeFilter = (index) => {
    setSelectedIndex(index);

    if (index === 0) {
      updateFilters('favourite', 'search_in');
    } else {
      updateFilters('reviewed', 'search_in');
    }
  };

  return (
    <Modal
      isVisible={modalVisible}
      swipeDirection={['down']}
      style={styles.modalMain}
      onBackdropPress={toggleModal}
    >
      <Layout style={styles.modalContent} level="1">
        <Text category="h3">Filter by</Text>

        <View style={styles.filterSection}>
          <View style={styles.filterTitleToggle}>
            <Text category="h6">Overall Rating</Text>
            <Toggle
              checked={filterChecked.overall_rating_checked}
              onChange={(overallCheck) => updateFilterChecker(overallCheck, 'overall_rating_checked')}
              style={styles.toggleStyle}
              status="info"
            />
          </View>
          { filterChecked.overall_rating_checked
            ? (
              <Slider
                value={filters.overall_rating}
                onValueChange={(overallValue) => updateFilters(overallValue, 'overall_rating')}
                maximumValue={5}
                minimumValue={0}
                step={1}
                thumbStyle={{ height: 30, width: 30, backgroundColor: '#C3B299' }}
                thumbProps={{
                  children: (
                    <Text style={styles.sliderText} category="s1">{filters.overall_rating}</Text>
                  ),
                }}
              />
            )
            : null}

          <View style={styles.filterTitleToggle}>
            <Text category="h6">Price Rating</Text>
            <Toggle
              checked={filterChecked.price_rating_checked}
              onChange={(priceCheck) => updateFilterChecker(priceCheck, 'price_rating_checked')}
              style={styles.toggleStyle}
              status="info"
            />
          </View>
          { filterChecked.price_rating_checked
            ? (
              <Slider
                value={filters.price_rating}
                onValueChange={(priceValue) => updateFilters(priceValue, 'price_rating')}
                maximumValue={5}
                minimumValue={0}
                step={1}
                thumbStyle={{ height: 30, width: 30, backgroundColor: '#C3B299' }}
                thumbProps={{
                  children: (
                    <Text style={styles.sliderText} category="s1">{filters.price_rating}</Text>
                  ),
                }}
              />
            )
            : null}

          <View style={styles.filterTitleToggle}>
            <Text category="h6">Quality Rating</Text>
            <Toggle
              checked={filterChecked.quality_rating_checked}
              onChange={(qualityCheck) => updateFilterChecker(qualityCheck, 'quality_rating_checked')}
              style={styles.toggleStyle}
              status="info"
            />
          </View>
          { filterChecked.quality_rating_checked ? (
            <Slider
              value={filters.quality_rating}
              onValueChange={(qualityValue) => updateFilters(qualityValue, 'quality_rating')}
              maximumValue={5}
              minimumValue={0}
              step={1}
              thumbStyle={{ height: 30, width: 30, backgroundColor: '#C3B299' }}
              thumbProps={{
                children: (
                  <Text style={styles.sliderText} category="s1">{filters.quality_rating}</Text>
                ),
              }}
            />
          )
            : null}

          <View style={styles.filterTitleToggle}>
            <Text category="h6">Cleanliness Rating</Text>
            <Toggle
              checked={filterChecked.cleanliness_rating_checked}
              onChange={(cleanlinessCheck) => updateFilterChecker(cleanlinessCheck, 'cleanliness_rating_checked')}
              style={styles.toggleStyle}
              status="info"
            />
          </View>
          { filterChecked.cleanliness_rating_checked
            ? (
              <Slider
                value={filters.cleanliness_rating}
                onValueChange={(cleanlinessValue) => updateFilters(cleanlinessValue, 'cleanliness_rating')}
                maximumValue={5}
                minimumValue={0}
                step={1}
                thumbStyle={{ height: 30, width: 30, backgroundColor: '#C3B299' }}
                thumbProps={{
                  children: (
                    <Text style={styles.sliderText} category="s1">{filters.cleanliness_rating}</Text>
                  ),
                }}
              />
            )
            : null}

          <View style={styles.filterTitleToggle}>
            <Text category="h6">Only Include</Text>
            <Toggle
              checked={filterChecked.search_in_checked}
              onChange={(includedCheck) => updateFilterChecker(includedCheck, 'search_in_checked')}
              style={styles.toggleStyle}
              status="info"
            />
          </View>
          { filterChecked.search_in_checked
            ? (
              <>
                <RadioGroup
                  selectedIndex={selectedIndex}
                  onChange={(index) => updateIncludeFilter(index)}
                  style={styles.filterRadios}
                >
                  <Radio>Favourites</Radio>
                  <Radio>Reviewed</Radio>
                </RadioGroup>
              </>
            )
            : null}

        </View>

        <TouchableOpacity style={styles.applyButton} onPress={setFilterObject}>
          <Text style={{ fontFamily: 'Nunito-Bold', fontSize: 18, color: '#FFFFFF' }}>
            Apply
          </Text>
        </TouchableOpacity>

      </Layout>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalMain: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    padding: 22,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  filterSection: {
    marginTop: 10,
    marginBottom: 20,
  },
  filterRadios: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 10,
  },
  filterTitleToggle: {
    flexDirection: 'row',
    marginTop: 20,
  },
  toggleStyle: {
    marginLeft: 'auto',
  },
  sliderText: {
    marginTop: 30,
    alignSelf: 'center',
  },
  applyButton: {
    backgroundColor: '#247BA0',
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
});

export default SearchFilterModal;
