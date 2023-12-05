import React from 'react';
import { View, Image, StyleSheet, FlatList } from 'react-native';
import FastImage from 'react-native-fast-image';
import ImageView from 'react-native-image-viewing';
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
    <View style={styles.imageWrapper}>
      {imageUrls.map((imageUrl, index) => (
        <View
          key={index}
          style={[
            styles.imageContainer,
            index % 2 === 0 ? styles.evenImageContainer : null,
          ]}
        >
          <TouchableOpacity onPress={() => setIsVisible(true)}>
            <FastImage
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    flexDirection: 'column', 
    ...shadowStyle,
    borderRadius: 13,
    padding: 5,
  },
  imageContainer: {
    flexDirection: 'row', 
    marginVertical: 5, 
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 13,
    marginHorizontal: 5, 
  },
  evenImageContainer: {
    justifyContent: 'flex-end', 
  },
});

export default MessageImage;
