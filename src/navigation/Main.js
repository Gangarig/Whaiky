import React from "react";
import AuthStackScreens from "./AuthStack";
import DrawerNavigator from "./DrawerNavigator";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";

function Main() {
    const { currentUser, setCurrentUser, loading } = useAuth();
  
    if (loading) {
      return <Loading />;
    }
  
    return (  
        <>
          { currentUser ? 
          <DrawerNavigator /> :
          <AuthStackScreens />
          }
        </>
    );
  }

  export default Main;