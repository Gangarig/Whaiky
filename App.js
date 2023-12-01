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
import { faArrowRight, faArrowUp, faCamera, faIdCard, faImage, faMagnifyingGlass, faMinus, faPaperPlane, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { GestureHandlerRootView } from 'react-native-gesture-handler';


library.add(
  fab, 
  faSquareCheck ,
  faPenToSquare,
  faIdCard,
  faCamera,
  faMinus,
  faMagnifyingGlass,
  faPaperPlane,
  faArrowUp,
  faArrowRight,
  faImage
  )



export default function App() {
  return (
    <SafeAreaProvider>
    <GestureHandlerRootView style={{ flex: 1 }}>    
    <AuthProvider>
    <ChatContextProvider>
    <NavigationContainer>
    <Main />
    <FlashMessage position="top" style={{zIndex:9999}}/>
    </NavigationContainer>
    </ChatContextProvider>
    </AuthProvider>
    </GestureHandlerRootView>
    </SafeAreaProvider>
   
  );
}
