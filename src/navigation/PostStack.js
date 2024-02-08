import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/AppStackScreens/HomeScreens/Home';
import AddPost from '../screens/AppStackScreens/Post/AddPost';
import PostDetail from '../screens/AppStackScreens/Post/PostDetail';
import { Button } from 'react-native';
import { Icon } from 'react-native-elements';
import { DrawerActions } from '@react-navigation/native';
import PostSearch from '../screens/AppStackScreens/Post/PostSearch';
import StackHeader from './ScreenComponents/StackHeader';
import MyPosts from '../screens/AppStackScreens/Post/MyPosts';
import ContractorDetail from '../screens/AppStackScreens/ProfileScreens/Contractor/ContractorDetail';

const PostStack = createStackNavigator();
function PostStackScreen({ navigation}) {
  return (
    <PostStack.Navigator 
    screenOptions={
      {
        headerShown: true,
      }
    }
    >
        <PostStack.Screen
        name="MyPosts"
        component={MyPosts}
        options={({ navigation }) => ({
          headerShown: true,
          header: props => <StackHeader title="My Posts" navigation={navigation}  isHomeScreen={false} {...props} />,
        })}
        />
      <PostStack.Screen
      name="PostDetail"
      component={PostDetail} 
      options={
        ({navigation}) => ({
          header: (props) => <StackHeader title="Whaiky" navigation={navigation} isHomeScreen={false} {...props}  />,
        })
      }
       />
      <PostStack.Screen 
      name="SearchPost" 
      component={PostSearch}
      options={
        ({navigation}) => ({
          header: (props) => <StackHeader title="Whaiky" navigation={navigation} isHomeScreen={false} {...props}  />,
        })
      }
      />
      <PostStack.Screen 
      name="ContractorDetail" 
      component={ContractorDetail}
      options={
        ({navigation}) => ({
          header: (props) => <StackHeader title="Whaiky" navigation={navigation} isHomeScreen={false} {...props}  />,
        })
      }
      />


    </PostStack.Navigator>
  );
}

export default PostStackScreen;