import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, ActivityIndicator } from 'react-native';
import auth, { firebase } from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-crop-picker';
import { selectImageFromGallery } from '../../../service/ImageService';
import { AuthContext } from '../../context/AuthContext';


const SignUp = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [image, setImage] = useState(require('./avatar.png'));
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true
    }).then(image => {
      setImage(image.path);
    });
  };
  

  const handleSignUp = async () => {
    setLoading(true);

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Upload the avatar
      const imageName = `${displayName}_${new Date().toISOString()}`;
      const uploadUri = image ;
      const uploadTask = storage().ref(`profile_images/${imageName}`).putFile(uploadUri);

      uploadTask.on('state_changed', snapshot => {
        // You can add an upload progress here if you want
      });

      await uploadTask;

      const downloadURL = await storage().ref(`profile_images/${imageName}`).getDownloadURL();

      // Update user profile
      await user.updateProfile({
        displayName,
        photoURL: downloadURL
      });

      // Save user data in Firestore
      await firestore().collection('users').doc(user.uid).set({
        uid: user.uid,
        displayName,
        email,
        createdAt: new Date().getTime(),
        photoURL: downloadURL
      });

      // Initialize userChats collection
      await firestore().collection('userChats').doc(user.uid).set({});

      // Set user in context (if you have context set up)
      setCurrentUser({
        uid: user.uid,
        displayName,
        email,
        createdAt: new Date().getTime(),
        photoURL: downloadURL
      });

      setErrorMessage(null);
    } catch (error) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          setErrorMessage('That email address is already in use!');
          break;
        case 'auth/invalid-email':
          setErrorMessage('That email address is invalid!');
          break;
        default:
          setErrorMessage(error.message);
          break;
      }
    }

    setLoading(false);
  };

  return (
    <View style={{ padding: 20 }}>
      {errorMessage && <Text style={{ color: 'red' }}>{errorMessage}</Text>}
      <TextInput placeholder="Username" value={displayName} onChangeText={setDisplayName} style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, padding: 10 }} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, padding: 10 }} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, padding: 10 }} />
      <Button title="Pick an avatar" onPress={pickImage} />
      {image && (
      <Image 
        source={typeof image === 'number' ? image : { uri: image }} 
        style={{ width: 100, height: 100, margin: 20 }} 
      />
      )}

      {loading ? <ActivityIndicator size="large" /> : <Button title="Sign Up" onPress={handleSignUp} />}
      <Button title="Already have an account? Login" onPress={() => navigation.navigate('login')} />
    </View>
  );
}

export default SignUp;
