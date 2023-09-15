import React, { useState , useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, Image, ActivityIndicator, StyleSheet, Switch } from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { db, firestore, storage } from '../../../FirebaseConfig';
import { categoriesData } from '../../../src/dataStatic/categoriesData';  // Import your categories data
import { useUser } from '../../context/UserContext';  // Import your user context
import { doc, setDoc, collection, Timestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { SafeAreaView } from 'react-native-safe-area-context';

type OptionType = {
  optionId: number;
  text: string;
};

type CategoryType = {
  id: number;
  text: string;
  options: OptionType[];
};

const AddPostScreen = () => {
  const { currentUser } = useUser();
  const [postTitle, setPostTitle] = useState<string>('');
  const [postDesc, setPostDesc] = useState<string>('');
  const [postPrice, setPostPrice] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null | string>(1);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null | string>(1);
  const [city, setCity] = useState<string>('');
  const [zipcode, setZipcode] = useState<string>('');
  const [postImg, setPostImg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUploading, setImageUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [postType, setPostType] = useState<string>('lookingForService'); // ['lookingForService', 'offeringService'

  const isPersonalInfoComplete = currentUser?.personalInfo === 'completed';
  const isLegalInfoComplete = currentUser?.legalInfo === 'completed';

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPostImg((result as any).uri);
    }
  };
  useEffect(() => {
    if (currentUser?.personalInfo === 'completed') {
      setPostType('lookingForService');
    } else if (currentUser?.legalInfo === 'completed') {
      setPostType('offeringService');
    } else {
      Alert.alert('Error', 'Please complete your profile first If you are looking for Service. If you are offering Service, please apply your legal Documents first.');
    }
  }, [currentUser]);

  const handlePost = async () => {
    try {
      setLoading(true);

      if (!currentUser) {
        Alert.alert('Error', 'User not authenticated.');
        return;
      }
      if (!postTitle || !postDesc || !postPrice || !postImg || !selectedCategoryId || !selectedOptionId || !city || !zipcode) {
        Alert.alert('Error', 'Please fill in all the fields.');
        return;
      }

      if (isNaN(parseFloat(postPrice))) {
        Alert.alert('Error', 'Please enter a valid price.');
        return;
      }

      const newPostRef = doc(collection(firestore, 'posts'));
      const postId = newPostRef.id;
      const postImageData = await fetch(postImg);
      const blob = await postImageData.blob();
      const imageName = `post_${postId}`;
      const storageRef = ref(storage, `post_images/${imageName}`);

      setImageUploading(true);

      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Upload error:', error);
          Alert.alert('Error', 'An error occurred during the image upload. Please try again.');
        },
        async () => {
          try {
            const url = await getDownloadURL(storageRef);
            const postData = {
              title: postTitle,
              description: postDesc,
              price: parseFloat(postPrice),
              categoryId: selectedCategoryId,
              optionId: selectedOptionId,
              imageURL: url,
              createdAt: Timestamp.now(),
              city: city,
              zipcode: zipcode,
              ownerName: currentUser.displayName,
              ownerId: currentUser.uid,
              ownerAvatar: currentUser.photoURL,
              postId: postId,
              postType: postType,
              imageName: imageName,
            };
            await setDoc(newPostRef, postData);
            Alert.alert('Success', 'Your post has been successfully created.');
          } catch (error) {
            console.error('Firestore error:', error);
            Alert.alert('Error', 'An error occurred while saving the post. Please try again.');
          }
        }
      );
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
      setImageUploading(false);
    }
  };
  useEffect(() => {
    console.log("Current postType: ", postType);
  }, [postType]);
  
  return (
    <SafeAreaView>
      <View style={styles.container}>
          {!isPersonalInfoComplete ? (
              <Text>Please complete your personal info to enable these options.</Text>
          ) : (
          <>
          <View style={styles.switchContainer}>
          <Text>Looking for Service</Text>
          <Switch
                value={postType === 'offeringService'}
                disabled={!isLegalInfoComplete}
                onValueChange={(newValue) => {
                  setPostType(newValue ? 'offeringService' : 'lookingForService');
                }}
                />
          <Text>Offering Service</Text>
                </View>
        <Text>Title</Text>
        <TextInput value={postTitle} onChangeText={(text) => setPostTitle(text)} />
        <Text>Category</Text>
        <Picker selectedValue={selectedCategoryId} onValueChange={(itemValue) => setSelectedCategoryId(Number(itemValue))}>
          {categoriesData.map((category) => (
            <Picker.Item key={category.id} label={category.text} value={category.id} />
          ))}
        </Picker>
        <Text>Option</Text>
        <Picker selectedValue={selectedOptionId} onValueChange={(itemValue) => setSelectedOptionId(Number(itemValue))}>
          {selectedCategoryId && categoriesData.find((cat) => cat.id === selectedCategoryId)?.options.map((option) => (
            <Picker.Item key={option.optionId} label={option.text} value={option.optionId} />
          ))}
        </Picker>
        <Text>City</Text>
        <TextInput value={city} onChangeText={(text) => setCity(text)} />
        <Text>Zip Code</Text>
        <TextInput value={zipcode} onChangeText={(text) => setZipcode(text)} />
        <Text>Description</Text>
        <TextInput multiline value={postDesc} onChangeText={(text) => setPostDesc(text)} />
        <Text>Price</Text>
        <TextInput value={postPrice} onChangeText={(text) => setPostPrice(text)} />
        <Button title="Select Image" onPress={pickImage} />
        {postImg && <Image source={{ uri: postImg }} style={{ width: 200, height: 200 }} />}
        <Button title="Submit Post" onPress={handlePost} disabled={loading} />
        {imageUploading && (
          <View style={styles.progressBarContainer}>
            <View style={{ ...styles.progressBar, width: `${uploadProgress}%` }} />
          </View>
        )}
        {loading && <ActivityIndicator size="large" color="#0000ff" />}

      </>
      )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBarContainer: {
    height: 20,
    width: '100%',
    backgroundColor: 'gray',
    borderRadius: 5,
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'green',
    borderRadius: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
});

export default AddPostScreen;
