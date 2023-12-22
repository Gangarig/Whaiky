import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Profile from "../screens/AppStackScreens/ProfileScreens/Profile";
import PersonalInfo from "../screens/AppStackScreens/ProfileScreens/PersonalInfo";
import ServiceCategory from "../screens/AppStackScreens/ProfileScreens/Contractor/ServiceCategory";
import DocumentUpload from "../screens/AppStackScreens/ProfileScreens/Contractor/DocumentUpload";
import Certificate from "../screens/AppStackScreens/ProfileScreens/Contractor/Certificate";
import LegalInfo from "../screens/AppStackScreens/ProfileScreens/Contractor/LegalInfo";
import Contractor from "../screens/AppStackScreens/ProfileScreens/Contractor/Contractor";


const ContractorStack = createStackNavigator();
function ContractorStackScreen() {
  return (
    <ContractorStack.Navigator screenOptions={{headerShown:false}}>
      <ContractorStack.Screen name="ContractorMain" component={Contractor} />
      <ContractorStack.Screen name="Services" component={ServiceCategory} />
      <ContractorStack.Screen name="DocumentUpload" component={DocumentUpload} />
      <ContractorStack.Screen name="Certificate" component={Certificate} />
      <ContractorStack.Screen name="LegalInfo" component={LegalInfo} />
    </ContractorStack.Navigator>
  );
}

export default ContractorStackScreen;