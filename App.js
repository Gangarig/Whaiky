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
import {  faArrowRight, faArrowUp, faBars, faCamera, faCaretDown, faCaretLeft, faCaretRight, faCaretUp, faCheck, faChevronDown, faChevronUp, faDeleteLeft, faDesktop, faGear, faHouse, faIdCard, faImage, faList, faMagnifyingGlass, faMinus, faPaperPlane, faPaperclip, faTrash, faX } from '@fortawesome/free-solid-svg-icons'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ServiceCategory from './src/screens/AppStackScreens/ProfileScreens/Contractor/ServiceCategory';
import DocumentUpload from './src/screens/AppStackScreens/ProfileScreens/Contractor/DocumentUpload';
import Certificate from './src/screens/AppStackScreens/ProfileScreens/Contractor/Certificate';
import Test from './src/screens/Test';
import { faMessage } from '@fortawesome/free-regular-svg-icons/faMessage'
import { faAddressCard} from '@fortawesome/free-regular-svg-icons/faAddressCard'
import { faAddressBook,faCommentDots,faFileLines, faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { faUser } from '@fortawesome/free-regular-svg-icons/faUser';

library.add(
  fab, faAddressCard,faAddressBook,faFileLines,
  faSquareCheck,faMagnifyingGlass,faBars,
  faIdCard,faCaretLeft,
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
  faChevronDown,faChevronUp,
  faMagnifyingGlass,
  faCaretRight,faCaretUp,faCaretDown,
  faHouse,
  faIdCard,faDesktop,faCommentDots,faPenToSquare,
  faUser,faGear,faCheck
  );
export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>    
        <AuthProvider>
            <ChatContextProvider>
              <SafeAreaView style={{ flex: 1 }}>
                <NavigationContainer>
                  <Main />
                  {/* <Test /> */}
                  <FlashMessage position="top" style={{zIndex:9999}}/>
                </NavigationContainer>
              </SafeAreaView>
            </ChatContextProvider>
          </AuthProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
   
  );
}
