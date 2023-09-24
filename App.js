import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createStackNavigator } from '@react-navigation/stack';


//auth screens
import Login from './app/src/screens/AuthStackScreens/Login'
import SignUp from './app/src/screens/AuthStackScreens/SignUp'
import ForgotPassword from './app/src/screens/AuthStackScreens/ForgotPassword'
//app screens
import Home from './app/src/screens/AppStackScreens/Home'
import Category from './app/src/screens/AppStackScreens/Category'
import CategoryDetail from './app/src/screens/AppStackScreens/CategoryDetail'
import ChatScreen from './app/src/screens/AppStackScreens/ChatScreen'
import Profile from './app/src/screens/AppStackScreens/Profile'
import Settings from './app/src/screens/AppStackScreens/Settings'
import Test from './app/src/screens/AppStackScreens/Test';
import PostDetail from './app/src/screens/AppStackScreens/PostDetail';
import LocationPicker from './app/service/LocationPicker';

//profile screens
import PersonalInfo from './app/src/screens/AppStackScreens/PersonalInfo'
import LegalInfo from './app/src/screens/AppStackScreens/Legalinfo'

// components
import Loading from './app/src/components/Loading';
import LogOut from './app/src/components/LogOut';
import AddPost from './app/src/components/AddPost';


//context 
import { AuthProvider, useAuth } from './app/src/context/AuthContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ChatContextProvider } from './app/src/context/ChatContext';
const Stack = createStackNavigator();
function CategoryStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}} >
      <Stack.Screen name="CategoryList" component={Category} />
      <Stack.Screen name="CategoryDetail" component={CategoryDetail} />
    </Stack.Navigator>
  );
}
const HomeStack = createStackNavigator();
function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{headerShown:false}}>
      <HomeStack.Screen name="HomeScreen" component={Home} />
      <HomeStack.Screen name="AddPost" component={AddPost} />
      <HomeStack.Screen name="PostDetail" component={PostDetail} />
    </HomeStack.Navigator>
  );
}
const ProfileStack = createStackNavigator();
function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={{headerShown:false}}>
      <ProfileStack.Screen name="ProfileScreen" component={Profile} />
      <ProfileStack.Screen name="PersonalInfo" component={PersonalInfo} />
      <ProfileStack.Screen name="LegalInfo" component={LegalInfo} />
    </ProfileStack.Navigator>
  );
}

const Drawer = createDrawerNavigator();
function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeStackScreen} />
      <Drawer.Screen name="Category" component={CategoryStack} />
      <Drawer.Screen name="ChatScreen" component={ChatScreen} />
      <Drawer.Screen name="Profile" component={ProfileStackScreen} />
      <Drawer.Screen name="Settings" component={Settings} />
      <Drawer.Screen name="Test" component={Test} />
      <Drawer.Screen name="LocationPicker" component={LocationPicker} />
      <Drawer.Screen name="LogOut" component={LogOut} />

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
      <>
        { currentUser ? 
        <DrawerNavigator /> :
        <AuthStackScreens />
        }
        </>
  );
}

export default function App() {
  return (
    <ChatContextProvider>
    <SafeAreaProvider>    
    <AuthProvider>
    <NavigationContainer>

    <Main />

    </NavigationContainer>
    </AuthProvider>
    </SafeAreaProvider>
    </ChatContextProvider>
  );
}
