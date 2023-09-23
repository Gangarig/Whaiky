import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, Image, ActivityIndicator, StyleSheet, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useAuth } from '../context/AuthContext';
import ImagePicker from 'react-native-image-crop-picker';

const selectMultipleImagesFromGallery = (width, height, maxImages = 3) => {
  return new Promise((resolve, reject) => {
    ImagePicker.openPicker({
      width,
      height,
      cropping: true,
      multiple: true,
      maxFiles: maxImages,
    })
    .then((images) => {
      const paths = images.map(image => image.path);
      resolve(paths);
    })
    .catch((error) => {
      reject(error);
    });
  });
};

const AddPostScreen = () => {
  const { currentUser } = useAuth();
  const [postTitle, setPostTitle] = useState('');
  const [postDesc, setPostDesc] = useState('');
  const [postPrice, setPostPrice] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(1);
  const [selectedOptionId, setSelectedOptionId] = useState(1);
  const [city, setCity] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [postImages, setPostImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const pickImages = async () => {
    try {
      const imagePaths = await selectMultipleImagesFromGallery(4, 3);
      setPostImages(imagePaths);
    } catch (error) {
      console.error('Error picking images:', error);
    }
  };

  const handlePost = async () => {
    if (!postTitle || !postDesc || !postPrice || !selectedCategoryId || !selectedOptionId || !city || !zipcode) {
      Alert.alert('Error', 'Please fill in all the fields.');
      return;
    }

    if (isNaN(parseFloat(postPrice))) {
      Alert.alert('Error', 'Please enter a valid price.');
      return;
    }

    setLoading(true);

    try {
      const postRef = firestore().collection('posts').doc();
      const postId = postRef.id;

      // Upload images to Firebase Storage
      const imageURLs = [];
      for (let i = 0; i < postImages.length; i++) {
        const imagePath = postImages[i];
        const imageName = `post_${postId}_${i}`;
        const storageRef = storage().ref(`post_images/${imageName}`);
        const result = await storageRef.putFile(imagePath);
        const imageUrl = await storageRef.getDownloadURL();
        imageURLs.push(imageUrl);
      }

      // Save post data in Firestore
      await postRef.set({
        title: postTitle,
        description: postDesc,
        price: parseFloat(postPrice),
        categoryId: selectedCategoryId,
        optionId: selectedOptionId,
        imageURLs,
        city,
        zipcode,
        ownerName: currentUser.displayName,
        ownerId: currentUser.uid,
      });

      Alert.alert('Success', 'Your post has been successfully created.');
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Title</Text>
      <TextInput value={postTitle} onChangeText={setPostTitle} />

      <Text>Description</Text>
      <TextInput multiline value={postDesc} onChangeText={setPostDesc} />

      <Text>Price</Text>
      <TextInput value={postPrice} onChangeText={setPostPrice} />

      <Text>Category</Text>
      <Picker selectedValue={selectedCategoryId} onValueChange={setSelectedCategoryId}>
        {/* Categories list */}
      </Picker>

      <Text>Option</Text>
      <Picker selectedValue={selectedOptionId} onValueChange={setSelectedOptionId}>
        {/* Options list based on selected category */}
      </Picker>

      <Text>City</Text>
      <TextInput value={city} onChangeText={setCity} />

      <Text>Zip Code</Text>
      <TextInput value={zipcode} onChangeText={setZipcode} />

      <Button title="Select Images" onPress={pickImages} />
      {postImages.map((uri, index) => (
        <Image key={index} source={{ uri }} style={{ width: 100, height: 100 }} />
      ))}

      <Button title="Submit Post" onPress={handlePost} disabled={loading} />

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AddPostScreen;
