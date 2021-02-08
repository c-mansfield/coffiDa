import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import { Tile } from 'react-native-elements';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const LocationTile = ({ location }) => {

  return (
    <View style={styles.tile}>
      <ImageBackground source={{uri: location.photo_path}} style={styles.image}>
        <View style={styles.overlay}>
          <Text style={{ fontSize: 20, fontFamily: 'Nunito-Bold' }}>{location.location_name}</Text>
          <Text style={{ fontSize: 14, color: '#504F4F' }}>{location.location_town}</Text>
          <Text style={{ fontSize: 8 }}>{location.avg_overall_rating}</Text>
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
    justifyContent: 'flex-end',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor:'rgba(255,255,255,0.7)',
    justifyContent: 'flex-end',
    padding: 5
  }
});


export default LocationTile;
