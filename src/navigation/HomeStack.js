import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/AppStackScreens/HomeScreens/Home';
import AddPost from '../components/AddPost';
import PostDetail from '../screens/AppStackScreens/HomeScreens/PostDetail';
import { Button } from 'react-native';
import { Icon } from 'react-native-elements';
import { DrawerActions } from '@react-navigation/native';
import PostSearch from '../screens/AppStackScreens/HomeScreens/PostSearch';
import StackHeader from './ScreenComponents/StackHeader';


const HomeStack = createStackNavigator();
function HomeStackScreen({ navigation}) {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen 
      name="HomeScreen" 
      component={Home} 
      options={
        {
          header: (props) => <StackHeader title="Home" isHomeScreen={true} {...props}  />,
        }
      }
      />
      <HomeStack.Screen 
      name="AddPost" component={AddPost} 
      options={
        {
          header: (props) => <StackHeader title="Create Post" isHomeScreen={false} {...props}  />,
        }
      }
      />
      <HomeStack.Screen
      name="PostDetail"
      component={PostDetail} 
      options={
        {
        header: (props) => <StackHeader title="Post Detail" isHomeScreen={false} {...props}  />,
        }
        }
       />
      <HomeStack.Screen name="SearchPost" component={PostSearch}
      options={
        {
        header: (props) => <StackHeader title="Search" isHomeScreen={false} {...props}  />,
        }
        }
      />
    </HomeStack.Navigator>
  );
}

export default HomeStackScreen;