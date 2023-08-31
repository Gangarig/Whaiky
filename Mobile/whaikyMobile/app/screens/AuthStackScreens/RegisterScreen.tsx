import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Image, Platform, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth, firestore, storage } from '../../../FirebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { StackScreenProps } from '@react-navigation/stack';
import {useUser} from '../../context/UserContext';
import { set } from 'firebase/database';


const RegisterScreen = ({ navigation }: any) => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const { setCurrentUser } = useUser();
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = (result as any).uri;
      setImage(uri);
    }
    
  };

  const handleSubmit = async () => {
    setLoading(true);
  
    // Check if image is null
    if (image === null) {
      setError('No image selected.');
      setLoading(false);
      return;
    }
  
    try {
      const imageData = await fetch(image);
      const blob = await imageData.blob();
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const imageName = `${userName}_${new Date().toISOString()}`;
      const storageRef = ref(storage, `profile_images/${imageName}`);
  
      await uploadBytesResumable(storageRef, blob).then(() => {
        return getDownloadURL(storageRef);
      }).then(async (downloadURL) => {
        await updateProfile(res.user, {
          displayName: userName, 
          photoURL: downloadURL as string,
        });
        await setDoc(doc(firestore, 'users', res.user.uid), {
          uid: res.user.uid,
          userName,
          email,
          createdAt: new Date().getTime(),
          photoURL: downloadURL as string,
        });
        setCurrentUser({
          uid: res.user.uid,
          userName,
          email,
          createdAt: new Date().getTime(),
          avatarURL: downloadURL as string,
        });

        await setDoc(doc(firestore, 'userChats', res.user.uid), {});
        setLoading(false);
      });

    } catch (err) {
      console.log(err);
      setError('An error occurred during registration.');
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding">
        <Text>RegisterScreen</Text>
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={text => setEmail(text)} />
        <TextInput style={styles.input} placeholder="Username" value={userName} onChangeText={text => setUserName(text)} />
        <TextInput style={styles.input} placeholder="Password" secureTextEntry={true} value={password} onChangeText={text => setPassword(text)} />
        {error && <Text>{error}</Text>}
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <Button title="Sign Up" onPress={handleSubmit} />
          </>
        )}
        <Button title="Go to Login" onPress={() => navigation.navigate('login')} />
        <Button title="Add an avatar" onPress={pickImage} />
        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: 200,
    height: 40,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
});

export default RegisterScreen;