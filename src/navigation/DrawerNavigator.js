import React, { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useAuth } from '../context/AuthContext';
import AdminStackScreen from './AdminStack';
import Settings from '../screens/AppStackScreens/Settings';
import CustomDrawerContent from './CustomDrawerItems';
import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';
import ContractorStack from './ContractorStack';
import StackHeader from './ScreenComponents/StackHeader';
import UserTheme from '../constant/Theme';
import BottomTabs from './BottomTabs';
import MyPosts from '../screens/AppStackScreens/MyPosts';

const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  const { currentUser } = useAuth();

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
        name="MyPosts"
        component={MyPosts}
        options={{
          headerShown: true,
          header: props => <StackHeader title="MyPosts"  isHomeScreen={false} {...props} />,
        }}
      />
      {currentUser && currentUser.status === 'admin' ? (
        <Drawer.Screen
          name="Dashboard"
          component={AdminStackScreen}
          options={{
            header: props => <StackHeader title="Dashboard" isHomeScreen={false} {...props} />,
          }}
        />
      ) : null}
      <Drawer.Screen
        name="Contractor"
        component={ContractorStack}
        options={{
          headerShown: true,
          header: props => <StackHeader title="Contractor" isHomeScreen={false} {...props} />,
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={{
          headerShown: true,
          header: props => <StackHeader title="Settings" isHomeScreen={false} {...props} />,
        }}
      />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;
