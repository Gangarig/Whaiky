import React, {useEffect, useState} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import firestore from '@react-native-firebase/firestore';
import {showMessage} from 'react-native-flash-message';
import {useAuth} from '../context/AuthContext';
import CustomDrawerItems from './CustomDrawerItems';
import HomeStack from './HomeStack';
import AdminStack from './AdminStack';
import CategoryStack from './CategoryStack';
import ChatStack from './ChatStack';
import ProfileStack from './ProfileStack';
import Settings from '../screens/AppStackScreens/Settings';

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
      drawerContent={(props) => <CustomDrawerItems {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#fff',
          width: 250,
        },
        drawerLabelStyle: {
          fontSize: 20,
          height: 25,
        },
        drawerActiveBackgroundColor: '#9E42F0',
        drawerActiveTintColor: '#fff', 
      }}
    >

      <Drawer.Screen name="Home" component={HomeStack} />
      {Dashboard ? <Drawer.Screen name="Dashboard" component={AdminStack} /> : null}
      <Drawer.Screen name="Category" component={CategoryStack} />
      <Drawer.Screen name="Messages" component={ChatStack} />
      <Drawer.Screen name="Profile" component={ProfileStack} />
      <Drawer.Screen 
      name="Settings" 
      component={Settings} 
      />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;