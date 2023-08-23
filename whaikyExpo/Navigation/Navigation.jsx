import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Screens
// Auth Screens
import { LoginScreen } from '../Screens/AuthStackScreens/LoginScreen';
import SignupScreen from '../Screens/AuthStackScreens/SignupScreen';
import ForgotPasswordScreen from '../Screens/AuthStackScreens/ForgotPasswordScreen';
// App Screens
import HomeScreen from '../Screens/AppStackScreens/HomeScreen';
import ProfileScreen from '../Screens/AppStackScreens/ProfileScreen';
import SettingsScreen from '../Screens/AppStackScreens/SettingsScreen';



const AuthStack = createStackNavigator();
const AppStack = createStackNavigator();

export const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Login" component={LoginScreen} />
        <AuthStack.Screen name="Signup" component={SignupScreen} />
        <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

    </AuthStack.Navigator>
  );
}

export const AppStackNavigator = () => {
  return (
    <AppStack.Navigator>
      <AppStack.Screen name="Home" component={HomeScreen} />
        <AppStack.Screen name="Profile" component={ProfileScreen} />
        <AppStack.Screen name="Settings" component={SettingsScreen} />
    </AppStack.Navigator>
  );
}
