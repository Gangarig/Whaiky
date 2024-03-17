import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DashBoard from "../screens/AppStackScreens/AdminScreens/DashBoard";
import SubmissionDetail from "../screens/AppStackScreens/AdminScreens/SubmissionDetail";
import StackHeader from "./ScreenComponents/StackHeader";
import Inbox from "../screens/AppStackScreens/AdminScreens/Inbox";

const AdminStack = createStackNavigator();
function AdminStackScreen() {
  return (
    <AdminStack.Navigator >
      <AdminStack.Screen 
      name="DashBoard"
      component={DashBoard}
      options={{
        header: props => <StackHeader title="Contractor" isHomeScreen={false} {...props} />,
      }}
      />
      <AdminStack.Screen
      name="SubmitDetail"
      component={SubmissionDetail}
      options={{
        header: props => <StackHeader title="Submission" isHomeScreen={false} {...props} />,
      }}
      />
      <AdminStack.Screen
      name="Inbox"
      component={Inbox}
      options={{
        header: props => <StackHeader title="Inbox" isHomeScreen={false} {...props} />,
      }}
      />

    </AdminStack.Navigator>
  );
}

export default AdminStackScreen;