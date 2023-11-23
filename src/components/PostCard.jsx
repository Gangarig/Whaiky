import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Colors from '../constant/Colors';
import {Global} from '../constant/Global';
import Default from '../assets/images/default.png';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';

const PostCard = ({ owner,postTitle, postImageSource,onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.postCardContainer]}>
      <LinearGradient
        colors={['#9E41F0', '#4C7BC0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.postCardWrapper}
      >
        <View style={styles.postImageWrapper}>
            {postImageSource === null ? (
                <View style={styles.noImage}>
                  <Text style={[Global.titleSecondary,styles.black]}>No Image</Text>
                </View>
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
          <Text style={[styles.postTitle,Global.titleSecondary]}>Posted by: {owner}</Text>
          <Text style={[styles.postTitle,Global.titleSecondary]}>Title: {postTitle}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  postCardContainer: {
    width: '100%',
    padding: 10,
  },
  noImage:{
    justifyContent:'center',
    alignItems:'center',
    flex:1,
    borderWidth:1,
    borderColor:'#ccc',
    borderRadius:4,
  },
  postCardWrapper: {
    flexDirection: 'row',
    borderRadius:10,
    height: 140,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  postImageWrapper: {
    height: 120,
    borderRadius: 4,
    width: 120,
    padding: 5,
    backgroundColor: Colors.white,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: Colors.white,
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    
  },
  postImage: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  postText: {
    justifyContent: 'space-between',
    height: 100,
    alignItems: 'flex-end',
    flex: 1,
    paddingHorizontal: 10,
  },
  postTitle: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: 'bold',
  },
  black:{
    color:Colors.black,
  }

});

export default PostCard;
