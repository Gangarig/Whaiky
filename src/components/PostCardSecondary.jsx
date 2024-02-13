import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { shadowStyle } from '../constant/Shadow';
import Fonts from '../constant/Fonts';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const PostCardSecondary = ({ post, onPress }) => {
  const { currentUser } = useAuth();
  const theme = useTheme();
  console.log('theme', theme.primary);
  const styles = getStyles(theme);
  const hasImages = post.images && post.images.length > 0;

  const renderDottedLine = () => {
    const numberOfDots = 10; // Adjust the number of dots as needed
    return Array.from({ length: numberOfDots }).map((_, index) => (
      <View key={index} style={styles.verticalLineDot} />
    ));
  };
  return (
    <View style={styles.border}>
    <TouchableOpacity onPress={onPress} style={[shadowStyle]}>
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
            <Text style={[styles.noImageText, shadowStyle]}>No Image</Text>
          </View>
        )}
            <View style={styles.postInfo}>
              <Text style={styles.title}>{post.title}</Text>
              <Text style={[styles.price,{textAlign:'right'}]}>{post.price}$</Text>
            </View>
            <LinearGradient
                colors={[theme.primary, theme.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.sale]}
              >
              <Text style={styles.saleText}>SALE</Text>
                <View style={{ flexDirection: 'column' }}>{renderDottedLine()}</View>
                <View style={{ flexDirection: 'column' }}>
                <Text style={styles.verticalText}>{post?.sale}</Text> 
              </View>
            </LinearGradient>
      </LinearGradient>
    </TouchableOpacity>
    </View>
  );
};

const getStyles = (theme) => {
  return StyleSheet.create({
  postCardContainer: {
    width: '100%',
    position: 'relative',
    borderRadius: 12,
    height: 200,
    borderWidth: 0,
    borderColor: theme.querternary,
    padding: 0,
  },
  noImage:{
    justifyContent:'center',
    alignItems:'center',
    flex:1,
    borderRadius:15,
  },
  postImage: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,

  },
  noImage:{
    height: 140,
    padding: 10,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    backgroundColor: theme.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postInfo: {
    paddingVertical: 7,
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 60,
    alignItems: 'center',
    borderRadius: 15,

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
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    borderWidth: 1,
    borderColor: theme.querternary,
  },
  noImageText:{
    fontFamily: Fonts.primary,
    fontSize: 25,
    fontWeight: 'bold',
    color: theme.gray,
    borderWidth: 2,
    borderColor: theme.gray,
    padding: 20,
    borderRadius: 7,
  },
  sale:{
    position:'absolute',
    bottom:40,
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
    borderWidth:2,
    borderColor:theme.primary,
    borderRadius:15,
  }


})
}

export default PostCardSecondary;
