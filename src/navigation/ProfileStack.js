import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Profile from "../screens/Profile";
import PersonalInfo from "../screens/PersonalInfo";
import ServiceCategory from "../screens/ServiceCategory";
import DocumentUpload from "../screens/DocumentUpload";
import Certificate from "../screens/Certificate";
import LegalInfo from "../screens/LegalInfo";
import Contractor from "../screens/Contractor";
import Complete from "../screens/Complete";




const ProfileStack = createStackNavigator();
function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={{headerShown:false}}>
      <ProfileStack.Screen name="ProfileScreen" component={Profile} />
      <ProfileStack.Screen name="PersonalInfo" component={PersonalInfo} />
      <ProfileStack.Screen name="Services" component={ServiceCategory} />
      <ProfileStack.Screen name="DocumentUpload" component={DocumentUpload} />
      <ProfileStack.Screen name="Certificate" component={Certificate} />
      <ProfileStack.Screen name="LegalInfo" component={LegalInfo} />
      <ProfileStack.Screen name="Contractor" component={Contractor} />
      <ProfileStack.Screen name="Complete" component={Complete} />
    </ProfileStack.Navigator>
  );
}

export default ProfileStackScreen;