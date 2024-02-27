import * as React from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FlashMessage from "react-native-flash-message";
import Main from './src/navigation/Main';
import { AuthProvider } from './src/context/AuthContext';
import { ChatContextProvider } from './src/context/ChatContext';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faSquareCheck } from '@fortawesome/free-solid-svg-icons/faSquareCheck'
import {  faArrowRight, faArrowUp, faBars, faCamera, faCar, faCaretDown, faCaretLeft, faCaretRight, faCaretUp, faCheck, faChevronDown, faChevronLeft, faChevronRight, faChevronUp, faClipboardList, faDeleteLeft, faDesktop, faEnvelopesBulk, faGear, faHouse, faIcons, faIdBadge, faIdCard, faImage, faList, faMagnifyingGlass, faMinus, faPaperPlane, faPaperclip, faPassport, faTrash, faUserGroup, faX  } from '@fortawesome/free-solid-svg-icons'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Test from './src/screens/Test';
import { faMessage } from '@fortawesome/free-regular-svg-icons/faMessage'
import { faAddressCard} from '@fortawesome/free-regular-svg-icons/faAddressCard'
import { faAddressBook,faCommentDots,faFileLines, faPenToSquare , faStar ,} from '@fortawesome/free-regular-svg-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { faUser } from '@fortawesome/free-regular-svg-icons/faUser';
import { ThemeProvider } from './src/context/ThemeContext';
import { MenuProvider } from 'react-native-popup-menu';
import ProfileStackBar from './src/screens/AppStackScreens/ProfileScreens/ProfileStackBar';
import TwoSelectButton from './src/components/Buttons/TwoSelectButton';
import DatePickerComponent from './src/components/DatePicker';
import DocumentUpload from './src/screens/AppStackScreens/ProfileScreens/Contractor/DocumentUpload';
import PersonalInfo from './src/screens/AppStackScreens/ProfileScreens/PersonalInfo';
import Feedback from './src/screens/AppStackScreens/ProfileScreens/Contractor/Feedback';
import Certificate from './src/screens/AppStackScreens/ProfileScreens/Contractor/Certificate';
import LegalInfo from './src/screens/AppStackScreens/ProfileScreens/Contractor/LegalInfo';
import ServiceButton from './src/components/Buttons/ServiceButton';
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
  faChevronLeft,faChevronRight,
  faMagnifyingGlass,
  faCaretRight,faCaretUp,faCaretDown,
  faHouse,
  faIdCard,faDesktop,faCommentDots,faPenToSquare,
  faUser,faGear,faCheck,faX,faIdCard,faEnvelopesBulk,
  faImage,faIcons,faClipboardList,faUserGroup,faStar,
  faPassport,faIdBadge,faCar,faIdCard
  );

  LogBox.ignoreLogs([
    'View # of type RCTView has a shadow set',
    "Sending `onAnimatedValueUpdate` with no listeners registered."
  ]);

export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}> 
        <AuthProvider>
        <ThemeProvider>   
            <ChatContextProvider>
              <FlashMessage position="top" style={{zIndex:9999}}/>
              <SafeAreaView style={{ flex: 1 }}>
                <NavigationContainer> 
                  <MenuProvider>               
                    <Main />

                  </MenuProvider>
                </NavigationContainer>
              </SafeAreaView>
            </ChatContextProvider>
            </ThemeProvider>
          </AuthProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
   
  );
}


