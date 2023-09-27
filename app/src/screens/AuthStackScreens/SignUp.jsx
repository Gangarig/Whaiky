import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Image, ActivityIndicator, StyleSheet , ScrollView} from 'react-native';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-crop-picker';
import { AuthContext } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const SignUp = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [image, setImage] = useState(require('./avatar.png'));
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useContext(AuthContext);

  const DEFAULT_IMAGE = require('./avatar.png');

  const isFormValid = () => email && password && displayName;

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
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      let imageURL = DEFAULT_IMAGE;

      if (image !== DEFAULT_IMAGE) {
        const imageName = user.uid; 
        await storage().ref(`profile_images/${imageName}`).putFile(image);
        imageURL = await storage().ref(`profile_images/${imageName}`).getDownloadURL();
      } else {
        imageURL = 'https://firebasestorage.googleapis.com/v0/b/whaiky-f9e40.appspot.com/o/profile_images%2Favatar.png?alt=media&token=d53e6557-2d05-4137-8092-4100bc4ab2f1';
      }

      await user.updateProfile({ displayName, photoURL: imageURL });
      await firestore().collection('users').doc(user.uid).set({
        uid: user.uid,
        displayName,
        email,
        createdAt: new Date().getTime(),
        photoURL: imageURL
      });
      setCurrentUser({ uid: user.uid, displayName, email, photoURL: imageURL });

      setErrorMessage(null);
      alert("Signed up successfully");
      await auth().signInWithEmailAndPassword(email, password);

    } catch (error) {
      console.error("Sign-up error:", error);

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
    <SafeAreaView>
    <ScrollView>
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
    </ScrollView>
    </SafeAreaView>
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
