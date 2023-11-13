import React from "react";
import AuthStackScreens from "./AuthStack";
import { useAuth } from "../../app/src/context/AuthContext";


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