import React from "react";
import AuthStackScreens from "./AuthStack";
import DrawerNavigator from "./DrawerNavigator";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";
import { View, StyleSheet } from "react-native";

function Main() {
    const { currentUser, setCurrentUser, loading } = useAuth();
  
    if (loading) {
      return <Loading />;
    }
  
    return (  
        <>
          { currentUser ?
            <DrawerNavigator style={style.appContent}/>

          :
          <AuthStackScreens />
          }
        </>
    );
  }

  export default Main;

  const style = StyleSheet.create({
    appWrapper:{
      flex:1,
    },
    appContent:{
      flex:1,
    },
    appFooter:{
      flex:1,
    }
  })