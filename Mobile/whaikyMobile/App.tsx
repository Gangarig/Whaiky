import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { ActivityIndicator, StyleSheet, Text, View, Button } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { UserProvider, useUser } from './app/context/UserContext';
import { useAnimatedStyle } from 'react-native-reanimated';
import { auth } from './FirebaseConfig';
// Components and Services
import LogOut from './app/screens/services/LogOut';
import Menu from './app/screens/AppStackScreens/components/Menu';
import LoadingScreen from './app/screens/AppStackScreens/LoadingScreen';

// Auth Screens
import LoginScreen from './app/screens/AuthStackScreens/LoginScreen';
import RegisterScreen from './app/screens/AuthStackScreens/RegisterScreen';
import WelcomeScreen from './app/screens/AuthStackScreens/WelcomeScreen';

// App Screens
import ProfileScreen from './app/screens/AppStackScreens/ProfileScreen';
import SettingsScreen from './app/screens/AppStackScreens/SettingsScreen';
import TransitionScreen from './app/screens/AppStackScreens/TransitionScreen';
import HomeScreen from './app/screens/AppStackScreens/HomeScreen';
import CompleteRegisterScreen from './app/screens/AppStackScreens/CompleteRegisterScreen';
import PostDetailScreen from './app/screens/AppStackScreens/PostDetailScreen';
import AddPostScreen from './app/screens/AppStackScreens/AddPostScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const HomeStack = createNativeStackNavigator();

const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="home" component={HomeScreen} />
      <HomeStack.Screen name="postDetail" component={PostDetailScreen} />
    </HomeStack.Navigator>
  );
};
const AppStack = () => {
  const { currentUser, loading } = useUser();

  if (loading) {
    return <LoadingScreen />;
  }


  const AppScreens = () => (
    <Drawer.Navigator initialRouteName="Whaiky">
      <Drawer.Screen name="HomeStack" component={HomeStackNavigator}/>
      <Drawer.Screen name="profile" component={ProfileScreen} />
      <Drawer.Screen name="settings" component={SettingsScreen} />
      <Drawer.Screen name="transition" component={TransitionScreen} />
      <Drawer.Screen name="addPost" component={AddPostScreen} />
      <Drawer.Screen name="complete" component={CompleteRegisterScreen} />
      <Drawer.Screen name="Log Out" component={LogOut} />
    </Drawer.Navigator>
  );


  const AuthScreens = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="register" component={RegisterScreen} />
      <Stack.Screen name="welcome" component={WelcomeScreen} />

    </Stack.Navigator>
  );

  return (
    <>
      {currentUser ? <AppScreens /> : <AuthScreens />}
    </>
  );
};


export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <SafeAreaProvider>
          <AppStack />
        </SafeAreaProvider>
      </NavigationContainer>
    </UserProvider>
  );
}
