import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { auth } from '../../../FirebaseConfig';

const LogOut = () => {
  useEffect(() => {
    auth.signOut().then(() => {
      console.log('Logged out');
    }).catch((error) => {
      console.error('Failed to log out', error);
    });
  }, []);

  return (
    <View>
      <Text>Logging out...</Text>
    </View>
  );
};

export default LogOut;
