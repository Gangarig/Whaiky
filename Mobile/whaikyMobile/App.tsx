import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { UserProvider } from './app/context/UserContext';
import { useCurrentUser } from './app/context/UserContext';

//auth Screens
import LoginScreen from './app/screens/AuthStackScreens/LoginScreen';
import RegisterScreen from './app/screens/AuthStackScreens/RegisterScreen';
import WelcomeScreen from './app/screens/AuthStackScreens/WelcomeScreen';

//app Screens
import ProfileScreen from './app/screens/AppStackScreens/ProfileScreen';
import SettingsScreen from './app/screens/AppStackScreens/SettingsScreen';
import TransitionScreen from './app/screens/AppStackScreens/TransitionScreen';
import HomeScreen from './app/screens/AppStackScreens/HomeScreen';
import CompleteRegisterScreen from './app/screens/AppStackScreens/CompleteRegisterScreen';


const Stack = createNativeStackNavigator();

function AppNavigation() {
  const currentUser = useCurrentUser();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {currentUser ? (
          // App screens
          <>
            <Stack.Screen name="home" component={HomeScreen} />
            <Stack.Screen name="profile" component={ProfileScreen} />
            <Stack.Screen name="settings" component={SettingsScreen} />
            <Stack.Screen name="transition" component={TransitionScreen} />
            <Stack.Screen name="complete" component={CompleteRegisterScreen} />
            
          </>
        ) : (
          // Auth screens
          <>
            <Stack.Screen name="login" component={LoginScreen} />
            <Stack.Screen name="register" component={RegisterScreen} />
            <Stack.Screen name="welcome" component={WelcomeScreen} />

          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <UserProvider>
      <AppNavigation />
    </UserProvider>
  );
}