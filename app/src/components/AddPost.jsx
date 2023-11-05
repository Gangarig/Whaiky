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
import { Global } from '../../style/Global';
import firestore from '@react-native-firebase/firestore';
import LocationPicker from '../../service/LocationPicker';
import CategoryPicker from '../../service/CategoryPicker';
import ImageCropPicker from 'react-native-image-crop-picker'; // Import the image picker library
import { showMessage } from 'react-native-flash-message';
import firebase from '@react-native-firebase/app';
import ProgressBar from './ProgressBar';

const AddPost = ({ navigation }) => {
  const { currentUser } = useAuth();
  const [postType, setPostType] = useState('Looking For Service');
  const [subTitle, setSubTitle] = useState('Looking For Service');
  const [post, setPost] = useState({
    title: '',
    description: '',
    country: currentUser.country,
    state: currentUser.state,
    city: currentUser.city,
    categoryId: 11,
    categoryText: 'Other', // Initialize with default text
    optionId: 41,
    optionText: 'Other', // Initialize with default text
    price: '',
    images: [], // Store selected images here
    ownerId: currentUser.uid,
    ownerName: currentUser.displayName,
    ownerAvatar: currentUser.photoURL,
    createdAt: firestore.FieldValue.serverTimestamp(),
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [progress, setProgress] = useState(0);

  const changeType = () => {
    if (postType === 'LookingForService') {
      setPostType('OfferingService');
      setSubTitle('Offering Service');
    } else {
      setPostType('LookingForService');
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
    setSelectedCategory(category);
    setSelectedOption(option);
    setPost({ ...post, categoryText, optionText }); // Update categoryText and optionText in state
    closeModal();
  };

  const handleCategoryPickerSave = (categoryId, optionId, categoryText, optionText) => {
    setModalVisible(false);

    setPost({
      ...post,
      categoryId: categoryId || 11,
      optionId: optionId || 41,
      categoryText,
      optionText,
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
        maxFiles: remainingImageCount, // Limit the number of images user can pick
      });
  
      const updatedImages = [...post.images, ...images.slice(0, remainingImageCount)];
  
      setPost({ ...post, images: updatedImages });
    } catch (error) {
      console.error('Error picking images:', error);
    }
  };
  const handleImageDelete = (index) => {
    const updatedImages = [...post.images];
    updatedImages.splice(index, 1);
    setPost({ ...post, images: updatedImages });
  };
  const handlePost = async () => {
    // Check if the post has a title, price, and description
    if (!post.title || !post.price || !post.description) {
      showMessage({
        message: 'Please ensure the title, price, and description are filled out.',
        type: 'warning',
      });
      return;
    }
  
    // Generate a new document reference with an auto-generated ID
    const newPostRef = firestore().collection('posts').doc();
  
    // Use the unique document ID in your image storage path
    const uniquePostId = newPostRef.id;
  
    try {
      // Start uploading the images if there are any
      let imageUrls = [];
      if (post.images.length > 0) {
        const imageUploadPromises = post.images.map(async (image, index) => {
          const response = await fetch(image.path);
          const blob = await response.blob();
          const imageRef = firebase.storage().ref(`post_images/${uniquePostId}/${index}`);
          await imageRef.put(blob);
          return imageRef.getDownloadURL();
        });
  
        // Wait for all the images to be uploaded
        imageUrls = await Promise.all(imageUploadPromises);
      }
  
      // Set the post data with the unique ID and uploaded image URLs
      await newPostRef.set({
        ...post,
        images: imageUrls,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
  
      // Reset the form to initial state
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
        // Removed the createdAt and updatedAt from here
      });
  
      showMessage({
        message: 'Post created successfully!',
        type: 'success',
      });
  
      // Close any open modals
      setModalVisible(false);
      setCategoryModalVisible(false);
  
      // If you have additional logic to handle after the post is created,
      // define the `onPostSubmitted` function and call it here.
      // onPostSubmitted();
  
    } catch (error) {
      console.error('Error creating post:', error);
      showMessage({
        message: 'There was an error creating the post.',
        type: 'danger',
      });
    }
  };
  
  
  
  return (
    <View style={Global.container}>
      <Text style={Global.title}>Create a Post</Text>
      <ProgressBar progress={progress} />
      <View style={Global.postContainer}>
      <Button title={subTitle} style={Global.postTypeButton} onPress={changeType}/>

      </View>
      <View style={styles.imageContainer}>
        
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
            <TouchableOpacity
              onPress={pickImages}
              style={styles.addImageWrapper}
            >
              <Text style={styles.addImageText}>Add Image</Text>
            </TouchableOpacity>
          )}
      </View>


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
        />
        <TextInput
          style={Global.input}
          placeholder="Price"
          onChangeText={(text) => setPost({ ...post, price: text })}
        />
      </View>
      {post.country && (
        <View style={styles.location}>
          <Text style={Global.titleSecondary}>Country: {post.country}</Text>
          <Text style={Global.titleSecondary}>State: {post.state}</Text>
          <Text style={Global.titleSecondary}>City: {post.city}</Text>
        </View>
      )}
      {post.categoryId && (
        <View style={styles.box}>
          <Text style={Global.titleSecondary}>
            Category: {post.categoryText} 
          </Text>
          <Text style={Global.titleSecondary}>
            Option: {post.optionText} 
          </Text>
        </View>
      )}
      <View style={styles.buttonBox}>
        <Button
          title="Select a Location"
          onPress={() => setModalVisible(true)}
        />
        <Button title="Select Category" onPress={openCategoryModal} />
      </View>
      <View>
        <Button title='Post' onPress={handlePost} />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View style={Global.modalContainer}>
          <View style={styles.modalContent}>
            <LocationPicker
              onClose={closeModal}
              onSave={(selectedCountry, selectedState, selectedCity) => {
                const updatedPost = { ...post };
                if (selectedCountry) updatedPost.country = selectedCountry;
                if (selectedState) updatedPost.state = selectedState;
                if (selectedCity) updatedPost.city = selectedCity;

                setPost(updatedPost);
                closeModal();
              }}
            />
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={categoryModalVisible}
      >
        <View style={Global.modalContainer}>
          <View style={styles.modalContent}>
            <CategoryPicker
              onSave={handleCategoryPickerSave}
              onClose={closeCategoryModal}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    padding: 10,
    gap: 10,
  },
  modalContent: {
    height: '85%',
    width: '80%',
  },
  location: {
    flexDirection: 'row',
    gap: 10,
    padding: 5,
  },
  buttonBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  box: {
    justifyContent: 'space-around',
    padding: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  imageWrapper: {
    width: '30%', // Adjust the width as needed
    marginBottom: 10,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 5,
  },
  deleteText: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    padding: 5,
    borderRadius: 5,
  },
  addImageWrapper: {
    width: '30%', // Adjust the width as needed
    marginBottom: 10,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  addImageText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddPost;
