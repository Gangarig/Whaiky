import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Logo from '../../../assets/logo/logo.png';
import ButtonWithGradient from '../../style/Button';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    if (attemptCount >= 3) {
      setErrorMessage('Too many failed attempts. Please wait and try again.');
      return;
    }

    setLoading(true);

    try {
      await auth().signInWithEmailAndPassword(email, password);
      console.log('User signed in!');
      setErrorMessage(null);
      setAttemptCount(0);
      // Optionally, navigate the user to a home or dashboard screen after successful login
      // navigation.navigate('Home');
    } catch (error) {
      console.error('Login error:', error);
      setAttemptCount(prevCount => prevCount + 1);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={['#9E41F0', '#01AD94']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.container}>
        <View style={styles.box}>
          <Image source={Logo} style={styles.logoImage} />
        </View>
        <View style={styles.box1}>
          <View style={styles.box2}>
            <Text style={styles.title}>LOGIN</Text>
            {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
            <Text style={styles.label}>Email address</Text>
            <TextInput placeholder="Type your email" value={email} onChangeText={setEmail} style={styles.input} />
            <Text style={styles.label}>Password</Text>
            <TextInput placeholder="Type your password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
            <TouchableOpacity style={styles.forgot} onPress={() => navigation.navigate('forgot')}>
              <Text>Forgot Password?</Text>
            </TouchableOpacity>
            <View style={styles.box3}>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ButtonWithGradient onPress={handleSignIn} title="CONTINUE" />
              </View>
              <Text>or</Text>
              <TouchableOpacity onPress={() => navigation.navigate('signup')}>
                <Text style={styles.signup}>SIGN UP</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    position: 'absolute',
    top: 20,
    color: '#000',
    fontFamily: 'Montserrat',
    fontSize: 25,
    fontWeight: '700',
    lineHeight: 32 * 1.2,
  },
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
    marginTop: 20,
  },
  box: {
    width: '100%',
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 50,
  },
  box1: {
    width: '100%',
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  box2: {
    width: '90%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 100,
    zIndex: 11,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative',
  },
  box3: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: -80,
    zIndex: 11,
    gap: 10,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    padding: 10,
    width: '90%',
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    paddingLeft: 0,
    fontFamily: 'Lato',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 14 * 1.0,
  },
  label: {
    marginTop: 10,
    width: '90%',
    textAlign: 'left',
    marginBottom: 5,
    fontFamily: 'Montserrat',
    fontSize: 16,
    fontWeight: '600',
  },
  forgot: {
    width: '90%',
    alignItems: 'flex-end',
    fontFamily: 'Lato',
    fontSize: 12,
    fontWeight: '400',
    color: '#7B7B7B',
    lineHeight: 12,
  },
  signup: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    lineHeight: 16 * 1.2,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 12,
    marginTop: 10,
  },
});

export default Login;
