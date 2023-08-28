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
import CompleteRegisterScreen from './app/screens/AuthStackScreens/StageScreens/CompleteRegisterScreen';
import StageScreen1 from './app/screens/AuthStackScreens/StageScreens/StageScreen1';
import StageScreen2 from './app/screens/AuthStackScreens/StageScreens/StageScreen2';
import StageScreen3 from './app/screens/AuthStackScreens/StageScreens/StageScreen3';
import StageScreen4 from './app/screens/AuthStackScreens/StageScreens/StageScreen4';

//app Screens
import ProfileScreen from './app/screens/AppStackScreens/ProfileScreen';
import SettingsScreen from './app/screens/AppStackScreens/SettingsScreen';
import TransitionScreen from './app/screens/AuthStackScreens/TransitionScreen';


const stack = createNativeStackNavigator();
const appStack = createNativeStackNavigator();
const authStack = createNativeStackNavigator();

function AuthStackScreens() {
  return (
    <authStack.Navigator>
      <authStack.Screen name="login" component={LoginScreen} options={ {}}/>
      <authStack.Screen name="register" component={RegisterScreen} options={ {}}/>
      <authStack.Screen name="complete" component={CompleteRegisterScreen} options={ {}}/>
      <authStack.Screen name="welcome" component={WelcomeScreen} options={ {}}/>
      <authStack.Screen name="stage1" component={StageScreen1} options={ {}}/>
      <authStack.Screen name="stage2" component={StageScreen2} options={ {}}/>
      <authStack.Screen name="stage3" component={StageScreen3} options={ {}}/>
      <authStack.Screen name="stage4" component={StageScreen4} options={ {}}/>
    </authStack.Navigator>
  )
}
function AppStackScreens() {
  return (
    <appStack.Navigator>
      <appStack.Screen name="profile" component={ProfileScreen} options={ {}}/>
      <appStack.Screen name="settings" component={SettingsScreen} options={ {}}/>
      <appStack.Screen name="transition" component={TransitionScreen} options={ {}}/>
    </appStack.Navigator>
  )
}

export default function App() {
  const currentUser = useCurrentUser();

  return (
    <UserProvider>
      <NavigationContainer>
        <stack.Navigator>
          {currentUser ? (
                <stack.Screen name="Login" component={AppStackScreens} options={{headerShown:false}}/>
          ) : (
                <stack.Screen name="Login" component={AuthStackScreens} options={{headerShown:false}}/>
          )}
        </stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}