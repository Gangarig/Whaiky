import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import auth from '@react-native-firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

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
        setErrorMessage(null);
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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inner}>
        <Text style={styles.title}>Forgot Password</Text>
        {message && <Text style={{ color: 'green', marginBottom: 10 }}>{message}</Text>}
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
        />
        <Button title="Reset Password" onPress={handlePasswordReset} />
        <Button title="Back to Sign In" onPress={() => navigation.navigate('login')} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  }
});

export default ForgotPassword;
