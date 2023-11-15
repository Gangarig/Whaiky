import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Colors from '../constant/Colors';
import {Global} from '../constant/Global';
import Default from '../assets/images/default.png';
import FastImage from 'react-native-fast-image';

const PostCard = ({ owner,postTitle, postImageSource,onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.postCardContainer]}>
      <View style={[styles.postCardWrapper]}>
        <View style={styles.postImageWrapper}>
            {postImageSource === null ? (
                <Text>No Image</Text>
                ) : (
                    <FastImage 
                        source={{uri:postImageSource}}
                        style={styles.postImage}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                )
            }
        </View>
        <View style={styles.postText}>
          <Text style={[styles.postTitle,Global.titleSecondary]}>Posted by:{owner}</Text>
          <Text style={[styles.postTitle,Global.titleSecondary]}>Title: {postTitle}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  postCardContainer: {
    width: '100%',
    
    padding: 10,
    borderBottomColor: Colors.muted,
    borderBottomWidth: 1,
  },
  postCardWrapper: {
    flexDirection: 'row',
  },
  postImageWrapper: {
    height: 100,
    borderRadius: 4,
    width: 100,
    padding: 5,
  },
  postImage: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  postText: {
    justifyContent: 'space-between',
    height: 100,
    padding: 10,
  },

});

export default PostCard;
