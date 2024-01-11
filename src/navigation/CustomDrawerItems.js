import React from 'react';
import { View, Image, StyleSheet ,Text} from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useAuth } from '../context/AuthContext';
import LogoutButton from '../screens/AppStackScreens/service/LogOut';
import Colors from '../constant/Colors';
import { Global } from '../constant/Global';
import { shadowStyle } from '../constant/Shadow';
import defaultAvatar from '../assets/images/avatar/avatar.png';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import DrawerFooter from './DrawerComponents/DrawerFooter';
import DrawerHeader from './DrawerComponents/DrawerHeader';
import DrawerItems from './DrawerComponents/DrawerItems';
import UserTheme from '../constant/Theme';
function CustomDrawerContent(navigation) {
  const { currentUser } = useAuth();

    return (
    <SafeAreaView style={{ flex: 1}}>
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      colors={[UserTheme.primary, UserTheme.secondary]}
      style={styles.container}
    >
      <DrawerHeader />
      <DrawerItems props={navigation} />
      <DrawerFooter props={navigation} />
    </LinearGradient>
    </SafeAreaView>
    );
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
      justifyContent: 'space-between',
    },
  });

export default CustomDrawerContent;