import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/AuthStackScreens/Login';
import SignUp from '../screens/AuthStackScreens/SignUp';
import ForgotPassword from '../screens/AuthStackScreens/ForgotPassword';
import Welcome from '../screens/AuthStackScreens/Welcome';


const AuthStack = createStackNavigator();
function AuthStackScreens() {
  return (
    <AuthStack.Navigator initialRouteName='welcome' screenOptions={{headerShown:false}}>
      <AuthStack.Screen name="welcome" component={Welcome} />
      <AuthStack.Screen name="login" component={Login} />
      <AuthStack.Screen name="signup" component={SignUp} />
      <AuthStack.Screen name="forgot" component={ForgotPassword} />
    </AuthStack.Navigator>
  );
}

export default AuthStackScreens;