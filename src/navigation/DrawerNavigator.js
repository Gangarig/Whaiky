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
import Test from '../screens/Test';
import ContractorStack from './ContractorStack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
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
          backgroundColor: '#fff',
          width: 220,
        },
        drawerLabelStyle: {
          fontSize: 20,
          height: 25,
          ...Global.titleSecondary,
          color: '',
        },
        drawerInactiveTintColor: '#fff',
        drawerInactiveBackgroundColor: '#9E42F0',
        drawerActiveBackgroundColor: '#B57DFF',
        drawerActiveTintColor: 'black',
        headerTintColor: '#9E42F0',
        headerStyle: {
          backgroundColor: '#fff',
        },
    
      }}
    >
      {/* <Drawer.Screen 
      name="Test" 
      component={Test} 
      options={{

      }}
      /> */}

      <Drawer.Screen 
      name="Home" 
      component={HomeStackScreen} 
      />
      <Drawer.Screen 
      name="Contractor" 
      component={ContractorStack} 
      options={{

      }}
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
      <Drawer.Screen 

      name="Settings" 
      component={Settings} 
      options={{

      }}
      />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;