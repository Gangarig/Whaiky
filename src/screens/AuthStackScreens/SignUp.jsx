import React, { useState, useContext, useEffect } from 'react';
import { View, Text,TextInput, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { Global } from '../../constant/Global';
import { showMessage } from 'react-native-flash-message';
import GradientButton from '../../components/GradientButton';
import signInWithGoogle from './SocialSignIn/Google';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';

const InputField = ({ label, value, onChangeText, secureTextEntry }) => (
  <View>
    <Text style={Global.titleSecondary}>{label}</Text>
    <TextInput
      style={Global.input}
      placeholder={`Type your ${label.toLowerCase()}`}
      onChangeText={onChangeText}
      value={value}
      secureTextEntry={secureTextEntry}
    />
  </View>
);

const SignUp = ({ navigation }) => {
  const [formData, setFormData] = useState({ email: '', password: '', displayName: '' });
  const [errorMessage, setErrorMessage] = useState(null);
  const { setCurrentUser } = useContext(AuthContext);

  const isPasswordValid = () => {
    const hasMinLength = formData.password.length >= 8;
    const hasSpecialChar = /[~!@#$%^&*()_+\\-=[\]{}|;:'",.<>?]/.test(formData.password);
    return hasMinLength && hasSpecialChar;
};

  


  useEffect(() => {
    if (errorMessage) {
      showMessage({ message: errorMessage, type: 'danger' });
    }
    return () => {
      setFormData({ email: '', password: '', displayName: '' });
      setErrorMessage(null);
    };
  }, [errorMessage]);

  const handleInputChange = (name, value) => {
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSignUp = async () => {
    if (!formData.email || !formData.password || !formData.displayName) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    if (!isPasswordValid()) {
      setErrorMessage('Password must have at least 8 characters and one special character');
      return;
    }

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(formData.email, formData.password);
      const user = userCredential.user;
      await firestore().collection('users').doc(user.uid).set({
        uid: user.uid,
        displayName: formData.displayName,
        email: formData.email,
        createdAt: new Date().getTime(),
        photoURL: '', 
      });
      setCurrentUser({ uid: user.uid, displayName: formData.displayName, email: formData.email, photoURL: '' });
      showMessage({ message: 'Account created successfully!', type: 'success' });
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#9E41F0', '#01AD94']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient} />
      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.select({ios: 0, android: 500})}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.content}>
            <Text style={[Global.title, styles.title]}>Create new account</Text>
            <InputField label="User name" value={formData.displayName} onChangeText={(text) => handleInputChange('displayName', text)} />
            <InputField label="Email address" value={formData.email} onChangeText={(text) => handleInputChange('email', text)} />
            <InputField label="Password" value={formData.password} onChangeText={(text) => handleInputChange('password', text)} secureTextEntry={true} />
          </View>
          <View style={[styles.Buttons, Global.center]}>
            <GradientButton text="CONTINUE" onPress={handleSignUp} />
            <Text style={Global.text}>or</Text>
            <GoogleSigninButton
            style={styles.googleButton}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={() => signInWithGoogle(setCurrentUser)}
            />
            <Text style={Global.text}>
              Already have an account? <Text onPress={() => navigation.navigate('login')} style={Global.link}> Sign-in</Text> instead
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView> 
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#FBFBFB',
  },
  gradient: {
    height: '50%',
    position: 'absolute',
    top: 0,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardView: { 
    flex: 1, 
    width: '100%' 
  },
  scrollView: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  content: {
    width: 330,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 30,
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: "#FBFBFB",
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4,
    shadowOpacity: 1,
    gap: 7,
  },
  title: { fontSize: 24 },
  Buttons: {
    top: -25,
    gap: 5,
  },
  googleButton: {
    width: 248,
    height: 48,
    borderRadius: 4,
    elevation: 5, // Android shadow
    backgroundColor: 'transparent',
    shadowColor: 'rgba(37, 44, 97, 0.3)', // iOS shadow
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 10,
    shadowOpacity: 1,
  }
});

export default SignUp;
