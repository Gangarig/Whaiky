import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useContext } from 'react';
import { LoginScreen } from './Screens/AuthStackScreens/LoginScreen';


export default function App() {
  return (
    <View style={styles.container}>
      <LoginScreen/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
