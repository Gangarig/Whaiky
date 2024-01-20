import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CategoryStack from './CategoryStack';
import ChatStackScreen from './ChatStack';
import HomeStackScreen from './HomeStack';
import ProfileStackScreen from './ProfileStack';
import StackHeader from './ScreenComponents/StackHeader';
import UserTheme from '../constant/Theme';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { shadowStyle } from '../constant/Shadow';
import AddPost from '../screens/AppStackScreens/Post/AddPost';
import { View ,StyleSheet} from 'react-native';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
const Tab = createBottomTabNavigator();

function BottomTabs({navigation}) {

  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: 55,
          backgroundColor: UserTheme.primary,
          ...shadowStyle,
        },
        tabBarLabelStyle: {
          display: 'none',
        },
        tabBarActiveTintColor: UserTheme.white,
        tabBarInactiveTintColor: UserTheme.white,
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
        header: (props) => <StackHeader title="Whaiky" navigation={navigation} isHomeScreen={false} {...props}  />,
      })}
      />
      <Tab.Screen
      name="AddPost"
      component={AddPost}
      options={({navigation}) => ({
        headerShown: true,
        header: (props) => <StackHeader title="Whaiky" navigation={navigation} isHomeScreen={false} {...props}  />,
      })}
      />
      <Tab.Screen
      name="Chat"
      component={ChatStackScreen} 
      options={({navigation}) => ({
        header: (props) => <StackHeader title="Whaiky" navigation={navigation} isHomeScreen={false} {...props}  />,
      })}
      />
      <Tab.Screen
      name="Profile"
      component={ProfileStackScreen} 
      options={({navigation}) => ({
        header: (props) => <StackHeader title="Whaiky" navigation={navigation} isHomeScreen={false} {...props}  />,
      })}
      />
    </Tab.Navigator>
  );
}

export default BottomTabs;

const styles = StyleSheet.create({
  BottomTabsIcon: {
    paddingBottom: 5,
  },
  FocusedIcon: {
    borderBottomColor: UserTheme.white,
    borderBottomWidth: 2,
  },
});