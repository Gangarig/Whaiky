import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Button } from 'react-native';
import { Icon } from 'react-native-elements';
import { DrawerActions } from '@react-navigation/native';
import Contractor from '../screens/AppStackScreens/ProfileScreens/Contractor/Contractor';
import Feedback from '../screens/AppStackScreens/ProfileScreens/Contractor/Feedback';
import ContractorDetail from '../screens/AppStackScreens/ProfileScreens/Contractor/ContractorDetail';
import StackHeader from './ScreenComponents/StackHeader';
import PostDetail from '../screens/AppStackScreens/Post/PostDetail';
import Reviews from '../screens/AppStackScreens/ProfileScreens/Contractor/Reviews';




const ContractorStack = createStackNavigator();
function ContractorStackScreen({ navigation}) {
  return (
    <ContractorStack.Navigator 
    screenOptions={
      {
        headerShown: true,
      }
    }
    >
      <ContractorStack.Screen 
      name="Contractor" 
      component={Contractor} 
      options={
        ({navigation}) => ({
          header: (props) => <StackHeader title="Contractors" navigation={navigation} isHomeScreen={true} {...props}  />,
        })
      }
      />
      <ContractorStack.Screen
      name="ContractorDetail"
      component={ContractorDetail} 
      options={
        ({navigation}) => ({
          header: (props) => <StackHeader title="Contractor Info " navigation={navigation} isHomeScreen={false} {...props}  />,
        })
      }
       />
      <ContractorStack.Screen
      name="PostDetail"
      component={PostDetail} 
      options={
        ({navigation}) => ({
          header: (props) => <StackHeader title="Whaiky" navigation={navigation} isHomeScreen={false} {...props}  />,
        })
      }
       />
    <ContractorStack.Screen
      name="FeedBack"
      component={Feedback} 
      options={
        ({navigation}) => ({
          header: (props) => <StackHeader title="FeedBack" navigation={navigation} isHomeScreen={false} {...props}  />,
        })
      }
      />

    </ContractorStack.Navigator>
  );
}

export default ContractorStackScreen;