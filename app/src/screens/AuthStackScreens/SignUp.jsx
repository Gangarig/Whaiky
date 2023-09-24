import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Image, ActivityIndicator, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-crop-picker';
import { AuthContext } from '../../context/AuthContext';

const SignUp = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [image, setImage] = useState(require('./avatar.png'));
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useContext(AuthContext);

  const isFormValid = () => email && password && displayName;

  const clearInputs = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
    setImage(require('./avatar.png'));
  };

  const pickImage = async () => {
    try {
      const selectedImage = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true
      });
      setImage(selectedImage.path);
    } catch (error) {
      console.error('Image selection error:', error);
    }
  };

  const handleSignUp = async () => {
    if (!isFormValid()) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      // User creation
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Avatar upload using user's UID as filename
      const imageName = user.uid; // This line changed from the earlier dynamic naming
      await storage().ref(`profile_images/${imageName}`).putFile(image);
      const downloadURL = await storage().ref(`profile_images/${imageName}`).getDownloadURL();

      // User profile and Firestore update
      await user.updateProfile({ displayName, photoURL: downloadURL });
      await firestore().collection('users').doc(user.uid).set({
        uid: user.uid,
        displayName,
        email,
        createdAt: new Date().getTime(),
        photoURL: downloadURL
      });
      
      setCurrentUser({ uid: user.uid, displayName, email, photoURL: downloadURL });

      setErrorMessage(null);
      clearInputs();

      alert("Signed up successfully");
      await auth().signInWithEmailAndPassword(email, password);
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
    } finally {
      setLoading(false);
    }
};


  return (
    <View style={styles.container}>
      {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
      <TextInput placeholder="Username" value={displayName} onChangeText={setDisplayName} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Button title="Pick an avatar" onPress={pickImage} />
      {image && <Image source={typeof image === 'number' ? image : { uri: image }} style={styles.avatar} />}
      {loading ? <ActivityIndicator size="large" /> : <Button title="Sign Up" onPress={handleSignUp} disabled={!isFormValid()} />}
      <Button title="Already have an account? Login" onPress={() => navigation.navigate('login')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10
  },
  avatar: {
    width: 100,
    height: 100,
    margin: 20
  }
});

export default SignUp;
