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
import {  faArrowRight, faArrowUp, faBars, faBolt, faCamera, faCar, faCaretDown, faCaretLeft, faCaretRight, faCaretUp, faCheck, faChevronDown, faChevronLeft, faChevronRight, faChevronUp, faClipboardList, faDeleteLeft, faDesktop, faDropletSlash, faEllipsisVertical, faEnvelopesBulk, faFire, faGear, faHouse, faIcons, faIdBadge, faIdCard, faImage, faLayerGroup, faList, faMagnifyingGlass, faMinus, faPaintRoller, faPaperPlane, faPaperclip, faPassport, faPerson, faScrewdriverWrench, faSeedling, faSprayCanSparkles, faSquareMinus, faTemperatureArrowUp, faTrash, faTruck, faUserGroup, faX } from '@fortawesome/free-solid-svg-icons'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Test from './src/screens/Test';
import { faMessage } from '@fortawesome/free-regular-svg-icons/faMessage'
import { faAddressCard} from '@fortawesome/free-regular-svg-icons/faAddressCard'
import { faAddressBook,faCommentDots,faFileLines, faPenToSquare ,faStar} from '@fortawesome/free-regular-svg-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { faUser } from '@fortawesome/free-regular-svg-icons/faUser';
import { ThemeProvider } from './src/context/ThemeContext';
import { MenuProvider } from 'react-native-popup-menu';
import PhoneInput from './src/components/PhoneInput';
library.add(
  fab, faAddressCard,faAddressBook,faFileLines,
  faSquareCheck,faMagnifyingGlass,faBars,
  faIdCard,faCaretLeft,faEllipsisVertical,
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
  faPassport,faIdBadge,faCar,faIdCard,faLayerGroup,
  faHouse,faFire,faBolt,faDropletSlash,faSeedling,faSprayCanSparkles,faPaintRoller,faTemperatureArrowUp,faTruck,faScrewdriverWrench,faPerson,faStar,
  faSquareMinus
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
              <SafeAreaView style={{ flex: 1 ,backgroundColor:'#3d3d3d'}}>
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


