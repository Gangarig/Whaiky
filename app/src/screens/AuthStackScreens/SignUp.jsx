import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-crop-picker';
import { AuthContext } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Logo from '../../../assets/logo/logo.png';

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
        cropping: true,
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
        imageURL =
          'https://firebasestorage.googleapis.com/v0/b/whaiky-f9e40.appspot.com/o/profile_images%2Favatar.png?alt=media&token=d53e6557-2d05-4137-8092-4100bc4ab2f1';
      }

      await user.updateProfile({ displayName, photoURL: imageURL });
      await firestore().collection('users').doc(user.uid).set({
        uid: user.uid,
        displayName,
        email,
        createdAt: new Date().getTime(),
        photoURL: imageURL,
      });
      setCurrentUser({ uid: user.uid, displayName, email, photoURL: imageURL });

      setErrorMessage(null);
      alert('Signed up successfully');
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error('Sign-up error:', error);

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
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={['#9E41F0', '#01AD94']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.container}>
          {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.label}>Username</Text>
          <TextInput
            placeholder="Username"
            value={displayName}
            onChangeText={setDisplayName}
            style={styles.input}
          />
          <Text style={styles.label}>Email</Text>
          <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Pick an avatar</Text>
          </TouchableOpacity>
          {image && <Image source={typeof image === 'number' ? image : { uri: image }} style={styles.avatar} />}
          {loading ? (
            <ActivityIndicator size="large" color="#9E41F0" />
          ) : (
            <TouchableOpacity
              style={styles.button}
              onPress={handleSignUp}
              disabled={!isFormValid()}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => navigation.navigate('login')}>
            <Text style={styles.loginLink}>Already have an account? Login</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    padding: 20,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
  },
  avatar: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#9E41F0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  loginLink: {
    marginTop: 20,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default SignUp;
