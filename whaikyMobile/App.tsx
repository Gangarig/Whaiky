import * as React from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createStackNavigator } from '@react-navigation/stack';
import { useState } from 'react';

//auth screens
import Login from './src/screens/AuthStackScreens/Login';
import SignUp from './src/screens/AuthStackScreens/SignUp';
import ForgotPassword from './src/screens/AuthStackScreens/ForgotPassword';

//app screens
import Home from './src/screens/AppStackScreens/Home';
import Profile from './src/screens/AppStackScreens/Profile';
import Settings from './src/screens/AppStackScreens/Settings';
import Notifications from './src/screens/AppStackScreens/Notifications';
import Category from './src/screens/AppStackScreens/Category';
import ChatScreen from './src/screens/AppStackScreens/ChatScreen';
import CategoryDetail from './app/screens/AppStackScreens/CategoryDetail';

// components
import LogOut from './src/components/LogOut';
import Loading from './src/components/Loading';

//context 
import { useAuth , AuthProvider } from './src/context/AuthContext';


const Stack = createStackNavigator();
function customStack() {
  return (
    <Stack.Navigator >
      <Stack.Screen name="CategoryDetail" component={CategoryDetail} />
    </Stack.Navigator>
  );
}

const Drawer = createDrawerNavigator();
function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Category" component={Category} />
      <Drawer.Screen name="ChatScreen" component={ChatScreen} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="Settings" component={Settings} />
      <Drawer.Screen name="Log Out" component={LogOut}/>
    </Drawer.Navigator>
  );
}
const AuthStack = createStackNavigator();
function AuthStackScreens() {
  return (
    <AuthStack.Navigator initialRouteName='login'>
      <AuthStack.Screen name="login" component={Login} />
      <AuthStack.Screen name="signup" component={SignUp} />
      <AuthStack.Screen name="forgot" component={ForgotPassword} />
    </AuthStack.Navigator>
  );
}


function Main() {
  const { currentUser, setCurrentUser, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
      <SafeAreaProvider>
      <NavigationContainer>
        { currentUser ? 
        <DrawerNavigator /> :
        <AuthStackScreens />
        }
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
    <Main />
    </AuthProvider>
  );
}
