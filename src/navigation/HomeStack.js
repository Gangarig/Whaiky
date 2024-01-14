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
    <HomeStack.Navigator 
    screenOptions={
      {
        headerShown: true,
      }
    }
    >
      <HomeStack.Screen 
      name="HomeScreen" 
      component={Home} 
      options={
        ({navigation}) => ({
          header: (props) => <StackHeader title="Home" navigation={navigation} isHomeScreen={true} {...props}  />,
        })
      }
      />
      {/* <HomeStack.Screen 
      name="AddPost" component={AddPost} 
      options={
        ({navigation}) => ({
          header: (props) => <StackHeader title="Add Post" navigation={navigation} isHomeScreen={false} {...props}  />,
        })
      }
      /> */}
      <HomeStack.Screen
      name="PostDetail"
      component={PostDetail} 
      options={
        ({navigation}) => ({
          header: (props) => <StackHeader title="Post Detail" navigation={navigation} isHomeScreen={false} {...props}  />,
        })
      }
       />
      <HomeStack.Screen 
      name="SearchPost" 
      component={PostSearch}
      options={
        ({navigation}) => ({
          header: (props) => <StackHeader title="Search Post" navigation={navigation} isHomeScreen={false} {...props}  />,
        })
      }
      />
    </HomeStack.Navigator>
  );
}

export default HomeStackScreen;