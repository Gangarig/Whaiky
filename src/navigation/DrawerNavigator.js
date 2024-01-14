import React, { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useAuth } from '../context/AuthContext';
import AdminStackScreen from './AdminStack';
import HomeStackScreen from './HomeStack';
import ProfileStackScreen from './ProfileStack';
import ChatStackScreen from './ChatStack';
import Settings from '../screens/AppStackScreens/Settings';
import CustomDrawerContent from './CustomDrawerItems';
import CategoryStack from './CategoryStack';
import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';
import ContractorStack from './ContractorStack';
import StackHeader from './ScreenComponents/StackHeader';
import UserTheme from '../constant/Theme';
import BottomTabs from './BottomTabs';

const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  const { currentUser } = useAuth();
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
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: 250,
          borderRightColor: UserTheme.black,
          borderRightWidth: 1,
        },
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="BottomTabs"
        component={BottomTabs}
        options={({ navigation }) => ({
          header: props => <StackHeader title="BottomTabs" navigation={navigation} isHomeScreen={true} {...props} />,
        })
        }
      />
      <Drawer.Screen
        name="Dashboard"
        component={AdminStackScreen}
        options={{
          header: props => <StackHeader title="Dashboard" isHomeScreen={false} {...props} />,
        }}
      />
      <Drawer.Screen
        name="Contractor"
        component={ContractorStack}
        options={{
          header: props => <StackHeader title="Contractor" isHomeScreen={false} {...props} />,
        }}
      />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;
