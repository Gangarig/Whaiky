import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Platform, Image, KeyboardAvoidingView } from 'react-native';
import auth from '@react-native-firebase/auth';
import { showMessage } from 'react-native-flash-message';
import Logo from '../../assets/logo/logo.png';
import { Global } from '../../constant/Global';
import LinearGradient from 'react-native-linear-gradient';
import { shadowStyle } from '../../constant/Shadow';
import PrimaryButton from '../../components/Buttons/PrimaryButton';

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
    <LinearGradient colors={['#9E41F0', '#01AD94']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={Global.container}>

      {Platform.OS === 'android' && (
        <Image source={Logo} style={[Global.logo, styles.logo]} />
      )  
      }
      {Platform.OS === 'ios' ? (
        <KeyboardAvoidingView
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' ,width:'100%'}}
          behavior="padding"
          keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}
        >
          <Image source={Logo} style={[Global.logo, styles.logo]} />
          <View style={[styles.content, Global.center, shadowStyle]}>
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

            <View style={[Global.row,styles.ButtonBox,styles.ios]}>
            <PrimaryButton text="Reset" onPress={handlePasswordReset} />
            <PrimaryButton text="Back" onPress={() => navigation.navigate('login')} />
            </View>
          </View>
        </KeyboardAvoidingView>
      ) : (
        <View style={[styles.content, Global.center, shadowStyle]}>
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

          <View style={[Global.row,styles.ButtonBox]}>
            <PrimaryButton text="Reset" onPress={handlePasswordReset} />
            <PrimaryButton text="Back" onPress={() => navigation.navigate('login')} />
          </View>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    gap: 10,
    borderWidth: .5,
  },
  logo: {
    marginBottom: 30,
  },
  ButtonBox:{
    gap: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },

});

export default ForgotPassword;
