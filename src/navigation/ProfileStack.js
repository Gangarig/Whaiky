import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Profile from "../screens/AppStackScreens/ProfileScreens/Profile";
import PersonalInfo from "../screens/AppStackScreens/ProfileScreens/PersonalInfo";
import ServiceCategory from "../screens/AppStackScreens/ProfileScreens/ServiceCategory";
import DocumentUpload from "../screens/AppStackScreens/service/DocumentUpload";
import Certificate from "../screens/AppStackScreens/service/Certificate";
import LegalInfo from "../screens/AppStackScreens/ProfileScreens/Legalinfo";
import Contractor from "../screens/AppStackScreens/service/Contractor";
import Complete from "../screens/AppStackScreens/service/Complete";


const ProfileStack = createStackNavigator();
function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={{headerShown:false}}>
      <ProfileStack.Screen name="ProfileScreen" component={Profile} />
      <ProfileStack.Screen name="PersonalInfo" component={PersonalInfo} />
    </ProfileStack.Navigator>
  );
}

export default ProfileStackScreen;