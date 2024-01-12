import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Image,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Global } from '../constant/Global';
import firestore from '@react-native-firebase/firestore';
import CategoryPicker from '../screens/AppStackScreens/service/CategoryPicker';
import ImageCropPicker from 'react-native-image-crop-picker';
import { showMessage } from 'react-native-flash-message';
import firebase from '@react-native-firebase/app';
import * as Progress from 'react-native-progress';
import GradientButton from './GradientButton';
import Location from '../screens/AppStackScreens/service/Location';
import Colors from '../constant/Colors';
import { shadowStyle } from '../constant/Shadow';
import FastImage from 'react-native-fast-image';
import PrimaryButton from './Buttons/PrimaryButton';
import NavigationFooter from '../navigation/NavigationFooter';

const AddPost = ({ navigation }) => {
  const { currentUser } = useAuth();

  const [postType, setPostType] = useState('Looking For Service');
  const [subTitle, setSubTitle] = useState('Looking For Service');
  const [documentApproved, setDocumentApproved] = useState(false); // Track if the document is approved

  const [post, setPost] = useState({
    postId: '',
    title: '',
    description: '',
    country: currentUser.country,
    state: currentUser.state,
    city: currentUser.city,
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

  const changeType = () => {
    if (!documentApproved) {
      showMessage({
        message: 'You must upload an approved document before you can offer a service.',
        type: 'warning',
      });
      return;
    }

    if (postType === 'Looking For Service') {
      setPostType('Offering Service');
      setSubTitle('Offering Service');
    } else {
      setPostType('Looking For Service');
      setSubTitle('Looking For Service');
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const openCategoryModal = () => {
    setCategoryModalVisible(true);
  };

  const closeCategoryModal = () => {
    setCategoryModalVisible(false);
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
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
  
      setPost({
        title: '',
        description: '',
        country: currentUser.country,
        state: currentUser.state,
        city: currentUser.city,
        categoryId: 11,
        categoryText: 'Other',
        optionId: 41,
        optionText: 'Other',
        price: '',
        images: [],
        ownerId: currentUser.uid,
        ownerName: currentUser.displayName,
        ownerAvatar: currentUser.photoURL,
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
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={Global.input}
          placeholder="Title"
          onChangeText={(text) => setPost({ ...post, title: text })}
        />
        <TextInput
          style={Global.input}
          placeholder="Description"
          onChangeText={(text) => setPost({ ...post, description: text })}
          multiline={true}
        />
        <TextInput
          style={Global.input}
          placeholder="Price"
          onChangeText={(text) => setPost({ ...post, price: text })}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.imageInput}>
        {post.images.map((image, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleImageDelete(index)}
            style={styles.imageWrapper}
          >
            <Image source={{ uri: image.path }} style={styles.image} />
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        ))}
        {post.images.length < 3 && (
          <TouchableOpacity onPress={pickImages} style={styles.addImageWrapper}>
            <Text style={styles.addImageText}>Add Image</Text>
          </TouchableOpacity>
        )}
      </View>
      {post.images.length > 0 && (
        <View style={styles.progressBarContainer}>
          <Progress.Bar progress={uploadProgress / 100} width={null} />
        </View>
      )}
      <View style={styles.postDetails}>
        <View style={styles.postType}>
        <TouchableOpacity onPress={changeType}>
            <Text style={Global.titleSecondary}>
              Post Type : {subTitle}
            </Text>
          </TouchableOpacity>
        </View>
      {post.country && (
        <View style={styles.locationInfo}>
          <Text style={Global.titleSecondary}>Country: {post.country}</Text>
          <Text style={Global.titleSecondary}>State: {post.state}</Text>
          <Text style={Global.titleSecondary}>City: {post.city}</Text>
        </View>
      )}
      {post.categoryId && (
        <View style={styles.categoryInfo}>
          <Text style={Global.titleSecondary}>Category: {post.categoryText}</Text>
          <Text style={Global.titleSecondary}>Option: {post.optionText}</Text>
        </View>
      )}
      </View>
      
      <View style={styles.buttonBox}>
        <View style={styles.buttonBoxSecondary}>
        <PrimaryButton text="Select a Location" onPress={() => setModalVisible(true)} />
        <PrimaryButton text="Select Category" onPress={openCategoryModal} />
        </View>
        <View style={styles.buttonBoxSecondary}>
        <PrimaryButton text="Post" onPress={handlePost} />
        <PrimaryButton text="Cancel" onPress={() => navigation.goBack()} />
        </View>
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
        }} >
            <View style={styles.fullScreenModal}>
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
      <NavigationFooter navigation={navigation}/>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenModal: {
    height: 500,
    width: '100%',
    bottom: 0,
    position: 'absolute',
    borderTopColor: Colors.primary,
    borderTopWidth: 2,
    backgroundColor: Colors.background,
    paddingTop: 30,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  inputContainer: {
    width: '100%',
    gap: 10,
    alignItems: 'center',
  },
});

export default AddPost;
