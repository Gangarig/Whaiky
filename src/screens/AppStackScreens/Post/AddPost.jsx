import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import CategoryPicker from '../service/CategoryPicker';
import ImageCropPicker from 'react-native-image-crop-picker';
import { showMessage } from 'react-native-flash-message';
import firebase from '@react-native-firebase/app';
import * as Progress from 'react-native-progress';
import Location from '../service/LocationPicker';
import PrimaryButton from '../../../components/Buttons/PrimaryButton';
import PrimaryGradientButton from '../../../components/Buttons/PrimaryGradientButton';
import firestore from '@react-native-firebase/firestore';
import GradientText from '../../../components/GradientText';
import FastImage from 'react-native-fast-image';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useTheme } from '../../../context/ThemeContext';
import { BlurView } from "@react-native-community/blur";



const AddPost = ({ navigation }) => {
  const { currentUser } = useAuth();
  const theme = useTheme();
  const styles = getStyles(theme);
  const [postType, setPostType] = useState('Looking For Service');
  const [subTitle, setSubTitle] = useState('Looking For Service');
  const [documentApproved, setDocumentApproved] = useState(false); // Track if the document is approved
  const [blur, setBlur] = useState(false);
  const [post, setPost] = useState({
    postId: '',
    title: '',
    description: '',
    country: currentUser.country || '',
    state: currentUser.state || '',
    city: currentUser.city || '',
    categoryId: 11,
    categoryText: 'Other Services',
    optionId: 41,
    optionText: 'Other Services',
    price: '',
    images: [],
    ownerId: currentUser.uid,
    ownerName: currentUser.displayName,
    ownerAvatar: currentUser.photoURL,
    postType: postType,
  });
  const [optionReminderVisible, setOptionReminderVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageViewVisible, setImageViewVisible] = useState(false);  


  useEffect(() => {
    // Check if the user has an approved document when the component mounts
    const checkDocumentApproval = async () => {
      try {
        const docSnapshot = await firestore()
          .collection('users')
          .doc(currentUser.uid)
          .collection('documents')
          .get();

        if (docSnapshot.size > 0 && docSnapshot.docs[0].data().status === 'approved') {
          setDocumentApproved(true);
        } else {
          setDocumentApproved(false);
        }
      } catch (error) {
        console.error('Error checking document approval:', error);
      }
    };

    checkDocumentApproval();
  }, [currentUser.uid]);

  const Toggle = () => {
    if (!documentApproved && postType === 'Looking For Service') {
      showMessage({
        message: 'You must upload an approved document before you can offer a service.',
        type: 'warning',
      });
      return;
    }
    setPostType(postType === 'Looking For Service' ? 'Offering Service' : 'Looking For Service');
  };

  const closeModal = () => {
    setModalVisible(false);
    setBlur(false);
  };

  const openCategoryModal = () => {
    setCategoryModalVisible(true);
    setBlur(true);
  };
  const closeCategoryModal = () => {
    setCategoryModalVisible(false);
    setBlur(false);
  };
  const handleCategorySave = (category, option, categoryText, optionText) => {
    // Set the selected category and option
    setSelectedCategory(category);
    setSelectedOption(option);
  
    // Update the post state with new values
    setPost({ 
      ...post,
      categoryText: categoryText,
      optionText: optionText,
      categoryId: category, // Make sure this is the ID, not the entire object
      optionId: option, // Same here, ensure it's the ID
    });
  
    closeModal();
  
    // Check if option is selected
    if (!option) {
      showMessage({
        message: 'Please select an option for the chosen category.',
        type: 'warning',
        duration: 3000,
      });
    }
  };

  const handleCategoryPickerSave = (categoryId, optionId, categoryText, optionText) => {
    setModalVisible(false);

    setPost({
      ...post,
      categoryId: categoryId || null,
      optionId: optionId || null,
      categoryText,
      optionText,
    });
  };

  const uploadImage = async (imageUri, postId) => {
    const filename = `${postId}_${Date.now()}.jpg`; // Unique filename for each image
    const storagePath = `posts/${postId}/${filename}`; // Updated path with postId
    const uploadTask = firebase.storage().ref(storagePath).putFile(imageUri);
  
    return new Promise((resolve, reject) => {
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 70;
          setUploadProgress(progress);
        },
        (error) => {
          console.error(error);
          reject(error);
        },
        () => {
          resolve(storagePath); // Return the storage path upon successful upload
        }
      );
    });
  };
  

  const pickImages = async () => {
    try {
      const currentImageCount = post.images.length;
      const maxImageCount = 3;

      if (currentImageCount >= maxImageCount) {
        showMessage({
          message: 'You can upload up to three images.',
          type: 'warning',
        });
        return;
      }

      const remainingImageCount = maxImageCount - currentImageCount;

      const images = await ImageCropPicker.openPicker({
        multiple: true,
        mediaType: 'photo',
        compressImageQuality: 0.7,
        compressImageMaxWidth: 1000,
        compressImageMaxHeight: 1000,
        cropping: false,
        maxFiles: remainingImageCount,
      });

      if (!images || images.length === 0) {
        // No images selected or user canceled
        return;
      }

      const updatedImages = [...post.images, ...images.slice(0, remainingImageCount)];

      setPost({ ...post, images: updatedImages });
    } catch (error) {
      if (error.message && error.message.includes('User cancelled image selection')) {
        // User canceled image selection, no need to show an error message
        return;
      }

      console.error('Error picking images:', error);

      // Handle other errors, such as network issues or unexpected errors
      showMessage({
        message: 'An error occurred while picking images. Please try again later.',
        type: 'danger',
      });
    }
  };

  const handleImageDelete = (index) => {
    const updatedImages = [...post.images];
    updatedImages.splice(index, 1);
    setPost({ ...post, images: updatedImages });
  };

  const handlePost = async () => {
    console.log('Post:', post);
    if (!post.title || !post.price || !post.description) {
      showMessage({
        message: 'Please ensure the title, price, and description are filled out.',
        type: 'warning',
      });
      return;
    }
  
    if (!post.categoryId || !post.optionId) {
      showMessage({
        message: 'Please select a category and option.',
        type: 'warning',
      });
      return;
    }
  
    const newPostRef = firestore().collection('posts').doc();
  
    try {
      let imageUrls = [];
      if (post.images.length > 0) {
        for (const image of post.images) {
          const storagePath = await uploadImage(image.path, newPostRef.id);
          const downloadURL = await firebase.storage().ref(storagePath).getDownloadURL();
          imageUrls.push(downloadURL);
        }
      }
      const postData = {
        ...post,
        images: imageUrls,
        timestamp: firestore.FieldValue.serverTimestamp(),
        postId: newPostRef.id,
      };
      await newPostRef.set(postData);
      // Update the user's document with the postId
      await firestore()
      .collection('users')
      .doc(currentUser.uid)
      .collection('myPosts')
      .doc(newPostRef.id)
      .set({ 
        postId: newPostRef.id,
        timestamp: firestore.FieldValue.serverTimestamp(),
       });

 


  
      setPost({
        title: '',
        description: '',
        country: currentUser.country || '',
        state: currentUser.state || '',
        city: currentUser.city  || '',
        categoryId: 11,
        categoryText: 'Other',
        optionId: 41,
        optionText: 'Other',
        price: '',
        images: [],
        ownerId: currentUser.uid,
        ownerName: currentUser.displayName || '',
        ownerAvatar: currentUser.photoURL || '',
        postType: 'Looking For Service',
      });
  
      showMessage({
        message: 'Post created successfully!',
        type: 'success',
      });
      navigation.goBack();
    } catch (error) {
      console.error('Error creating post:', error);
      showMessage({
        message: 'There was an error creating the post.',
        type: 'danger',
      });
    }
  };  

  const handleLocationSave = (selectedCountry, selectedState, selectedCity) => {
    setPost({
      ...post,
      country: selectedCountry,
      state: selectedState,
      city: selectedCity,
    });
    closeModal();

  };

  return (
    <ScrollView style={styles.container}
      contentContainerStyle={styles.ScrollView}
    >
    {blur && (
        <BlurView
        style={styles.blur}
        blurType="light"
        blurAmount={5}
        reducedTransparencyFallbackColor="white"
        />
    )}
      {currentUser.status === 'contractor' && (
      <View style={[styles.postTypeBox]}>
        <TouchableOpacity 
          style={postType === 'Looking For Service' ? styles.activePostType : styles.inActivePostType}
          onPress={Toggle}
          
        >
          <Text 
            style={postType === 'Looking For Service' ? styles.activePostText : styles.inActivePostText}
          >
            Looking For a 
          </Text>
          <Text 
            style={postType === 'Looking For Service' ? styles.activePostText : styles.inActivePostText}
          >
          Service
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={postType === 'Offering Service' ? styles.activePostType : styles.inActivePostType} 
          onPress={Toggle}
        >
          <Text 
            style={postType === 'Offering Service' ? styles.activePostText : styles.inActivePostText}
          >
            Offering a Service
          </Text>
        </TouchableOpacity>
      </View>
      )}
        {post.images.length < 1 && (
        <TouchableOpacity onPress={pickImages} style={styles.imageInput}>
              <GradientText colors={[theme.primary, theme.secondary]} style={styles.GradientText}
              size={25}
              >
                UPLOAD
            </GradientText>
            <GradientText colors={[theme.primary, theme.secondary]} style={styles.GradientText}
              size={25}
              >
                IMAGES
            </GradientText>
        </TouchableOpacity>
        )} 
        
        {post.images && post.images.length > 0 && post.images.map((image, index) => (
            <View style={styles.imageInput} key={index}>
              <View style={styles.imageWrapper}>
                <FastImage source={{ uri: image.path }} style={styles.image} />
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleImageDelete(index)}
                >
                  <FontAwesomeIcon icon='fa-solid fa-x' size={25} color={theme.white} />
                </TouchableOpacity>
              </View>
            </View>
          ))}

        <TextInput
          style={styles.title}
          placeholder="Title"
          value={post.title}
          onChangeText={(text) => setPost({ ...post, title: text })}
        />
          <TextInput
          style={styles.price}
          placeholder="Price"
          value={post.price}
          onChangeText={(text) => setPost({ ...post, price: text })}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.description}
          placeholder="Description"
          value={post.description}
          onChangeText={(text) => setPost({ ...post, description: text })}
          multiline={true}
        />

      {post.images.length > 0 && (
        <View style={styles.progressBarContainer}>
          <Progress.Bar progress={uploadProgress / 100} width={null} />
        </View>
      )}
      <View style={styles.postDetails}>
        {post.country && (
          <View style={styles.locationInfo}>
            {post.country && (<Text style={[styles.postInfo,{color:theme.text}]}>Country: {post.country}</Text>)}
            {post.state && (<Text style={[styles.postInfo,{color:theme.text}]}>State: {post.state}</Text>)}
            {post.city && (<Text style={[styles.postInfo,{color:theme.text}]}>City: {post.city}</Text>)}
          </View>
        )}
        {post.categoryId && (
          <View style={styles.categoryInfo}>
            <Text style={[styles.postInfo,{color:theme.text}]}>Category: {post.categoryText}</Text>
            <Text style={[styles.postInfo,{color:theme.text}]}>Option: {post.optionText}</Text>
          </View>
        )}
      </View>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.fullScreenModal}>
            <Location
              onSave={handleLocationSave}
              onClose={closeModal}
            />
        </View>
      </Modal>
      <Modal
        animationType='slide'
        transparent={true}
        visible={categoryModalVisible}
        onRequestClose={() => {
          setCategoryModalVisible(false);
          setBlur(false);
        }} >
            <View style={styles.categoryModal}>
              <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPressOut={() => {
                  setCategoryModalVisible(false);
                }}
              />
              <CategoryPicker
                onSave={handleCategorySave}
                onClose={closeCategoryModal}
              />
            </View>
      </Modal>
      <View style={styles.buttonBox}>
          <PrimaryButton text="Select a Location" onPress={() => {setModalVisible(true);setBlur(true)}} />
          <PrimaryButton text="Select Category" onPress={openCategoryModal} />
      </View>
      <View style={styles.PostBtn}>
      <PrimaryGradientButton text="Post" onPress={handlePost} />
      </View>
    </ScrollView>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    paddingHorizontal: 20,
    paddingTop: 20,
  
  },
  ScrollView:{
    justifyContent:'center',
    alignItems:'center',
    gap: 10,
    paddingBottom: 100,
  },

  fullScreenModal: {
    height: 450,
    width: '100%',
    bottom: 0,
    position: 'absolute',
    borderTopColor: theme.primary,
    borderTopWidth: 1,
    backgroundColor: theme.background,
    alignItems: 'center',
  },
  categoryModal: {
    height: 300,
    width: '100%',
    bottom: 0,
    position: 'absolute',
    borderTopColor: theme.primary,
    borderTopWidth: 1,
    backgroundColor: theme.background,
    paddingTop: 30,
    alignItems: 'center',
  },
  addImageWrapper: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  } , 
  imageInput:{
    height:200,
    width:'100%',
    backgroundColor:theme.backgroundSecondary,
    borderWidth:1,
    borderRadius:10,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:theme.backgroundSecondary,
    borderColor:theme.primary
  },
  title:{
    width:'100%',
    height:40,
    borderColor:theme.primary,
    borderWidth:1,
    backgroundColor:theme.backgroundSecondary,
    borderRadius:10,
    fontSize:17,
    paddingHorizontal:10,
    color:theme.text,
  },
  price:{
    width:'100%',
    height:40,
    borderColor:theme.primary,
    borderWidth:1,
    backgroundColor:theme.backgroundSecondary,
    borderRadius:10,
    fontSize:17,
    paddingHorizontal:10,
    color:theme.text,
  },
  description:{
    width:'100%',
    height:150,
    borderColor:theme.primary,
    borderWidth:1,
    backgroundColor:theme.backgroundSecondary,
    borderRadius:10,
    fontSize:17,
    paddingHorizontal:10,
    color:theme.text,
    marginBottom:10,
    textAlignVertical:'top',
  },
  btnContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
    width:'100%',
    gap:10,
  },
  buttonBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    zIndex: -1,
    gap:10,
  },
  PostBtn:{
    marginTop:30,
  },
  postDetails: {
    backgroundColor: theme.lightPrimary, 
    width: '100%',
    borderRadius: 10,
    padding: 10,
    borderWidth:1,
    borderColor:theme.primary,
  },
  postTypeBox:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    width:'100%',
    marginTop:20,
    marginBottom:20,
    borderColor:theme.primary,
    borderWidth:1,
    borderRadius:10,
    overflow:'hidden',
  },
  activePostType:{
    backgroundColor:theme.primary,
    width:'50%',
    padding:10,
    height:'100%',
    alignItems:'center',
    justifyContent:'center',
    height:50,
  },
  inActivePostType:{
    backgroundColor:theme.white,
    width:'50%',
    padding:10,
    height:'100%',
    alignItems:'center',
    justifyContent:'center',
    height:50,
  }, 
  activePostText:{
    color:theme.white,
    fontSize:15,
    fontWeight:'bold',
  },
  inActivePostText:{
    color:theme.text,
    fontSize:15,
    fontWeight:'bold',
  },
  imageWrapper: {
    position: 'relative',
    height: '100%',
    width: '100%',
    borderRadius: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 5,
    borderRadius: 5,
  },
  postInfo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: theme.text,
  },
  GradientText:{
    fontSize:20,
    fontWeight:'bold',
    textAlign:'center',
    color:theme.primary,
  },
  blur: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: "absolute",
    height: "110%",
    width: "110%",
    zIndex: 10,
  }

});

export default AddPost;

