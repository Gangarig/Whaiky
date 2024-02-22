import React from "react";
import AuthStackScreens from "./AuthStack";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";
import { View, StyleSheet } from "react-native";
import BottomTabs from "./BottomTabs";

function Main() {
    const { currentUser, loading } = useAuth();
    if (loading) {
      return <Loading />;
    }
    return (  
        <>
          { currentUser ?
            <View style={style.appContent}>
              <BottomTabs />
            </View>
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