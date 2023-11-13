import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FlashMessage from "react-native-flash-message";
import Main from './src/navigation/Main';
import { AuthProvider } from './src/context/AuthContext';
import { ChatContextProvider } from './src/context/ChatContext';


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
