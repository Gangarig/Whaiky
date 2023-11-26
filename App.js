import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FlashMessage from "react-native-flash-message";
import Main from './src/navigation/Main';
import { AuthProvider } from './src/context/AuthContext';
import { ChatContextProvider } from './src/context/ChatContext';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faSquareCheck } from '@fortawesome/free-solid-svg-icons/faSquareCheck'
import { faIdCard, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import Test from './src/screens/Test';

library.add(fab, faSquareCheck , faPenToSquare,faIdCard)



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
