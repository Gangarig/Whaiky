import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Category from "../screens/Category";

const Stack = createStackNavigator();
function CategoryStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}} >
      <Stack.Screen name="CategoryList" component={Category} />
      <Stack.Screen name="CategoryDetail" component={CategoryDetail} />
    </Stack.Navigator>
  );
}
export default CategoryStack;