import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Platform, KeyboardAvoidingView, Image } from 'react-native';
import auth from '@react-native-firebase/auth';
import { showMessage } from 'react-native-flash-message';
import Logo from '../../assets/logo/logo.png';
import {Global} from '../../constant/Global';
import LinearGradient from 'react-native-linear-gradient';

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const isEmailValid = (email) => {
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return emailPattern.test(email);
  };

  const clearFields = () => {
    setEmail('');
    setErrorMessage(null);
  };

  const handlePasswordReset = () => {
    if (!isEmailValid(email)) {
      showMessage({
        message: "Error",
        description: "Please enter a valid email address.",
        type: "danger",
      });
      clearFields();
      return;
    }

    auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        showMessage({
          message: "Success",
          description: 'Password reset email sent!',
          type: "success",
        });
        clearFields();
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
    // Cleanup error message when navigating back to this screen
    return () => {
      setErrorMessage(null);
    };
  }, []);

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      keyboardVerticalOffset={Platform.select({ios: 0, android: 500})}
    >
      <LinearGradient colors={['#9E41F0', '#01AD94']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={Global.container}>
        <Image source={Logo} style={[Global.logo, styles.logo]} />
        
        <View style={[styles.content, Global.center]}>
            <Text style={Global.title}>Forgot Password</Text>
            <Text style={Global.titleSecondary}>Email address</Text>

            <TextInput
                style={Global.input}
                placeholder="Type your email"
                placeholderTextColor="#383838"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
            />

            <View style={Global.row}>
                <Button title="Reset Password" onPress={handlePasswordReset} />
                <Button title="Back to Login" onPress={() => navigation.navigate('login')} />
            </View>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#FBFBFB',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    gap: 10,
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: 4,
    shadowOpacity: 1,
  },
  logo: {
    marginBottom: 30,
  }
});

export default ForgotPassword;
