import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CategoryStack from './CategoryStack';
import ChatStackScreen from './ChatStack';
import HomeStackScreen from './HomeStack';
import ProfileStackScreen from './ProfileStack';
import StackHeader from './ScreenComponents/StackHeader';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { shadowStyle } from '../constant/Shadow';
import AddPost from '../screens/AppStackScreens/Post/AddPost';
import { useTheme } from '../context/ThemeContext';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
const Tab = createBottomTabNavigator();

function BottomTabs({navigation}) {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.primary,
          height: 50,
          padding:0,
          paddingBottom:0,
          margin:0,
        },
        tabBarLabelStyle: {
          display: 'none',
        },
        tabBarActiveTintColor: theme.white,
        tabBarInactiveTintColor: theme.white,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'fa-solid fa-home' : 'fa-solid fa-home';
          } else if (route.name === 'Category') {
            iconName = focused ? 'fa-solid fa-list' : 'fa-solid fa-list';
          } else if (route.name === 'AddPost') {
            iconName = focused ? 'fa-regular fa-pen-to-square' : 'fa-regular fa-pen-to-square';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'fa-regular fa-comment-dots' : ' fa-regular fa-comment-dots';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'fa-regular fa-user' : 'fa-regular fa-user';
          }
          return (
          <View style={[styles.BottomTabsIcon, focused && styles.FocusedIcon]}>
            <FontAwesomeIcon icon={iconName} size={23} color={color} />
          </View>
          );
        }

      })}
    >
      <Tab.Screen
      name="Home"
      component={HomeStackScreen} 
      options={({navigation}) => ({
        header: (props) => <StackHeader title="Whaiky" navigation={navigation} isHomeScreen={true} {...props}  />,
      })}
      />
      <Tab.Screen
      name="Category"
      component={CategoryStack} 
      options={({navigation}) => ({
        header: (props) => <StackHeader title="Category" navigation={navigation} isHomeScreen={false} {...props}  />,
      })}
      />
      <Tab.Screen
      name="AddPost"
      component={AddPost}
      options={({navigation}) => ({
        headerShown: true,
        header: (props) => <StackHeader title="Add Post" navigation={navigation} isHomeScreen={false} {...props}  />,
      })}
      />
      <Tab.Screen
      name="Chat"
      component={ChatStackScreen} 
      options={({navigation}) => ({
        header: (props) => <StackHeader title="Chat" navigation={navigation} isHomeScreen={false} {...props}  />,
      })}
      />
      <Tab.Screen
      name="Profile"
      component={ProfileStackScreen} 
      options={({navigation}) => ({
        header: (props) => <StackHeader title="Profile" navigation={navigation} isHomeScreen={false} {...props}  />,
      })}
      />
    </Tab.Navigator>
  );
}

export default BottomTabs;

const getStyles = (theme) => StyleSheet.create({

  BottomTabsIcon: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  FocusedIcon: {
  borderBottomColor: theme.white,
  borderBottomWidth: 1,
  },

})
