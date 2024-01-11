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
import ContractorStack from './ContractorStack';
import { width } from '@fortawesome/free-solid-svg-icons/faSquareCheck';

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
      screenOptions={
        {
          drawerStyle: {
            width: 300,
          },
        }
      }

      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen 
      name="Home" 
      component={HomeStackScreen} 
      />
      <Drawer.Screen 
      name="Dashboard" 
      component={AdminStackScreen} 
      /> 
      <Drawer.Screen 
      name="Category" 
      component={CategoryStack} 
      />
      <Drawer.Screen 
      name="Messages" 
      component={ChatStackScreen} 
      />
      <Drawer.Screen 
      name="Profile" 
      component={ProfileStackScreen} 
      />
      <Drawer.Screen
        name="Contractor"
        component={ContractorStack}
      />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;