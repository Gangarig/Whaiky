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



// components
import Loading from './app/src/components/Loading';
import LogOut from './app/src/components/LogOut';
import CountryStateCity from './app/src/components/CountryStateCity';
import PhoneInputComponent from './app/src/components/PhoneInputComponent';

//context 
import { AuthProvider, useAuth } from './app/src/context/AuthContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Stack = createStackNavigator();
function CategoryStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}} >
      <Stack.Screen name="CategoryList" component={Category} />
      <Stack.Screen name="CategoryDetail" component={CategoryDetail} />
    </Stack.Navigator>
  );
}

const Drawer = createDrawerNavigator();
function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Category" component={CategoryStack} />
      <Drawer.Screen name="ChatScreen" component={ChatScreen} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="Settings" component={Settings} />
      <Drawer.Screen name="CountryStateCity" component={CountryStateCity}/>
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
    <SafeAreaProvider>
    <NavigationContainer>
    <AuthProvider>
    <Main />
    </AuthProvider>
    </NavigationContainer>
    </SafeAreaProvider>
  );
}
