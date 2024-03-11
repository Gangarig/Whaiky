import React, { useState , useEffect } from 'react';
import { View, Text, StyleSheet, Image,TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { shadowStyle } from '../constant/Shadow';
import FastImage from 'react-native-fast-image';
import UserTheme from '../constant/Theme';
import ImageView from 'react-native-image-viewing';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Fonts from '../constant/Fonts';
import PrimaryButton from './Buttons/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { DeletePost,AddSale,EditPost } from '../screens/AppStackScreens/Post/PostUtility';
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { handleSelect } from '../screens/AppStackScreens/service/ChatService';
import firestore from '@react-native-firebase/firestore';
import Dialog from "react-native-dialog";
import { useTheme } from '../context/ThemeContext';
import ContractorCard from './ContractorCard';



const PostCardDetail = ({ navigation , post }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageViewVisible, setImageViewVisible] = useState(false);
  const { currentUser } = useAuth();
  const [contractor, setContractor] = useState(null);
  const [salePrice, setSalePrice] = useState('');
  const [dialog, setDialog] = useState(false);
  const theme = useTheme();
  const styles = getStyles(theme);

  
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docSnap = await firestore().collection('users').doc(post.ownerId).get();
        if (docSnap.exists) {
          setContractor({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log('No such document!');
        }
      }
      catch (error) {
        console.error('Error fetching post:', error);
      }
    };
    fetchData();
  }, [post.ownerId]);



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

  const handleContact = (currentUser,contractor) => {
    handleSelect(currentUser,contractor);
    navigation.navigate('Chat');
  };

  const navigateToContractorProfile = (uid) => {
    navigation.navigate('ContractorDetail', { id: uid});
  }

  const handleSale = (post,salePrice) => {
    AddSale(post,salePrice);
    setDialog(false);
    navigation.goBack();
  }

  const navigateImage = (direction) => {
    let newIndex = selectedImageIndex + direction;
    if (newIndex < 0) {
      newIndex = post.images.length - 1; 
    } else if (newIndex >= post.images.length) {
      newIndex = 0;
    }
    setSelectedImageIndex(newIndex);
  };

  

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
          </>
        )}
      </View>
      {post.images.length > 1 && (
        <View style={styles.images}>
          {post.images.map((image, index) => (
            <TouchableOpacity key={index} onPress={() => selectImage(index)}>
              <View 
              style={selectedImageIndex === index ? styles.selectedCircle : styles.circle}
              >
              </View>
            </TouchableOpacity>
            
          ))}
        </View>
      )}
      {post.images.length === 0 && (
      <View style={styles.noImage}>
       <FontAwesomeIcon style={styles.image} size={300} color={theme.gray} icon="fa-solid fa-image" />
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
            <Text style={[styles.price, post.sale && { opacity: 0.5 }]}>{post.price}$</Text>
            <Text style={styles.salePrice}>
              {post.sale ? `${(post.price * ((100 - post.sale) / 100)).toFixed(1)}$` : ""}
            </Text>
          </View>
        </View>
        <View style={styles.postBody}>
          <Text style={[styles.postDescription,{color:theme.text}]}>{post.description}</Text>
        </View>

        {currentUser.uid === post.ownerId ? (
              <View style={styles.postEdit}>
                <PrimaryButton text='Delete' onPress={()=>DeletePost(post)} />
                <PrimaryButton text='Add Sale' onPress={()=>setDialog(true)} />
              </View>
        ):
          <ContractorCard selectedUser={contractor} navigation={navigation} currentUser={currentUser} onPress={()=>navigateToContractorProfile(post.ownerId)} />
        }
      </View>
      <View>
        <Dialog.Container visible={dialog}>
          <Dialog.Title>Sale %</Dialog.Title>
          <Dialog.Description>
            Do you want to add sale to this post?
          </Dialog.Description>
          <View style={styles.saleInputWrapper}>
          <TextInput
            style={styles.saleInput}
            value={salePrice}
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9]/g, ''); // Allow only numbers
              setSalePrice(numericText.substring(0, 2)); // Limit to two digits
            }}
            keyboardType="number-pad"
          />
          </View>
          <Dialog.Button label="Cancel" onPress={()=>setDialog(false)} />
          <Dialog.Button label="Add" onPress={()=>handleSale(post,salePrice)} />
        </Dialog.Container>
      </View>
      {renderImageViewer()}
    </ScrollView>
  );
};

export default PostCardDetail;

const getStyles = (theme) => {
  return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
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
    postion: 'absolute',
    bottom: 30,
    width: '100%',
  },
  circle: {
    width: 15,
    height: 15,
    borderRadius: 15,
    backgroundColor: theme.white,
    borderWidth: .5,
    borderColor: theme.primary,
    margin: 5,
  },
  selectedCircle: {
    width: 25,
    height: 15,
    borderRadius: 15,
    backgroundColor: theme.white,
    margin: 5,
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
    color: theme.text,
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
    borderColor: theme.primary,
    borderWidth: 1,
    borderRadius: 10,
  },
  postTitle: {
    fontSize: 20,
    fontWeight: 'bold', 
    color: theme.querternary,
    fontFamily: Fonts.querternary,
  },
  price: {
    fontSize: 19,
    fontWeight: 'bold',
    color: theme.querternary,
    fontFamily: Fonts.querternary,
  },
  salePrice: {
    fontSize: 19,
    fontWeight: 'bold',
    color: theme.querternary,
    fontFamily: Fonts.querternary,
  },
  postDate: {
    fontSize: 12,
    fontFamily: Fonts.querternary,
    color: theme.gray,
    paddingTop: 10,
  
  },
  postAddress: {
    fontSize: 12,
    fontFamily: Fonts.querternary,
    color: theme.gray,
    paddingTop: 10,
    paddingHorizontal: 3,
    paddingLeft: 10,
  },
  sale:{
    position:'absolute',
    top:285,
    right:10,
    borderRadius:5,
    height:35,
    width:95,
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row',
    borderWidth:1,
    borderColor:theme.white,
    zIndex:1,
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
    marginHorizontal: 4,
    borderRadius: 3,
  },
  verticalText: {
    color: theme.white,
    fontFamily: Fonts.querternary,
    fontWeight: 'bold',
    fontSize: 18,
    transform: [{ rotate: '270deg' }],
  },
  noImage:{
    justifyContent:'center',
    alignItems:'center',
    flex:1,
    borderBottomColor:theme.gray,
    borderBottomWidth:1,
    borderColor:theme.gray,
    borderRadius:4,
    opacity:.5,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 10,
    backgroundColor: theme.white,
  },
  postEdit:{
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center',
    paddingVertical:10,
    width:'100%',
    borderRadius:10,
  },
  btnContainer:{
    gap:10,
  },
  avatarWrapper: {
    borderRadius: 5,
    padding: 5, 
  },
  saleInput: {
    height: 50,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 30,
    borderBottomColor: theme.gray1,
    borderBottomWidth: 1,
  },
  saleInputWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
}
