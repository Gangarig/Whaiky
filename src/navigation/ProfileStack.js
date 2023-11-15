import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Profile from "../screens/AppStackScreens/Profile";
import PersonalInfo from "../screens/AppStackScreens/PersonalInfo";
import ServiceCategory from "../screens/AppStackScreens/ServiceCategory";
import DocumentUpload from "../screens/AppStackScreens/service/DocumentUpload";
import Certificate from "../screens/AppStackScreens/service/Certificate";
import LegalInfo from "../screens/AppStackScreens/Legalinfo";
import Contractor from "../screens/AppStackScreens/service/Contractor";
import Complete from "../screens/AppStackScreens/service/Complete";


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