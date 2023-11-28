import React from "react";
import AuthStackScreens from "./AuthStack";
import DrawerNavigator from "./DrawerNavigator";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";
import PersonalInfo from "../screens/AppStackScreens/ProfileScreens/PersonalInfo";
import Test from "../screens/Test";
function Main() {
    const { currentUser, setCurrentUser, loading } = useAuth();
  
    if (loading) {
      return <Loading />;
    }
  
    return (  
        <>
          { currentUser ?
          <>
          <DrawerNavigator />
          {/* <PersonalInfo />
          <Test/> */}
          </>
          :
          <AuthStackScreens />
          }
        </>
    );
  }

  export default Main;