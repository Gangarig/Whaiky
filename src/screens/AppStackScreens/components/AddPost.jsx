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
import { useAuth } from '../../../context/AuthContext';
import { Global } from '../../../constant/Global';
import firestore from '@react-native-firebase/firestore';
import LocationPicker from '../service/LocationPicker';
import CategoryPicker from '../service/CategoryPicker';
import ImageCropPicker from 'react-native-image-crop-picker';
import { showMessage } from 'react-native-flash-message';
import firebase from '@react-native-firebase/app';
import * as Progress from 'react-native-progress';
import GradientButton from '../../../components/GradientButton';

const AddPost = ({ navigation }) => {
  const { currentUser } = useAuth();

  const [postType, setPostType] = useState('Looking For Service');
  const [subTitle, setSubTitle] = useState('Looking For Service');
  const [documentApproved, setDocumentApproved] = useState(false); // Track if the document is approved

  const [post, setPost] = useState({
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

  const [modalVisible, setModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
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
    setSelectedCategory(category);
    setSelectedOption(option);
    setPost({ ...post, categoryText, optionText });
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
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
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
  

  return (
    <View style={Global.container}>
      <Text style={Global.title}>Create a Post</Text>
      <View style={Global.postContainer}>
        <Button title={subTitle} style={Global.postTypeButton} onPress={changeType} />
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
          <Text style={Global.titleSecondary}>Category: {post.categoryText}</Text>
          <Text style={Global.titleSecondary}>Option: {post.optionText}</Text>
        </View>
      )}
      <View style={styles.buttonBox}>
        <Button title="Select a Location" onPress={() => setModalVisible(true)} />
        <Button title="Select Category" onPress={openCategoryModal} />
      </View>
      <View>
        <GradientButton text={'Post'} onPress={handlePost} />
        <Button title='Cancel' onPress={() => navigation.goBack()} />
      </View>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
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
      <Modal animationType="slide" transparent={true} visible={categoryModalVisible}>
        <View style={Global.modalContainer}>
          <View style={styles.modalContent}>
            <CategoryPicker onSave={handleCategoryPickerSave} onClose={closeCategoryModal} />
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
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  imageWrapper: {
    width: '30%',
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
    width: '30%',
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
  progressBarContainer: {
    width: '90%',
  },
});

export default AddPost;
