import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/AppStackScreens/Home';
import AddPost from '../screens/AppStackScreens/components/AddPost';
import PostDetail from '../screens/AppStackScreens/PostDetail';

const HomeStack = createStackNavigator();
function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{headerShown:false}}>
      <HomeStack.Screen name="HomeScreen" component={Home} />
      <HomeStack.Screen name="AddPost" component={AddPost} />
      <HomeStack.Screen name="PostDetail" component={PostDetail} />
    </HomeStack.Navigator>
  );
}

export default HomeStackScreen;