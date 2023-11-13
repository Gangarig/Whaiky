import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DashBoard from "../screens/AppStackScreens/DashBoard";
import SubmissionDetail from "../screens/AppStackScreens/SubmissionDetail";

const AdminStack = createStackNavigator();
function AdminStackScreen() {
  return (
    <AdminStack.Navigator screenOptions={{headerShown:false}}>
      <AdminStack.Screen name="DashBoard" component={DashBoard} />
      <AdminStack.Screen name="SubmitDetail" component={SubmissionDetail} />
    </AdminStack.Navigator>
  );
}

export default AdminStackScreen;