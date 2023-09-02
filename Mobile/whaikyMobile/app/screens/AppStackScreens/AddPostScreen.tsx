import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Image, ActivityIndicator, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { db, firestore ,storage} from '../../../FirebaseConfig';
import { categoriesData } from './data/categoriesData';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { addDoc, collection } from "firebase/firestore";
import { set } from 'firebase/database';
import { useUser } from '../../context/UserContext';
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



const AddPost = () => {
  const [postTitle, setPostTitle] = useState<string>('');
  const [postDesc, setPostDesc] = useState<string>('');
  const [postPrice, setPostPrice] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null | undefined>(undefined);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null | undefined>(undefined);  
  const [postImg, setPostImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);

  const pickImage = async () => {
    const result: any = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    
    if (!result.cancelled) {
      setPostImg(result.uri);
    }
  };

  const handlePost = async () => {
    setLoading(true);
    if (!postTitle || !postDesc || !postPrice || !postImg || !selectedCategoryId || !selectedOptionId) {
      Alert.alert('Error', 'Please fill in all the fields.');
      setLoading(false);
      return;
    }
  
    if (isNaN(parseFloat(postPrice))) {
      Alert.alert('Error', 'Please enter a valid price.');
      setLoading(false);
      return;
    }
  
    try {
      const newPostRef = doc(collection(firestore, 'posts'));
      const postId = newPostRef.id;
      const postImageData = await fetch(postImg);
      const blob = await postImageData.blob();
      const imageName = `post_${postId}`;
      const storageRef = ref(storage, `post_images/${imageName}`);

      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Handle progress
        },
        (error) => {
          // Handle error
          console.error('Upload error:', error);
          Alert.alert('Error', 'An error occurred during the image upload. Please try again.');
        },
        async () => {
          const url = await getDownloadURL(storageRef);
          setDownloadURL(url);

          const postData = {
            title: postTitle,
            description: postDesc,
            price: parseFloat(postPrice),
            categoryId: selectedCategoryId,
            optionId: selectedOptionId,
            imageUrl: url,
          };
  
          await setDoc(newPostRef, postData);
          setLoading(false);
          Alert.alert('Success', 'Your post has been successfully created.');
        }
      );
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };
  

  return (
    <SafeAreaView>
    <View style={styles.container}>
      <Text>Title</Text>
      <TextInput value={postTitle} onChangeText={(text) => setPostTitle(text)} />
      
      <Text>Category</Text>
      <Picker
        selectedValue={selectedCategoryId}
        onValueChange={(itemValue) => setSelectedCategoryId(Number(itemValue))}
      >
        {categoriesData.map((category) => (
          <Picker.Item key={category.id} label={category.text} value={category.id} />
        ))}
      </Picker>

      <Text>Option</Text>
      <Picker
        selectedValue={selectedOptionId}
        onValueChange={(itemValue) => setSelectedOptionId(Number(itemValue))}
      >
        {selectedCategoryId &&
          categoriesData.find((cat) => cat.id === selectedCategoryId)?.options.map((option) => (
            <Picker.Item key={option.optionId} label={option.text} value={option.optionId} />
          ))}
      </Picker>

      <Text>Description</Text>
      <TextInput multiline value={postDesc} onChangeText={(text) => setPostDesc(text)} />

      <Text>Price</Text>
      <TextInput value={postPrice} onChangeText={(text) => setPostPrice(text)} />

      <Button title="Select Image" onPress={pickImage} />
      {postImg && <Image source={{ uri: postImg }} style={{ width: 200, height: 200 }} />}
      
      <Button title="Submit Post" onPress={handlePost} disabled={loading} />

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
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
});
export default AddPost;
