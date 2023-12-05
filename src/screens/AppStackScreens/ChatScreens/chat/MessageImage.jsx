import React  from 'react';
import { View, Image, StyleSheet, FlatList } from 'react-native';
import FastImage from 'react-native-fast-image';
import ImageView from "react-native-image-viewing";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Colors from '../../../../constant/Colors';
import { shadowStyle } from '../../../../constant/Shadow';

const MessageImage = ({ currentMessage }) => {
  const imageUrls = currentMessage.image;

  if (!imageUrls || imageUrls.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {imageUrls.map((imageUrl) => (
          <FastImage
            key={imageUrl}
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
      ))
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 10,
    maxWidth: 400,
    height: 110,

    ...shadowStyle,
    borderRadius: 13,

  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 13,
    margin: 5,
  },

});

export default MessageImage;
