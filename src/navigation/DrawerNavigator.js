import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useAuth } from '../context/AuthContext';
import AdminStackScreen from './AdminStack';
import Settings from '../screens/AppStackScreens/Settings';
import CustomDrawerContent from './CustomDrawerItems';
import StackHeader from './ScreenComponents/StackHeader';
import BottomTabs from './BottomTabs';
import Support from '../screens/AppStackScreens/Support';
import Services from '../screens/AppStackScreens/ProfileScreens/Contractor/ServiceCategory';
import LegalInfo from '../screens/AppStackScreens/ProfileScreens/Contractor/LegalInfo';
import DocumentUpload from '../screens/AppStackScreens/ProfileScreens/Contractor/DocumentUpload';
import Certificate from '../screens/AppStackScreens/ProfileScreens/Contractor/Certificate';
import PostStackScreen from './PostStack';
import ContractorStackScreen from './ContractorStack';
import Reviews from '../screens/AppStackScreens/ProfileScreens/Contractor/Reviews';
import { useTheme } from '../context/ThemeContext';



const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  const { currentUser } = useAuth();
  const theme = useTheme();
  return ( 
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: 250,
          borderRightColor: theme.black,
          borderRightWidth: 1,
        },
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="BottomTabs"
        component={BottomTabs}
        options={({ navigation }) => ({
          header: props => <StackHeader title="BottomTabs" navigation={navigation} isHomeScreen={true} {...props} />,
        })
        }
      />
      <Drawer.Screen
        name="MyPostsScreen"
        component={PostStackScreen}
        options={({ navigation }) => ({
          headerShown: false,
          header: props => <StackHeader title="MyPosts" navigation={navigation}  isHomeScreen={false} {...props} />,
        })}
      />
      {currentUser && currentUser.status === 'admin' ? (
        <Drawer.Screen
          name="Dashboard"
          component={AdminStackScreen}
          options={{
            header: props => <StackHeader title="Dashboard" isHomeScreen={false} {...props} />,
          }}
        />
      ) : null}
      <Drawer.Screen
          name="ContractorScreen"
          component={ContractorStackScreen}
          options={({ navigation }) => ({
            headerShown: false,
            header: props => <StackHeader title="Contractors"  isHomeScreen={false} navigation={navigation} {...props} />,
          })}
      />
      <Drawer.Screen
        name="Services"
        component={Services}
        options={{
          headerShown: true,
          header: props => <StackHeader title="Contractor" isHomeScreen={false} {...props} />,
        }}
      />
      <Drawer.Screen
      name="LegalInfo"
          component={LegalInfo}
          options={{
            headerShown: true,
            header: props => <StackHeader title="Legal Information" isHomeScreen={false} {...props} />,
          }}
        />
        <Drawer.Screen
        name="DocumentUpload"
        component={DocumentUpload}
        options={{
          headerShown: true,
          header: props => <StackHeader title="Documents" isHomeScreen={false} {...props} />,
        }}
        />
        <Drawer.Screen
        name="Certificate"
        component={Certificate}
        options={{
          headerShown: true,
          header: props => <StackHeader title="Certificates" isHomeScreen={false} {...props} />,
        }}
        />
        <Drawer.Screen
        name="Reviews"
        component={Reviews}
        options={{
          headerShown: true,
          header: props => <StackHeader title="Reviews" isHomeScreen={false} {...props} />,
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={{
          headerShown: true,
          header: props => <StackHeader title="Settings" isHomeScreen={false} {...props} />,
        }}
      />
      <Drawer.Screen
        name="Support"
        component={Support}
        options={{
          headerShown: true,
          header: props => <StackHeader title="Support" isHomeScreen={false} {...props} />,
        }}
      />


    </Drawer.Navigator>
  );
}

export default DrawerNavigator;
