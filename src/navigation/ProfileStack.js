import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Profile from "../screens/AppStackScreens/ProfileScreens/Profile";
import PersonalInfo from "../screens/AppStackScreens/ProfileScreens/PersonalInfo";
import ServiceCategory from "../screens/AppStackScreens/ProfileScreens/Contractor/ServiceCategory";
import DocumentUpload from "../screens/AppStackScreens/ProfileScreens/Contractor/DocumentUpload";
import Certificate from "../screens/AppStackScreens/ProfileScreens/Contractor/Certificate";

const ProfileStack = createStackNavigator();
function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={{headerShown:false}}>
      <ProfileStack.Screen name="ProfileScreen" component={Profile} />
      <ProfileStack.Screen name="PersonalInfo" component={PersonalInfo} />
      <ProfileStack.Screen name="Services" component={ServiceCategory} />
      <ProfileStack.Screen name="DocumentUpload" component={DocumentUpload} />
      <ProfileStack.Screen name="Certificate" component={Certificate} />
    </ProfileStack.Navigator>
  );
}

export default ProfileStackScreen;