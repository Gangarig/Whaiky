import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { shadowStyle } from '../constant/Shadow';
import Fonts from '../constant/Fonts';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { markPost, removeMarkedPost } from '../screens/AppStackScreens/Post/PostUtility';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
const PostCardSecondary = ({ post, onPress,saved }) => {
  const { currentUser } = useAuth();
  const theme = useTheme();

  const styles = getStyles(theme);
  const hasImages = post.images && post.images.length > 0;  
  const validSalePrice = post?.sale && post.sale > 0;
  const renderDottedLine = () => {
    const numberOfDots = 10; // Adjust the number of dots as needed
    return Array.from({ length: numberOfDots }).map((_, index) => (
      <View key={index} style={styles.verticalLineDot} />
    ));
  };
  return (
    <TouchableOpacity onPress={onPress}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={[theme.primary, theme.tertiary]}
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
            <Text style={[styles.noImageText]}>No Image</Text>
          </View>
        )}
            <View style={styles.postInfo}>
              <Text 
              style={styles.title}
              numberOfLines={1}
              ellipsizeMode='tail'
              >{post.title}</Text>
              <View style={styles.priceWrapper}>
              <Text 
              numberOfLines={1}
              ellipsizeMode='tail'
              style={styles.price}>{post.price}$</Text>
              </View>
              {validSalePrice && (
                <LinearGradient
                  colors={[theme.primary, theme.secondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1.5, y: 0 }}
                  style={[styles.sale]}
                >
                  <Text style={styles.saleText}>SALE</Text>
                  <View style={{ flexDirection: 'column' }}>{renderDottedLine()}</View>
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={styles.verticalText}>{post.sale}</Text>
                  </View>
                </LinearGradient>
              )}
            </View>
        {saved ? (
        <TouchableOpacity style={styles.marklist} 
        onPress={()=>removeMarkedPost(post?.postId,currentUser?.uid)}
        >
          <FontAwesomeIcon  icon="fa-solid fa-square-minus" color={theme.white} size={25} />
        </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.marklist} 
          onPress={()=>markPost(post?.postId,currentUser?.uid)}>
          <FontAwesomeIcon  icon="fa-solid fa-star" color={theme.white} size={25} />
        </TouchableOpacity>  
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const getStyles = (theme) => {
  return StyleSheet.create({
  postCardContainer: {
    width: '100%',
    position: 'relative',
    borderRadius: 10,
    overflow: 'hidden',
    height: 175,
    borderWidth: 0.5,
    borderColor: theme.primary,
    padding: 3,
    flexDirection: 'row',
  },
  noImage:{
    justifyContent:'center',
    alignItems:'center',
    flex:1,
    borderRadius:10,
  },
  postImage: {
    width: 167,
    height: 167,
    borderRadius: 7,
  },
  noImage:{
    width: 167,
    height: 167,
    borderRadius: 7,
    backgroundColor: theme.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postInfo: {
    flex  : 1,
    height: 167,
    padding: 5, 
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.white,
    fontFamily: Fonts.primary,
    width: '95%',
  },
  priceWrapper: {
    position: 'absolute',
    bottom: 5,
    right: 5,
  },

  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.white,
    fontFamily: Fonts.primary,
    width: 60,
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
    borderColor: theme.gray,
    padding: 20,
  },
  sale:{
    position:'absolute',
    bottom:5,
    left:10,
    borderRadius:2,
    height:31,
    width:90,
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row',
    borderWidth:1,
    borderColor:theme.white,
  },
  saleText:{
    fontSize:18,
    color:theme.white,
    fontFamily:Fonts.querternary,
    fontWeight:'bold',  
  },
  verticalLineDot: {
    height: 1, 
    width: 3,  
    backgroundColor: theme.white,
    marginVertical: 1, 
    marginHorizontal: 5,
    borderRadius: 3,
  },
  verticalText: {
    color: theme.white,
    fontFamily: Fonts.querternary,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    transform: [{ rotate: '270deg' }],
  },
  marklist:{
    position:'absolute',
    top:5,
    right:5,
    zIndex: 200,
    ...shadowStyle,
  },


})
}

export default PostCardSecondary;
