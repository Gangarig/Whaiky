import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/AppStackScreens/Home';
import AddPost from '../screens/AppStackScreens/components/AddPost';
import PostDetail from '../screens/AppStackScreens/PostDetail';
import DrawerNavigator from "./DrawerNavigator";
import { Button } from 'react-native';
import { Icon } from 'react-native-elements';
import { DrawerActions } from '@react-navigation/native';

const HomeStack = createStackNavigator();


function HomeStackScreen({ navigation}) {
  return (
    <HomeStack.Navigator screenOptions={{headerShown:false}}>
      <HomeStack.Screen name="HomeScreen" component={Home} />
      <HomeStack.Screen name="AddPost" component={AddPost} />
      <HomeStack.Screen name="PostDetail" component={PostDetail} />
    </HomeStack.Navigator>
  );
}

export default HomeStackScreen;