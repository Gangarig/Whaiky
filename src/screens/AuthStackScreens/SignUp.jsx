import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../../../app/src/context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { Global } from '../../../style/Global';
import { showMessage } from 'react-native-flash-message';
import GradientButton from '../../../style/GradientButton';

const SignUp = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [checkBox1, setCheckBox1] = useState(false);
  const [checkBox2, setCheckBox2] = useState(false);
  const { setCurrentUser } = useContext(AuthContext);

  useEffect(() => {
    setCheckBox1(password.length >= 8);
    setCheckBox2(/[~!@#$%^&*()_+\-=[\]{}|;:'",.<>?/]/.test(password));
   
}, [password]);

  useEffect(() => {
    if (errorMessage) {
      showMessage({
        message: errorMessage,
        type: 'danger',
      });
    }
  }, [errorMessage]);
  const handleSignUp = async () => {
    if (!email || !password || !displayName) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      await firestore().collection('users').doc(user.uid).set({
        uid: user.uid,
        displayName,
        email,
        createdAt: new Date().getTime(),
        photoURL: '', 
      });
      setCurrentUser({ uid: user.uid, displayName, email, photoURL: '' });

      setErrorMessage(null);
      showMessage({
        message: 'Account created successfully!',
        type: 'success',
      });
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      showMessage({
        message: error.message,
        type: 'danger',
      });
    
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
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#9E41F0', '#01AD94']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
      </LinearGradient>
      <KeyboardAvoidingView 
        style={{ flex: 1, width: '100%' }} 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        keyboardVerticalOffset={Platform.select({ios: 0, android: 500})}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={[styles.content]}>
          <Text style={[Global.title,styles.title]}>Create new account</Text>
          <Text style={Global.titleSecondary}>User name</Text>
          <TextInput
            style={Global.input}
            placeholder="Type your name"
            onChangeText={(text) => setDisplayName(text)}
            value={displayName}
          />
          <Text style={Global.titleSecondary}>Email address</Text>
          <TextInput
            style={Global.input}
            placeholder="Type your email"
            onChangeText={(text) => setEmail(text)}
            value={email}
          />
          <Text style={Global.titleSecondary}>Password</Text>
          <TextInput
            style={Global.input}
            placeholder="Type your password"
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry
          />
          <View style={styles.checkboxContainer}>
            <Text style={Global.text}>
              Password must have 8 characters
            </Text>
          </View>
          <View style={styles.checkboxContainer}>
            <Text style={Global.text}>
              At least one number or special character
            </Text>
          </View>
        </View>
        <View style={[styles.Buttons,Global.center]}>
            <GradientButton text="CONTINUE" onPress={handleSignUp} />
            <Text style={Global.text}>or</Text>
            <GradientButton text="Custom" onPress={() => navigation.navigate('')} />
            <GradientButton text="Custom" onPress={() => navigation.navigate('')} />
            <Text style={Global.text}>Already have an account? <Text onPress={()=>navigation.navigate('login')} style={Global.link}> Sign-in</Text> instead</Text>
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
    position:'relative',
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
  content: {
    width: 330,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 30,
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: "#FBFBFB",
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: 4,
    shadowOpacity: 1,
    gap: 7,
  },
  title: {
    fontSize: 24,
  },
  Buttons: {
    top:-25,
    gap: 5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  }
});

export default SignUp;





