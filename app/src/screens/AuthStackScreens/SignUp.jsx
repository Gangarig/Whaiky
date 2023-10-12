import React, { useState, useContext, useEffect } from 'react';
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
import { Global } from '../../../style/Global';
import FlashMessage from 'react-native-flash-message';
import { showMessage } from 'react-native-flash-message';


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
      setErrorMessage(error.message); 
    }
  };

  useEffect(() => {
    if (errorMessage) {
      showMessage({
        message: errorMessage,
        type: 'danger',
      });
    }
  }, [errorMessage]);

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
  
    <SafeAreaView style={Global.container}>
      <LinearGradient 
      colors={['#9E41F0', '#01AD94']} 
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
      >
      <View style={[styles.content]}>
            <Text style={Global.title}>Sign Up</Text>
            <Text style={Global.label}>Email</Text>
            <TextInput
              style={[Global.input,styles.input]}
              placeholder="Email"
              onChangeText={(text) => setEmail(text)}
              value={email}
              autoCapitalize="none"
            />
            <Text style={Global.label}>Password</Text>
            <TextInput
              style={[Global.input,styles.input]}
              placeholder="Password"
              onChangeText={(text) => setPassword(text)}
              value={password}
              secureTextEntry
            />
            <Text style={Global.label}>Confirm Password</Text>
            <TextInput
              style={[Global.input,styles.input]}
              placeholder="Confirm Password"
              onChangeText={(text) => setPassword(text)}
              value={password}
              secureTextEntry
            />
            <Text style={Global.label}>Display Name</Text>
            <TextInput
              style={[Global.input,styles.input]}
              placeholder="Display Name"
              onChangeText={(text) => setDisplayName(text)}
              value={displayName}
            />
            <TouchableOpacity style={Global.button} onPress={pickImage}>
              <Text style={Global.buttonText}>Pick an image</Text>
            </TouchableOpacity>
            <Image source={image} style={Global.image} />
            <TouchableOpacity style={Global.button} onPress={handleSignUp}>
              <Text style={Global.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('login')}>
              <Text style={Global.linkText}>Already have an account? Sign In</Text>
            </TouchableOpacity>
      </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  gradient: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: 'white',
    width: '80%',
    padding: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    ...Global.input,
    width: '100%',
  },

});

export default SignUp;
