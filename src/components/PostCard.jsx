import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { shadowStyle } from '../constant/Shadow';
import { useTheme } from '../context/ThemeContext';
import Fonts from '../constant/Fonts';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useAuth } from '../context/AuthContext';

const PostCard = ({ post, onPress }) => {
  const { currentUser } = useAuth();
  const theme = useTheme();
  const styles = getStyles(theme);
  const hasImages = post.images && post.images.length > 0;

  const gradientColors = currentUser && currentUser.status === 'contractor' 
  ? [theme.primary, theme.tertiary] 
  : [theme.primary, theme.secondary]; 


  return (
   
    <TouchableOpacity onPress={onPress} style={[shadowStyle]}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 1}}
        end={{ x: 1, y: 0 }}
        style={[styles.postCardContainer, { borderRadius: 10, 
        borderWidth: 1.5, borderColor: theme.primary, overflow: 'hidden' }]}
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
              <Text
              numberOfLines={1}
              ellipsizeMode='tail'
              style={[styles.price,{textAlign:'right'}]}>{post.price}$</Text>
            </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const getStyles = (theme) => {
  return StyleSheet.create({
  postCardContainer: {
    width: '100%',
    position: 'relative',
    maxWidth: 180,
    backgroundColor: theme.querternary,
  },
  noImage:{
    justifyContent:'center',
    alignItems:'center',
    flex:1,
  },
  postImage: {
    width: '100%',
    height: 120,
  },
  noImage:{
    height: 120,
    padding: 10,
    backgroundColor: theme.white,
    justifyContent: 'center',
    alignItems: 'center',
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
    color: theme.white,
    fontFamily: Fonts.primary,
    width: '60%',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.white,
    fontFamily: Fonts.primary,
    width: '30%',
  },
  noImageIconWrapper:{
    backgroundColor: theme.white,
    justifyContent: 'center',
    alignItems: 'center',
    height: 120,
  },
  noImageText:{
    fontFamily: Fonts.primary,
    fontSize: 25,
    fontWeight: 'bold',
    color: theme.gray,
    borderWidth: 2,
    borderColor: theme.gray,
    padding: 20,
    borderRadius: 5,
  },
});
}

export default PostCard;
