import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Platform, KeyboardAvoidingView, Image } from 'react-native';
import auth from '@react-native-firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Logo from '../../../assets/logo/logo.png';
import { Global } from '../../../style/Global';
import { showMessage } from 'react-native-flash-message';

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const isEmailValid = (email) => {
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return emailPattern.test(email);
  };

  const handlePasswordReset = () => {
    if (!isEmailValid(email)) {
      showMessage({
        message: "Error",
        description: "Please enter a valid email address.",
        type: "danger",
      });
      setErrorMessage(null);
      return;
    }

    auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        setErrorMessage('Password reset email sent!');
      })
      .catch((error) => {
        let errorText = '';
        switch (error.code) {
          case 'auth/user-not-found':
            errorText = 'There is no user corresponding to the given email.';
            break;
          case 'auth/invalid-email':
            errorText = 'That email address is invalid!';
            break;
          default:
            errorText = error.message;
            break;
        }
        showMessage({
          message: "Error",
          description: errorText,
          type: "danger",
        });
      });
  };

  useEffect(() => {
    if (errorMessage) {
      showMessage({
        message: "Success",
        description: errorMessage, // this will contain 'Password reset email sent!' on success
        type: 'success',
      });
    }
  }, [errorMessage]);

  return (
    <LinearGradient colors={['#9E41F0', '#01AD94']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inner}>
          <View style={styles.box}>
            <Image source={Logo} style={styles.logoImage} />
          </View>
          <View style={styles.contentBox}>
            <Text style={Global.title}>Forgot Password</Text>
            <Text style={Global.label}>Email address</Text>
            <TextInput
              placeholder="Type your email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              autoCapitalize="none"
            />
            <View style={styles.buttonContainer}>
              <Button title="Reset Password" onPress={handlePasswordReset} style={Global.button} />
              <Button title="Back to Sign In" onPress={() => navigation.navigate('login')} style={Global.button} />
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
  message: {
    color: 'green',
    marginBottom: 20,
    fontWeight: 'bold',
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
