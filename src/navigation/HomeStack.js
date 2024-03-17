import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/AppStackScreens/HomeScreens/Home';
import PostDetail from '../screens/AppStackScreens/Post/PostDetail';
import Search from '../screens/AppStackScreens/Search/Search';
import StackHeader from './ScreenComponents/StackHeader';
import Feedback from '../screens/AppStackScreens/ProfileScreens/Contractor/Feedback';
import ContractorDetail from '../screens/AppStackScreens/ProfileScreens/Contractor/ContractorDetail';
import Reviews from '../screens/AppStackScreens/ProfileScreens/Contractor/Reviews';
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
          header: (props) => <StackHeader title="Whaiky" navigation={navigation} isHomeScreen={true} {...props}  />,
        })
      }
      />
      <HomeStack.Screen
      name="PostDetail"
      component={PostDetail} 
      options={
        ({navigation}) => ({
          header: (props) => <StackHeader title="Whaiky" navigation={navigation} isHomeScreen={false} {...props}  />,
        })
      }
       />
      <HomeStack.Screen 
      name="Search" 
      component={Search}
      options={
        ({navigation}) => ({
          header: (props) => <StackHeader title="Whaiky" navigation={navigation} isHomeScreen={false} {...props}  />,
        })
      }
      />
      <HomeStack.Screen 
      name="ContractorDetail" 
      component={ContractorDetail}
      options={
        ({navigation}) => ({
          header: (props) => <StackHeader title="Whaiky" navigation={navigation} isHomeScreen={false} {...props}  />,
        })
      }
      />
      <HomeStack.Screen 
      name="FeedBack" 
      component={Feedback}
      options={
        ({navigation}) => ({
          header: (props) => <StackHeader title="Whaiky" navigation={navigation} isHomeScreen={false} {...props}  />,
        })
      }
      />
      <HomeStack.Screen
      name="Reviews"
      component={Reviews}
      options={
        ({navigation}) => ({
          header: (props) => <StackHeader title="Whaiky" navigation={navigation} isHomeScreen={false} {...props}  />,
        })
      }
      />

    </HomeStack.Navigator>
  );
}

export default HomeStackScreen;