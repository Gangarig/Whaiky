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
import {  faArrowRight, faArrowUp, faCamera, faCaretRight, faChevronDown, faDeleteLeft, faDesktop, faHouse, faIdCard, faImage, faList, faMagnifyingGlass, faMinus, faPaperPlane, faPaperclip, faPenToSquare, faTrash, faX } from '@fortawesome/free-solid-svg-icons'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ServiceCategory from './src/screens/AppStackScreens/ProfileScreens/Contractor/ServiceCategory';
import DocumentUpload from './src/screens/AppStackScreens/ProfileScreens/Contractor/DocumentUpload';
import Certificate from './src/screens/AppStackScreens/ProfileScreens/Contractor/Certificate';
import Test from './src/screens/Test';
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faMessage } from '@fortawesome/free-regular-svg-icons/faMessage'
import { faAddressCard } from '@fortawesome/free-regular-svg-icons/faAddressCard'
import { faAddressBook,faFileLines } from '@fortawesome/free-regular-svg-icons';

library.add(
  fab, faAddressCard,faAddressBook,faFileLines,
  faSquareCheck ,
  faPenToSquare,
  faIdCard,
  faCamera,faMessage,
  faMinus,
  faMagnifyingGlass,
  faPaperPlane,faList,
  faArrowUp,
  faArrowRight,
  faImage,
  faX,
  faPaperclip,
  faTrash,
  faDeleteLeft,
  faChevronDown,
  faMagnifyingGlass,
  faCaretRight,
  faHouse,
  faUser,
  faIdCard,faDesktop
  )




export default function App() {
  return (
    <SafeAreaProvider>
    <GestureHandlerRootView style={{ flex: 1 }}>    
    <AuthProvider>
    <ChatContextProvider>
    <NavigationContainer>
    <Main />
    {/* <Test /> */}
    <FlashMessage position="top" style={{zIndex:9999}}/>
    </NavigationContainer>
    </ChatContextProvider>
    </AuthProvider>
    </GestureHandlerRootView>
    </SafeAreaProvider>
   
  );
}
