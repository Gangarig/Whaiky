import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { useState,useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig';
//auth Screens
import LoginScreen from './app/screens/AuthStackScreens/LoginScreen';
import RegisterScreen from './app/screens/AuthStackScreens/RegisterScreen';
import WelcomeScreen from './app/screens/AuthStackScreens/WelcomeScreen';
//app Screens
import ProfileScreen from './app/screens/AppStackScreens/ProfileScreen';
import SettingsScreen from './app/screens/AppStackScreens/SettingsScreen';


const stack = createNativeStackNavigator();
const appStack = createNativeStackNavigator();
const authStack = createNativeStackNavigator();

function AuthStackScreens() {
  return (
    <authStack.Navigator>
      <authStack.Screen name="login" component={LoginScreen} options={ {}}/>
      <authStack.Screen name="register" component={RegisterScreen} options={ {}}/>
      <authStack.Screen name="welcome" component={WelcomeScreen} options={ {}}/>
    </authStack.Navigator>
  )
}
function AppStackScreens() {
  return (
    <appStack.Navigator>
      <appStack.Screen name="profile" component={ProfileScreen} options={ {}}/>
      <appStack.Screen name="settings" component={SettingsScreen} options={ {}}/>
    </appStack.Navigator>
  )
}

export default function App() {
  const [user, setUser] = useState< User | null> (null)
  useEffect (() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('user', user);
      setUser(user);
  })}
  , [])
  return (
      <NavigationContainer>
        <stack.Navigator>
          {user ? (
                <stack.Screen name="Login" component={AppStackScreens} options={{headerShown:false}}/>
          ) : (
                <stack.Screen name="Login" component={AuthStackScreens} options={{headerShown:false}}/>
          )}
        </stack.Navigator>
      </NavigationContainer>
  );
}

