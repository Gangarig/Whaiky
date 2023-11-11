import * as React from 'react';
import { useState , useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createStackNavigator } from '@react-navigation/stack';
import FlashMessage from "react-native-flash-message";
import { StyleSheet } from 'react-native';
import { Image } from 'react-native';
import defaultAvatar from './app/assets/images/avatar/avatar.png';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import LogoutButton from './app/src/components/LogOut';
import { Global } from './app/style/Global';
import { View } from 'react-native';
import cogs from './app/assets/icons/cogs.png';
import creditCard from './app/assets/icons/credit-card.png';
import owner from './app/assets/icons/owner.png';
import webforms from './app/assets/icons/webforms.png';




//auth screens
import Login from './app/src/screens/AuthStackScreens/Login'
import SignUp from './app/src/screens/AuthStackScreens/SignUp'
import ForgotPassword from './app/src/screens/AuthStackScreens/ForgotPassword'
import Welcome from './app/src/screens/AuthStackScreens/Welcome'


//app screens
import Home from './app/src/screens/AppStackScreens/Home'
import Category from './app/src/screens/AppStackScreens/Category'
import CategoryDetail from './app/src/screens/AppStackScreens/CategoryDetail'
import Profile from './app/src/screens/AppStackScreens/Profile'
import Settings from './app/src/screens/AppStackScreens/Settings'
import ServiceCategoryPicker from './app/service/ServiceCategoryPicker';
import PostDetail from './app/src/screens/AppStackScreens/PostDetail';
import LocationPicker from './app/service/LocationPicker';


//chat screens
import ChatScreen from './app/src/screens/AppStackScreens/ChatScreen'
import Chat from './app/src/components/chat/Chat'



//profile screens
import PersonalInfo from './app/src/screens/AppStackScreens/PersonalInfo'
import ServiceCategory from './app/src/screens/AppStackScreens/ServiceCategory'
import DocumentUpload from './app/service/DocumentUpload';
import Certificate from './app/service/Certificate';
import Contractor from './app/service/Contractor';
import LegalInfo from './app/src/screens/AppStackScreens/Legalinfo';
import Complete from './app/service/Complete'; 
import DashBoard from './app/src/screens/AppStackScreens/DashBoard';

// components
import Loading from './app/src/components/Loading';
import LogOut from './app/src/components/LogOut';
import AddPost from './app/src/components/AddPost';

//context 
import { AuthProvider, useAuth } from './app/src/context/AuthContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ChatContextProvider } from './app/src/context/ChatContext';
import { AccountStatus } from './app/src/context/AccountStatus';
import SubmissionDetail from './app/src/components/SubmissionDetail';


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

const AdminStack = createStackNavigator();
function AdminStackScreen() {
  return (
    <AdminStack.Navigator screenOptions={{headerShown:false}}>
      <AdminStack.Screen name="DashBoard" component={DashBoard} />
      <AdminStack.Screen name="SubmitDetail" component={SubmissionDetail} />
    </AdminStack.Navigator>
  );
}

const ProfileStack = createStackNavigator();
function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={{headerShown:false}}>
      <ProfileStack.Screen name="ProfileScreen" component={Profile} />
      <ProfileStack.Screen name="PersonalInfo" component={PersonalInfo} />
      <ProfileStack.Screen name="Services" component={ServiceCategory} />
      <ProfileStack.Screen name="DocumentUpload" component={DocumentUpload} />
      <ProfileStack.Screen name="Certificate" component={Certificate} />
      <ProfileStack.Screen name="LegalInfo" component={LegalInfo} />
      <ProfileStack.Screen name="Contractor" component={Contractor} />
      <ProfileStack.Screen name="Complete" component={Complete} />
    </ProfileStack.Navigator>
  );
}
const ChatStack = createStackNavigator();
function ChatStackScreen() {
  return (
    <ChatStack.Navigator screenOptions={{headerShown:false}}>
      <ChatStack.Screen name="ChatScreen" component={ChatScreen} />
      <ChatStack.Screen name="Chat" component={Chat} />
    </ChatStack.Navigator>
  );
}

function CustomDrawerContent(props) {
  const { currentUser } = useAuth();
  
  return (
    <DrawerContentScrollView {...props}>
      <View style={{height: '100%'}}> 
        <Image
          source={currentUser?.photoURL ? { uri: currentUser.photoURL } : defaultAvatar}
          style={styles.profileImage}
        />
        <DrawerItemList {...props} />
      </View>
      <View style={styles.logoutButton}>
        <LogoutButton />
      </View>
    </DrawerContentScrollView>
  );
}
const styles = StyleSheet.create({
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginVertical: 30,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  logoutButton: { 
    padding: 10,
    borderTopWidth: 1, 
    borderTopColor: '#ccc'
  },
});

const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  const {currentUser} = useAuth();
  const [userData, setUserData] = useState(null);
const [Dashboard, setDashBoard] = useState(false);

useEffect(() => {
  if (currentUser) {
    const unsubscribe = firestore()
      .collection('users')
      .doc(currentUser.uid)
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data());
        }
      }, error => {
        console.log('Error:', error);
        showMessage({
          message: 'Error fetching user data.',
          type: 'danger',
        });
      });

    // Remember to unsubscribe from your onSnapshot call when it's no longer needed
    return () => unsubscribe();
  }
}, [currentUser]);

useEffect(() => {
  if (userData && userData.status === 'admin') {
    setDashBoard(true);
  } else {
    setDashBoard(false);
  }
}, [userData]);



  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#fff',
          width: 250,
        },
        drawerLabelStyle: {
          fontSize: 20,
          height: 25,
        },
        drawerActiveBackgroundColor: '#9E42F0',
        drawerActiveTintColor: '#fff', 
      }}
    >

      <Drawer.Screen name="Home" component={HomeStackScreen} />
      {Dashboard ? <Drawer.Screen name="Dashboard" component={AdminStackScreen} /> : null}
      <Drawer.Screen name="Category" component={CategoryStack} />
      <Drawer.Screen name="Messages" component={ChatStackScreen} />
      <Drawer.Screen name="Profile" component={ProfileStackScreen} />
      <Drawer.Screen 
      name="Settings" 
      component={Settings} 
      />
    </Drawer.Navigator>
  );
}
const AuthStack = createStackNavigator();
function AuthStackScreens() {
  return (
    <AuthStack.Navigator initialRouteName='welcome' screenOptions={{headerShown:false}}>
      {/* <AuthStack.Screen name="welcome" component={Welcome} /> */}
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
    <AuthProvider>
    <ChatContextProvider>
    <NavigationContainer>
    <Main />
    <FlashMessage position="top" style={{zIndex:9999}}/>
    </NavigationContainer>
    </ChatContextProvider>
    </AuthProvider>
    </SafeAreaProvider>
   
  );
}

