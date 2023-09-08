import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { ActivityIndicator, StyleSheet, Text, View, Button } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { UserProvider, useUser } from './app/context/UserContext';
import { useAnimatedStyle } from 'react-native-reanimated';
import { auth } from './FirebaseConfig';
import { ChatContextProvider ,useChat} from './app/context/ChatContext';


// Components and Services
import LogOut from './app/screens/services/LogOut';
import Menu from './app/screens/AppStackScreens/components/Menu';
import LoadingScreen from './app/screens/AppStackScreens/LoadingScreen';
import CountryCityState from './app/screens/AppStackScreens/components/CountryStateCity';
import Chat from './app/screens/AppStackScreens/chat/Chat';
import Chats from './app/screens/AppStackScreens/chat/Chats';
import Messages from './app/screens/AppStackScreens/chat/Messages';
import Message from './app/screens/AppStackScreens/chat/Message';
import Input from './app/screens/AppStackScreens/chat/Input';
import Search from './app/screens/AppStackScreens/chat/Search';



// Auth Screens
import LoginScreen from './app/screens/AuthStackScreens/LoginScreen';
import RegisterScreen from './app/screens/AuthStackScreens/RegisterScreen';
import WelcomeScreen from './app/screens/AuthStackScreens/WelcomeScreen';
import ForgotPasswordScreen from './app/screens/AuthStackScreens/ForgotPasswordScreen';

// App Screens
import ProfileScreen from './app/screens/AppStackScreens/ProfileScreen';
import SettingsScreen from './app/screens/AppStackScreens/SettingsScreen';
import TransitionScreen from './app/screens/AppStackScreens/TransitionScreen';
import HomeScreen from './app/screens/AppStackScreens/HomeScreen';
import CompleteRegisterScreen from './app/screens/AppStackScreens/CompleteRegisterScreen';
import CompleteRegisterScreen2 from './app/screens/AppStackScreens/CompleteRegisterScreen2';
import PostDetailScreen from './app/screens/AppStackScreens/PostDetailScreen';
import AddPostScreen from './app/screens/AppStackScreens/AddPostScreen';
import CategoryScreen from './app/screens/AppStackScreens/CategoryScreen';
import CategoryDetail from './app/screens/AppStackScreens/CategoryDetail';
import ChatScreen from './app/screens/AppStackScreens/ChatScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const HomeStack = createNativeStackNavigator();
const CategoryStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const ChatStack = createNativeStackNavigator();

const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="profile" component={ProfileScreen} />
      <ProfileStack.Screen name="complete" component={CompleteRegisterScreen} />
      <ProfileStack.Screen name="complete2" component={CompleteRegisterScreen2} />
    </ProfileStack.Navigator>
  );
};


const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="home" component={HomeScreen} />
      <HomeStack.Screen name="postDetail" component={PostDetailScreen} />
    </HomeStack.Navigator>
  );
};


const CategoryStackNavigator = () => {
  return (
    <CategoryStack.Navigator screenOptions={{ headerShown: false }}>
      <CategoryStack.Screen name="category" component={CategoryScreen} />
      <CategoryStack.Screen name="CategoryDetail" component={CategoryDetail} />
    </CategoryStack.Navigator>
  );
};

const ChatStackNavigator = () => {
  return (
    <ChatStack.Navigator screenOptions={{ headerShown: false }}>
      <ChatStack.Screen name="ChatScreen" component={ChatScreen} />
      <ChatStack.Screen name="Chat" component={Chat} />
    </ChatStack.Navigator>
  );
};

const AppStack = () => {
  const { currentUser, loading } = useUser();

  if (loading) {
    return <LoadingScreen />;
  }


  const AppScreens = () => (
    <Drawer.Navigator initialRouteName="Whaiky">
      <Drawer.Screen name="Home" component={HomeStackNavigator}/>
      <Drawer.Screen name="Profile" component={ProfileStackNavigator} />
      <Drawer.Screen name="Category" component={CategoryStackNavigator} />
      <Drawer.Screen name="Messages" component={ChatStackNavigator} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Log Out" component={LogOut} />
      
    </Drawer.Navigator>
  );


  const AuthScreens = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="register" component={RegisterScreen} />
      <Stack.Screen name="welcome" component={WelcomeScreen} />
      <Stack.Screen name="forgotPassword" component={ForgotPasswordScreen} />
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
        <ChatContextProvider>
          <NavigationContainer>
            <SafeAreaProvider>
              <AppStack />
            </SafeAreaProvider>
          </NavigationContainer>
        </ChatContextProvider>
      </UserProvider>
  );
}
