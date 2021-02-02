import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import { Tile } from 'react-native-elements';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const LocationTile = (props) => {

  return (
    <View style={styles.tile}>
      <ImageBackground source={require('assets/images/location_placeholder.jpg')} style={styles.image}>
        <View style={styles.overlay}>
          <Text style={{ fontSize: 20, fontFamily: 'Nunito-Bold' }}>Location Name</Text>
          <Text style={{ fontSize: 14, color: '#504F4F' }}>Manchester, UK</Text>
          <Text style={{ fontSize: 8 }}>REVIEWS</Text>
        </View>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  tile: {
    width: (width/2)-15,
    height: (width/2)-15,
    flex: 1,
    justifyContent: 'flex-end'
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor:'rgba(255,255,255,0.7)',
    justifyContent: 'flex-end'
  }
});


export default LocationTile;

// <Tile
//    imageSrc={require('assets/images/location_placeholder.jpg')}
//    width={width/2}
//    contentContainerStyle={{ height: 20 }}
//    activeOpacity={0.8}
//    imageProps={{ resizeMode: "cover" }}
//    imageContainerStyle={{ marginHorizontal: 8 }}
//    title={'Test'}
//  >
//  </Tile>
