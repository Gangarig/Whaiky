import React, { useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { useUser } from '../../context/UserContext';

const ForgotPasswordScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleResetPassword = () => {
    if (!email) {
      setError('Please enter your email.');
      return;
    }

    const auth = getAuth();

    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent successfully
        setSuccessMessage('Password reset email sent successfully.');
        setError('');
      })
      .catch((error) => {
        setError(error.message);
        setSuccessMessage('');
      });
  };

  return (
    <View>
      <Text>ForgotPasswordScreen</Text>
      <TextInput
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <Button
        title="Send Reset Email"
        onPress={handleResetPassword}
      />
      {/* Error message */}
      <Text style={{ color: 'red' }}>{error}</Text>
      {/* Success message */}
      <Text style={{ color: 'green' }}>{successMessage}</Text>
      <Button
        title="Go to Login"
        onPress={() => navigation.navigate('login')}
      />
      <Button
        title="Go to Register"
        onPress={() => navigation.navigate('register')}
      />
    </View>
  );
};

export default ForgotPasswordScreen;
