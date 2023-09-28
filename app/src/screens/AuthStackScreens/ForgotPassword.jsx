import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Platform, KeyboardAvoidingView, Image } from 'react-native';
import auth from '@react-native-firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Logo from '../../../assets/logo/logo.png';

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);

  const isEmailValid = (email) => {
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return emailPattern.test(email);
  };

  const handlePasswordReset = () => {
    if (!isEmailValid(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      setMessage(null);
      return;
    }

    auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        setMessage('Password reset email sent!');
      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/user-not-found':
            Alert.alert('Error', 'There is no user corresponding to the given email.');
            break;
          case 'auth/invalid-email':
            Alert.alert('Error', 'That email address is invalid!');
            break;
          default:
            Alert.alert('Error', error.message);
            break;
        }
      });
  };

  return (
    <LinearGradient colors={['#9E41F0', '#01AD94']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inner}>
          <View style={styles.box}>
            <Image source={Logo} style={styles.logoImage} />
          </View>
          <View style={styles.contentBox}>
            <Text style={styles.title}>Forgot Password</Text>
            {message && <Text style={styles.message}>{message}</Text>}
            <Text style={styles.label}>Email address</Text>
            <TextInput
              placeholder="Type your email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              autoCapitalize="none"
            />
            <View style={styles.buttonContainer}>
              <Button title="Reset Password" onPress={handlePasswordReset} style={styles.button} />
              <Button title="Back to Sign In" onPress={() => navigation.navigate('login')} style={styles.button} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
    marginTop: 20,
  },
  contentBox: {
    backgroundColor: 'white',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  message: {
    color: 'green',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  label: {
    marginBottom: 5,
    fontFamily: 'Montserrat',
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default ForgotPassword;
