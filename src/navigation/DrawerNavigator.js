import React, {useEffect, useState} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {useAuth} from '../context/AuthContext';
import AdminStackScreen from './AdminStack';
import HomeStackScreen from './HomeStack';
import ProfileStackScreen from './ProfileStack';
import ChatStackScreen from './ChatStack';
import Settings from '../screens/AppStackScreens/Settings';
import CustomDrawerContent from './CustomDrawerItems';
import CategoryStack from './CategoryStack';
import firestore from '@react-native-firebase/firestore';
import {showMessage} from 'react-native-flash-message';
import SVGIcons from '../constant/SVGIcons';
import { shadowStyle } from '../constant/Shadow';
import { Global } from '../constant/Global';
import LinearGradient from 'react-native-linear-gradient';
import ContractorStack from './ContractorStack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import LegalInfo from '../screens/AppStackScreens/ProfileScreens/Contractor/LegalInfo';
import ServiceCategory from '../screens/AppStackScreens/ProfileScreens/Contractor/ServiceCategory';
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  const {currentUser} = useAuth();
  const [userData, setUserData] = useState(null);
  const [Dashboard, setDashBoard] = useState(false);

useEffect(() => {
  if (currentUser) {
    const unsubscribe = firestore()
      .collection('users')
      .doc(currentUser.uid)
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data());
        }
      }, error => {
        console.log('Error:', error);
        showMessage({
          message: 'Error fetching user data.',
          type: 'danger',
        });
      });
    return () => unsubscribe();
  }
}, [currentUser]);

useEffect(() => {
  if (userData && userData.status === 'admin') {
    setDashBoard(true);
  } else {
    setDashBoard(false);
  }
}, [userData]);



  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#FBFBFB',
          width: 220,
        },
        drawerInactiveTintColor: '#696969',
        drawerInactiveBackgroundColor: '#FBFBFB',
        drawerActiveBackgroundColor: '#7B5BDC',
        drawerActiveTintColor: '#fff',
        headerTintColor: '#9E42F0',
        headerStyle: {
          backgroundColor: '#fff',
        },
    
      }}
    >
      <Drawer.Screen 
      name="Home" 
      component={HomeStackScreen} 
      />
      
      {Dashboard ? <Drawer.Screen 
      name="Dashboard" 
      component={AdminStackScreen} 
            options={{
      }}
      /> : null}

      <Drawer.Screen 
      name="Category" 
      component={CategoryStack} 
            options={{

      }}
      />
      <Drawer.Screen 
      name="Messages" 
      component={ChatStackScreen} 
            options={{
      }}
      />
      <Drawer.Screen 
      name="Profile" 
      component={ProfileStackScreen} 
      options={{
      }}
      />


      { userData && userData.status === 'contractor' ?
      <>
            <Drawer.Screen 
            name="Legal Information" 
            component={LegalInfo} 
            options={{
            }}
            />
            <Drawer.Screen 
            name="Service Categories" 
            component={ServiceCategory} 
            options={{
            }}
            />
      </>
      : null}

      {/* <Drawer.Screen 
      name="Settings" 
      component={Settings} 
      options={{
      }}
      /> */}
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;