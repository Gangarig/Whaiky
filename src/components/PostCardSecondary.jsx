import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Colors from '../constant/Colors';
import {Global} from '../constant/Global';
import Default from '../assets/images/default.png';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { shadowStyle } from '../constant/Shadow';
import UserTheme from '../constant/Theme';
import Fonts from '../constant/Fonts';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useAuth } from '../context/AuthContext';
import PrimaryButton from './Buttons/PrimaryButton';

const PostCardSecondary = ({ post, onPress }) => {
  const { currentUser } = useAuth();
  const hasImages = post.images && post.images.length > 0;
  return (
    <TouchableOpacity onPress={onPress} style={[shadowStyle]}>
      <LinearGradient
        colors={['#9E42F0', '#423EE7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.postCardContainer]}
      >
        {hasImages ? (
          <FastImage 
            source={{ uri: post.images[0] }}
            style={styles.postImage}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : (
          <View style={[styles.noImage]}>
            <Text style={[styles.noImageText, shadowStyle]}>No Image</Text>
          </View>
        )}
            <View style={styles.postInfo}>
              <Text style={styles.title}>{post.title}</Text>
              <Text style={styles.price}>{post.price}$</Text>
            </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  postCardContainer: {
    width: '100%',
    position: 'relative',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: UserTheme.querternary,
  },
  noImage:{
    justifyContent:'center',
    alignItems:'center',
    flex:1,
    borderWidth:1,
    borderColor:'#ccc',
    borderRadius:4,
  },
  postImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    backgroundColor: UserTheme.white,
  },
  noImage:{
    height: 120,
    padding: 10,
    backgroundColor: UserTheme.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: UserTheme.querternary,
    borderWidth: .5,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  postInfo: {
    paddingVertical: 7,
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: UserTheme.white,
    fontFamily: Fonts.primary,
    width: '60%',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: UserTheme.white,
    fontFamily: Fonts.primary,
    width: '30%',
  },
  noImageIconWrapper:{
    backgroundColor: UserTheme.white,
    justifyContent: 'center',
    alignItems: 'center',
    height: 120,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    borderWidth: 1,
    borderColor: UserTheme.querternary,
  },
  noImageText:{
    fontFamily: Fonts.primary,
    fontSize: 25,
    fontWeight: 'bold',
    color: UserTheme.gray,
    borderWidth: 2,
    borderColor: UserTheme.gray,
    padding: 20,
    borderRadius: 7,
  },


})

export default PostCardSecondary;
