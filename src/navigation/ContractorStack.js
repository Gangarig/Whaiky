import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Profile from "../screens/AppStackScreens/ProfileScreens/Profile";
import PersonalInfo from "../screens/AppStackScreens/ProfileScreens/PersonalInfo";
import ServiceCategory from "../screens/AppStackScreens/ServiceCategory";
import DocumentUpload from "../screens/AppStackScreens/service/DocumentUpload";
import Certificate from "../screens/AppStackScreens/service/Certificate";
import LegalInfo from "../screens/AppStackScreens/Legalinfo";
import Contractor from "../screens/AppStackScreens/service/Contractor";
import Complete from "../screens/AppStackScreens/service/Complete";


const ContractorStack = createStackNavigator();
function ContractorStackScreen() {
  return (
    <ContractorStack.Navigator screenOptions={{headerShown:false}}>
      <ContractorStack.Screen name="ContractorMain" component={Contractor} />
      <ContractorStack.Screen name="Services" component={ServiceCategory} />
      <ContractorStack.Screen name="DocumentUpload" component={DocumentUpload} />
      <ContractorStack.Screen name="Certificate" component={Certificate} />
      <ContractorStack.Screen name="LegalInfo" component={LegalInfo} />
      <ContractorStack.Screen name="Complete" component={Complete} />
    </ContractorStack.Navigator>
  );
}

export default ContractorStackScreen;