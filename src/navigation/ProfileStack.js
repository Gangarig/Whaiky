import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Profile from "../screens/AppStackScreens/ProfileScreens/Profile";
import PersonalInfo from "../screens/AppStackScreens/ProfileScreens/PersonalInfo";
import ServiceCategory from "../screens/AppStackScreens/ProfileScreens/Contractor/ServiceCategory";
import DocumentUpload from "../screens/AppStackScreens/ProfileScreens/Contractor/DocumentUpload";
import Certificate from "../screens/AppStackScreens/ProfileScreens/Contractor/Certificate";
import Support from "../screens/AppStackScreens/Support";
import StackHeader from "./ScreenComponents/StackHeader";
import ProfileStackBar from "../screens/AppStackScreens/ProfileScreens/ProfileStackBar";
import Marklist from "../screens/AppStackScreens/ProfileScreens/Marklist";
import MyPosts from "../screens/AppStackScreens/Post/MyPosts";
import Contractor from "../screens/AppStackScreens/ProfileScreens/Contractor/Contractor";
import Reviews from "../screens/AppStackScreens/ProfileScreens/Contractor/Reviews";
import Feedback from "../screens/AppStackScreens/ProfileScreens/Contractor/Feedback";
import ContractorDetail from "../screens/AppStackScreens/ProfileScreens/Contractor/ContractorDetail";
import DashBoard from "../screens/AppStackScreens/AdminScreens/DashBoard";
import SubmissionDetail from "../screens/AppStackScreens/AdminScreens/SubmissionDetail";
import LegalInfo from "../screens/AppStackScreens/ProfileScreens/Contractor/LegalInfo";
import PostDetail from "../screens/AppStackScreens/Post/PostDetail";
import Inbox from "../screens/AppStackScreens/AdminScreens/Inbox";
const ProfileStack = createStackNavigator();

function ProfileStackScreen({ navigation }) {
  return (
    <ProfileStack.Navigator screenOptions={{headerShown: true}}>
      <ProfileStack.Screen 
        name="ProfileStackBar" 
        component={ProfileStackBar} 
        options={{
          headerShown: false,
        }}
      />
      <ProfileStack.Screen 
        name="ProfileScreen" 
        component={Profile} 
        options={({navigation}) => ({
          header: (props) => <StackHeader title="Profile" navigation={navigation} isHomeScreen={false} {...props} />,
        })}
      />
      <ProfileStack.Screen 
        name="Dashboard" 
        component={DashBoard} 
        options={({navigation}) => ({
          header: (props) => <StackHeader title="Dashboard" navigation={navigation} isHomeScreen={false} {...props} />,
        })}
      />
      <ProfileStack.Screen
        name="SubmitDetail"
        component={SubmissionDetail}
        options={({ navigation }) => ({
          header: (props) => <StackHeader title="Submission Detail" navigation={navigation} isHomeScreen={false} {...props} />,
        })}
      />
      <ProfileStack.Screen
        name="Inbox"
        component={Inbox}
        options={({ navigation }) => ({
          header: (props) => <StackHeader title="Inbox" navigation={navigation} isHomeScreen={false} {...props} />,
        })}
      />
      <ProfileStack.Screen 
        name="PersonalInfo" 
        component={PersonalInfo} 
        options={({navigation}) => ({
          header: (props) => <StackHeader title="Personal Info" navigation={navigation} isHomeScreen={false} {...props} />,
        })}
      />
      <ProfileStack.Screen 
        name="Services" 
        component={ServiceCategory} 
        options={({navigation}) => ({
          header: (props) => <StackHeader title="Services" navigation={navigation} isHomeScreen={false} {...props} />,
        })}
      />
      <ProfileStack.Screen 
        name="DocumentUpload" 
        component={DocumentUpload} 
        options={({navigation}) => ({
          header: (props) => <StackHeader title="Document Upload" navigation={navigation} isHomeScreen={false} {...props} />,
        })}
      />
      <ProfileStack.Screen 
        name="Certificate" 
        component={Certificate} 
        options={({navigation}) => ({
          header: (props) => <StackHeader title="Certificate" navigation={navigation} isHomeScreen={false} {...props} />,
        })}
      />
      <ProfileStack.Screen 
        name="Support" 
        component={Support} 
        options={({navigation}) => ({
          header: (props) => <StackHeader title="Support" navigation={navigation} isHomeScreen={false} {...props} />,
        })}
      />
      <ProfileStack.Screen 
        name="Marklist" 
        component={Marklist} 
        options={({navigation}) => ({
          header: (props) => <StackHeader title="Marked Posts" navigation={navigation} isHomeScreen={false} {...props} />,
        })}
      />
      <ProfileStack.Screen 
        name="MyPosts" 
        component={MyPosts} 
        options={({navigation}) => ({
          header: (props) => <StackHeader title="My Posts" navigation={navigation} isHomeScreen={false} {...props} />,
        })}
      />
      <ProfileStack.Screen 
        name="Contractors" 
        component={Contractor} 
        options={({navigation}) => ({
          header: (props) => <StackHeader title="Contractors" navigation={navigation} isHomeScreen={false} {...props} />,
        })}
      />
      <ProfileStack.Screen 
        name="ContractorDetail" 
        component={ContractorDetail} 
        options={({navigation}) => ({
          header: (props) => <StackHeader title="Contractor Detail" navigation={navigation} isHomeScreen={false} {...props} />,
        })}
      />
        <ProfileStack.Screen 
        name="FeedBack" 
        component={Feedback} 
        options={({navigation}) => ({
          header: (props) => <StackHeader title="Feedback" navigation={navigation} isHomeScreen={false} {...props} />,
        })}
      />
        <ProfileStack.Screen 
        name="Reviews" 
        component={Reviews} 
        options={({navigation}) => ({
          header: (props) => <StackHeader title="Reviews" navigation={navigation} isHomeScreen={false} {...props} />,
        })}
      />
        <ProfileStack.Screen 
        name="LegalInfo" 
        component={LegalInfo} 
        options={({navigation}) => ({
          header: (props) => <StackHeader title="Legal Info" navigation={navigation} isHomeScreen={false} {...props} />,
        })}
      />
      <ProfileStack.Screen 
        name="PostDetail" 
        component={PostDetail} 
        options={({navigation}) => ({
          header: (props) => <StackHeader title="Post Detail" navigation={navigation} isHomeScreen={false} {...props} />,
        })}
      />
    </ProfileStack.Navigator>
  );
}

export default ProfileStackScreen;
