import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Profile from "../screens/AppStackScreens/ProfileScreens/Profile";
import PersonalInfo from "../screens/AppStackScreens/ProfileScreens/PersonalInfo";
import ServiceCategory from "../screens/AppStackScreens/ProfileScreens/Contractor/ServiceCategory";
import DocumentUpload from "../screens/AppStackScreens/ProfileScreens/Contractor/DocumentUpload";
import Certificate from "../screens/AppStackScreens/ProfileScreens/Contractor/Certificate";
import Support from "../screens/AppStackScreens/Support";
import StackHeader from "./ScreenComponents/StackHeader";
const ProfileStack = createStackNavigator();
function ProfileStackScreen({ navigation}) {
  return (
    <ProfileStack.Navigator screenOptions={{headerShown:true}}>
      <ProfileStack.Screen 
      name="ProfileScreen" 
      component={Profile} 
      options={
        ({navigation}) => ({
          header: (props) => <StackHeader title="Profile" navigation={navigation} isHomeScreen={false} {...props}  />,
        })
      }
      />
      <ProfileStack.Screen 
      name="PersonalInfo" 
      component={PersonalInfo} 
      options={
        ({navigation}) => ({
          header: (props) => <StackHeader title="Personal Info" navigation={navigation} isHomeScreen={false} {...props}  />,
        })
      }
      />
      <ProfileStack.Screen 
      name="Services" 
      component={ServiceCategory} 
      options={
        ({navigation}) => ({
          header: (props) => <StackHeader title="Services" navigation={navigation} isHomeScreen={false} {...props}  />,
        })
      }
      />
      <ProfileStack.Screen 
      name="DocumentUpload" 
      component={DocumentUpload} 
      options={
        ({navigation}) => ({
          header: (props) => <StackHeader title="Document Upload" navigation={navigation} isHomeScreen={false} {...props}  />,
        })
      }
      />
      <ProfileStack.Screen 
      name="Certificate" 
      component={Certificate} 
      options={
        ({navigation}) => ({
          header: (props) => <StackHeader title="Certificate" navigation={navigation} isHomeScreen={false} {...props}  />,
        })
      }
      />
      <ProfileStack.Screen 
      name="Support" 
      component={Support} 
      options={
        ({navigation}) => ({
          header: (props) => <StackHeader title="Support" navigation={navigation} isHomeScreen={false} {...props}  />,
        })
      }
      />
    </ProfileStack.Navigator>
  );
}

export default ProfileStackScreen;