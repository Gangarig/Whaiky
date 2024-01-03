import React, { useState, useRef, useEffect } from 'react';
import {
  View, StyleSheet, Image, Text, Platform,
  TouchableOpacity, TextInput, Keyboard, ScrollView,
  KeyboardAvoidingView
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Logo from '../../assets/logo/logo.png';
import { Global } from '../../constant/Global';
import { showMessage } from 'react-native-flash-message';
import GradientButton from '../../components/GradientButton';
import { shadowStyle } from '../../constant/Shadow';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [attemptCount, setAttemptCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const passwordInputRef = useRef(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleSignIn = async () => {
    if (!email || !password) {
      setErrorMessage('Please fill in all fields.');
      showMessage({
        message: 'Error',
        description: 'Please fill in all fields.',
        type: 'danger',
      });
      return;
    }

    if (disabled) {
      setErrorMessage('Sign-in is disabled for 10 seconds. Please try again later.');
      showMessage({
        message: 'Error',
        description: 'Sign-in is disabled for 10 seconds. Please try again later.',
        type: 'danger',
      });
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      await auth().signInWithEmailAndPassword(email, password);
      setAttemptCount(0);
    } catch (error) {
      setAttemptCount((prevCount) => prevCount + 1);

      switch (error.code) {
        case 'auth/user-not-found':
          setErrorMessage('There is no user corresponding to the given email.');
          break;
        case 'auth/wrong-password':
          setErrorMessage('Wrong password.');
          break;
        case 'auth/invalid-email':
          setErrorMessage('That email address is invalid!');
          break;
        default:
          setErrorMessage(error.message);
          break;
      }
      showMessage({
        message: error.message,
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  const goToSignUp = () => {
    navigation.navigate('signup');
  };

  const handleForgotPassword = () => {
    navigation.navigate('forgot');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#9E41F0', '#01AD94']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
      </LinearGradient>
      <Image source={Logo} style={[Global.logo, styles.logo]} />
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={[styles.content, shadowStyle, { marginTop: keyboardVisible ? -100 : 100 }]}>
          <Text style={[Global.title, styles.title]}>LOGIN</Text>
          <View style={styles.inputs}>
            <Text style={[Global.titleSecondary, styles.label]}>Email address</Text>
            <TextInput
              style={[Global.input, styles.input]}
              placeholder="Email"
              onChangeText={(text) => setEmail(text)}
              value={email}
              autoCapitalize="none"
              onSubmitEditing={() => passwordInputRef.current.focus()}
              blurOnSubmit={false}
            />
            <Text style={[Global.titleSecondary, styles.label]}>Password</Text>
            <TextInput
              ref={passwordInputRef}
              style={[Global.input, styles.input]}
              placeholder="Password"
              onChangeText={(text) => setPassword(text)}
              value={password}
              secureTextEntry
            />
            <Text style={styles.forgot} onPress={handleForgotPassword}>FORGOT PASSWORD?</Text>
          </View>
        </View>
        <View style={styles.buttons}>
          <GradientButton text="CONTINUE" onPress={handleSignIn} />
          <Text>or</Text>
          <TouchableOpacity style={Global.link} onPress={goToSignUp}>
            <Text style={styles.signUp}>SIGN UP</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  content: {
    width: 330,
    height: 366,
    borderRadius: 10,
    backgroundColor: "#FBFBFB",
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    borderWidth: 1,
  },
  logo: {
    position: 'absolute',
    top: 30,
  },
  title: {
    position: 'absolute',
    top: 40,
  },
  forgot: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    fontWeight: '400',
    fontStyle: 'normal',
    color: '#7B7B7B',
    textAlign: 'right',
  },
  inputs: {
    gap: 5,
    marginTop: 20,
  },
  label: {
    marginTop: 20,
  },
  or: {
    color: '#7b7b7b',
    fontFamily: 'Montserrat-Medium, Helvetica',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0,
  },
  signUp: {
    color: '#000000',
    fontFamily: 'Montserrat-Bold, Helvetica',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0,
  },
  buttons: {
    gap: 5,
    alignItems: 'center',
    top: -24,
  },
});

export default Login;
