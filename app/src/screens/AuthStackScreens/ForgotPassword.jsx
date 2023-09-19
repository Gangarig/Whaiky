import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handlePasswordReset = () => {
    auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        setMessage('Password reset email sent!');
        setErrorMessage(null);
      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/user-not-found':
            setErrorMessage('There is no user corresponding to the given email.');
            break;
          case 'auth/invalid-email':
            setErrorMessage('That email address is invalid!');
            break;
          default:
            setErrorMessage(error.message);
            break;
        }
      });
  };

  return (
    <SafeAreaView>
      <View style={{ padding: 20 }}>
        {errorMessage && <Text style={{ color: 'red' }}>{errorMessage}</Text>}
        {message && <Text style={{ color: 'green' }}>{message}</Text>}
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, padding: 10 }}
        />
        <Button title="Reset Password" onPress={handlePasswordReset} />
        <Button title="Back to Sign In" onPress={() => navigation.navigate('login')} />
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;
