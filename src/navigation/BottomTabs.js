import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DrawerNavigator from './DrawerNavigator';
import ChatStackScreen from './ChatStack';
import HomeStackScreen from './HomeStack';
import ProfileStackScreen from './ProfileStack';
import Settings from '../screens/AppStackScreens/Settings';
import { Button } from 'react-native';
import { DrawerActions } from '@react-navigation/native';


const Tab = createBottomTabNavigator();

function BottomTabs({navigation}) {
  return (
    <Tab.Navigator 

      screenOptions={({ navigation }) => ({
        headerLeft: () => (
          <Button
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
            title="Menu" 
          />
        ),
        tabBarActiveTintColor: '#e91e63',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          shadowOffset: { width: 5, height: 3 },
          shadowColor: '#000',
          shadowOpacity: 0.5,
          elevation: 5,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackScreen} />
      <Tab.Screen name="Chat" component={ChatStackScreen} />
      <Tab.Screen name="Profile" component={ProfileStackScreen} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}

export default BottomTabs;