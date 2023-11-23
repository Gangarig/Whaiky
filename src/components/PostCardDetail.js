import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Global } from '../constant/Global';
import Colors from '../constant/Colors';
import Shadow, { shadowStyle } from '../constant/Shadow';
import FastImage from 'react-native-fast-image';
const PostCardDetail = ({ post }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const selectImage = (index) => {
    setSelectedImageIndex(index);
  };

  return (
    <ScrollView style={styles.postContainer}>
      {post.images.length > 0 && (
        <View style={styles.imageWrapper}>
            {post.images.map((image, index) => (
              <TouchableOpacity key={index} onPress={() => selectImage(index)}>
              <FastImage
                source={{ uri: image }}
                style={[
                  styles.image,
                  index === selectedImageIndex && styles.selectedImage,
                ]}
              />
              </TouchableOpacity>
            ))}
        </View>
      )}
      <View style={styles.postInfo}>
        <View style={styles.postTitle}>
          <Text style={[Global.titleSecondary, styles.title]}>{post.title}</Text>
          <View style={styles.detail}>
            <Text style={[Global.textSecondary, styles.date]}>{post.date}</Text>
            <Text style={[Global.textSecondary, styles.address]}>{post.address}</Text>
          </View>
        </View>
        <View style={styles.priceWrapper}>
          {/* {saleprice && (
            <Text style={[styles.priceSale, Global.titleSecondary]}>{post.saleprice} $</Text>
          )} */}
          <Text style={[styles.price, Global.titleSecondary]}>{post.price} $</Text>
        </View>
      </View>
      <View style={[styles.postDescription]}>
        <Text style={[Global.text, styles.desc]}>{post.description}</Text>
      </View>
    </ScrollView>
  );
};

export default PostCardDetail;

const styles = StyleSheet.create({
  postContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.background,
    borderRadius: 5,
    padding: 20,
  },
  imageWrapper: {
    width: '100%',
    marginBottom: 20,
    gap: 10,
    ...shadowStyle
  },
  image: {
    height: 300,
    borderRadius: 10,
    resizeMode: 'cover',
    marginRight: 10, 
    width: '100%',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  postInfo: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
  },
  postDescription: {
    width: '100%',
    marginTop: 20,
  },
  detail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  title: {
    fontSize: 20,
    color: Colors.lightPrimary,
  },
  price: {
    color: Colors.lightPrimary,
  },
  priceSale: {
    color: Colors.lightPrimary,
    textDecorationStyle: 'solid',
    opacity: 0.5,
  },
});
