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
        colors={gradientColors}
        start={{ x: 0, y: 1}}
        end={{ x: 1, y: 0 }}
        style={[styles.postCardContainer,]}
      >
        {hasImages ? (
          <FastImage 
              source={{ 
                uri: post.images[0],
                priority: FastImage.priority.high,
              }}
            style={styles.postImage}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : (
          <View style={[styles.noImage]}>
            <Text style={[styles.noImageText]}>No Image</Text>
          </View>
        )}
            <View style={styles.postInfo}>
              <View style={styles.titleWrapper}>
                  <Text style={styles.title}>{post.title}</Text>
              </View>
              <View style={styles.priceWrapper}>
                <Text
                style={[styles.price]}>{post.price}$</Text>
              </View>
            </View>
            {post?.sale && (
            <LinearGradient
                colors={[theme.primary, theme.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1.2, y: 0 }}
                style={[styles.sale]}
              >
              <Text style={styles.saleText}>SALE</Text>
                <View style={{ flexDirection: 'column' }}>{renderDottedLine()}</View>
                <View style={{ flexDirection: 'column' }}>
                <Text style={styles.verticalText}>{post?.sale}</Text> 
              </View>
            </LinearGradient>
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
    maxWidth: 180,
    backgroundColor: theme.querternary,
    borderRadius: 10,
    borderWidth: .5, 
    borderColor: theme.primary, 
    overflow: 'hidden'
  },
  noImage:{
    justifyContent:'center',
    alignItems:'center',
    flex:1,
  },
  postImage: {
    width: '100%',
    height: 120,
    backgroundColor: theme.background,
  },
  noImage:{
    height: 120,
    padding: 10,
    backgroundColor: theme.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postInfo: {
    paddingVertical: 5,
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
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.white,
    fontFamily: Fonts.primary,
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
    borderWidth: 1,
    borderColor: theme.gray,
    padding: 20,
    borderRadius: 5,
  },
  sale:{
    position:'absolute',
    bottom:35,
    right:10,
    borderRadius:5,
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
  border:{
    borderWidth:.5,
    borderColor:theme.primary,
    borderRadius:15,
  },
  titleWrapper:{
    width:'70%',
    height:'100%',
    paddingLeft:7,
  },
  priceWrapper:{
    justifyContent:'flex-end',
    alignItems:'flex-end',
    paddingRight:7,
    width:'30%',
    height:'100%',
  },

});
}

export default PostCard;
