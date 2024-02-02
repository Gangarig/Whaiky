import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Global } from '../constant/Global';
import Colors from '../constant/Colors';
import Shadow, { shadowStyle } from '../constant/Shadow';
import FastImage from 'react-native-fast-image';
import UserTheme from '../constant/Theme';
import ImageView from 'react-native-image-viewing';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Fonts from '../constant/Fonts';
import PrimaryButton from './Buttons/PrimaryButton';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { DeletePost,AddSale,EditPost } from '../screens/AppStackScreens/Post/PostUtility';




const PostCardDetail = ({ post }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageViewVisible, setImageViewVisible] = useState(false);
  const { currentUser } = useAuth();

  const postDate = post.timestamp && post.timestamp.toDate instanceof Function
    ? post.timestamp.toDate().toLocaleDateString()
    : '';
  const selectImage = (index) => {
    if (index >= 0 && index < post.images.length) {
      setSelectedImageIndex(index);
    }
  };

  const openImageView = () => {
    setImageViewVisible(true);
  };

  const closeImageView = () => {
    setImageViewVisible(false);
  };

  const renderImageViewer = () => {
    return (
      <ImageView
        images={post.images.map((uri) => ({ uri }))}
        imageIndex={selectedImageIndex}
        visible={isImageViewVisible}
        onRequestClose={closeImageView}
      />
    );
  };
  const renderDottedLine = () => {
    const numberOfDots = 10; // Adjust the number of dots as needed
    return Array.from({ length: numberOfDots }).map((_, index) => (
      <View key={index} style={styles.verticalLineDot} />
    ));
  };
  
  

  const handleContact = (id) => {};
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollView}
    >
      <View style={styles.imageWrapper}>
        {post.images.length > 0 && (
          <>
            <TouchableOpacity
              style={styles.image}
              onPress={openImageView}
            >
              <FastImage
                source={{ uri: post.images[selectedImageIndex] }}
                style={{ flex: 1 }}
                resizeMode="cover"
              />
            </TouchableOpacity>
              <LinearGradient
                colors={['#9E42F0', '#423EE7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.sale]}
              >
              <Text style={styles.saleText}>SALE</Text>
                <View style={{ flexDirection: 'column' }}>{renderDottedLine()}</View>
                <View style={{ flexDirection: 'column' }}>
                <Text style={styles.verticalText}>20</Text> 
              </View>
            </LinearGradient>
          </>
        )}
      </View>
      {post.images.length > 1 && (
        <View style={styles.images}>
          {post.images.map((image, index) => (
            <TouchableOpacity key={index} onPress={() => selectImage(index)}>
              <FastImage
                source={{ uri: image }}
                style={[
                  styles.imagesInside,
                  index === selectedImageIndex && styles.selectedImage,
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
      {post.images.length === 0 && (
      <View style={styles.noImage}>
       <FontAwesomeIcon style={styles.image} size={300} color={UserTheme.gray} icon="fa-solid fa-image" />
      </View>
      )}
      <View style={styles.postInfo}>
        <View style={styles.postHeader}>
          <View style={styles.postHeaderLeft}>
            <Text style={styles.postTitle}>{post.title}</Text>
            <View style={styles.postSubHeader}>
              <Text style={styles.postDate}>{postDate}</Text>
              <View style={styles.postLocation}>
                <Text style={styles.postAddress}>{post.country}</Text>
                <Text style={styles.postAddress}>{post.state}</Text>
                <Text style={styles.postAddress}>{post.city}</Text>
              </View>
            </View>
          </View>
          <View style={styles.postHeaderRight}>
            <Text style={styles.price}>{post.price}$</Text>
            <Text style={styles.salePrice}>{post.salePrice}1231234$</Text>
          </View>
        </View>
        <View style={styles.postBody}>
          <Text style={styles.postDescription}>{post.description}</Text>
        </View>

        {currentUser.uid === post.ownerId ? (
              <View style={styles.postEdit}>
                <PrimaryButton text='Delete' onPress={()=>DeletePost(post)} />
                <PrimaryButton text='Edit' onPress={()=>EditPost(post)} />
                <PrimaryButton text='Add Sale' onPress={()=>AddSale(post)} />
              </View>
        ):
        <View style={styles.contactContainerWrapper}>
          <View style={styles.contactContainer}>
            <PrimaryButton text="Contact" onPress={handleContact} />
            <FastImage style={styles.avatar} source={{ uri: post.ownerAvatar }} />
          </View>
        </View>
        }
       
      </View>
      {renderImageViewer()}
    </ScrollView>
  );
};

export default PostCardDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UserTheme.background,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',

  },
  imageWrapper: {
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 300,
  },
  images: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadowStyle,
  },
  imagesInside: {
    width: 50,
    height: 50,
  },
  chevronLeft: {
    position: 'absolute',
    left: 10,
    top: 125,
  },
  chevronRight: {
    position: 'absolute',
    right: 10,
    top: 125,
  },
  selectedImage: {
    borderColor: UserTheme.querternary, 
    borderWidth: 2,
  },
  postInfo: {
    padding: 10,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 10,
    height: 60,
  },
  postHeaderLeft: {
    flexDirection: 'column',
  },
  postSubHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postLocation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postAddress: {
    paddingHorizontal: 3,
  },
  postHeaderRight: {
    flexDirection: 'column',
  },
  postBody: {
    flexDirection: 'column',
  },
  postDescription: {
    fontSize: 16,
    fontFamily: Fonts.querternary,
    paddingVertical: 20,
    textAlign: 'justify',
    marginBottom: 30,
  },
  contactContainerWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
  },
  contactContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    width: '90%',
    borderColor: UserTheme.primary,
    borderWidth: 1,
    ...shadowStyle,
    borderRadius: 10,
  },
  postTitle: {
    fontSize: 20,
    fontWeight: 'bold', 
    color: UserTheme.querternary,
    fontFamily: Fonts.querternary,
  },
  price: {
    fontSize: 19,
    fontWeight: 'bold',
    color: UserTheme.querternary,
    fontFamily: Fonts.querternary,
  },
  salePrice: {
    fontSize: 19,
    fontWeight: 'bold',
    color: UserTheme.querternary,
    fontFamily: Fonts.querternary,
  },
  postDate: {
    fontSize: 12,
    fontFamily: Fonts.querternary,
    color: UserTheme.gray,
    paddingTop: 10,
  
  },
  postAddress: {
    fontSize: 12,
    fontFamily: Fonts.querternary,
    color: UserTheme.gray,
    paddingTop: 10,
    paddingHorizontal: 3,
    paddingLeft: 10,
  },
  sale:{
    position:'absolute',
    bottom:10,
    right:10,
    borderRadius:5,
    height:31,
    width:90,
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row',
    borderWidth:1,
    borderColor:UserTheme.white,
  },
  saleText:{
    fontSize:18,
    color:UserTheme.white,
    fontFamily:Fonts.querternary,
    fontWeight:'bold',  
  },
  verticalLineDot: {
    height: 1, 
    width: 3,  
    backgroundColor: UserTheme.white,
    marginVertical: 1, 
    marginHorizontal: 4,
    borderRadius: 3,
  },
  verticalText: {
    color: UserTheme.white,
    fontFamily: Fonts.querternary,
    fontWeight: 'bold',
    fontSize: 18,
    transform: [{ rotate: '270deg' }],
  },
  noImage:{
    justifyContent:'center',
    alignItems:'center',
    flex:1,
    ...shadowStyle,
    borderBottomColor:UserTheme.gray,
    borderBottomWidth:1,
    opacity:0.5,
    borderColor:UserTheme.gray,
    borderRadius:4,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 10,
  },
  postEdit:{
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center',
    paddingVertical:10,
    width:'100%',
    borderColor:UserTheme.primary,
    borderWidth:1,
    ...shadowStyle,
    borderRadius:10,
  },
});
