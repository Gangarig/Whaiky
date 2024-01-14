import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Category from "../screens/AppStackScreens/CategoryScreens/Category";
import CategoryDetail from "../screens/AppStackScreens/CategoryScreens/CategoryDetail";
import StackHeader from "./ScreenComponents/StackHeader";
const Stack = createStackNavigator();
function CategoryStack({ navigation}) {
  return (
    <Stack.Navigator screenOptions={{headerShown:true}} >
      <Stack.Screen 
      name="CategoryList" 
      component={Category} 
      options={
        ({navigation}) => ({
          header: (props) => <StackHeader title="Category" navigation={navigation} isHomeScreen={false} {...props}  />,
        })
      }
      />

      <Stack.Screen 
      name="CategoryDetail" 
      component={CategoryDetail} 
      options={
        ({navigation}) => ({
          header: (props) => <StackHeader title="Category Detail" navigation={navigation} isHomeScreen={false} {...props}  />,
        })
      }
      />
    </Stack.Navigator>
  );
}
export default CategoryStack;