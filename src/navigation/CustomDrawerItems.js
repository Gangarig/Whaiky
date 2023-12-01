import React from 'react';
import { View, Image, StyleSheet ,Text} from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useAuth } from '../context/AuthContext';
import LogoutButton from '../screens/AppStackScreens/service/LogOut';
import Colors from '../constant/Colors';
import { Global } from '../constant/Global';
import { shadowStyle } from '../constant/Shadow';
import defaultAvatar from '../assets/images/avatar/avatar.png';

function CustomDrawerContent(props) {
    const { currentUser } = useAuth();
    
    return (
      <DrawerContentScrollView 
      contentContainerStyle={{flex:1,justifyContent:'space-between'}}
      {...props}>
        <View style={styles.menu}> 
          <View style={styles.profileBox}>
          <Image
            source={currentUser?.photoURL ? { uri: currentUser.photoURL } : defaultAvatar}
            style={styles.profileImage}
          />
          <Text style={[Global.titleSecondary,styles.name]}>{currentUser.displayName}</Text>
          </View>
          <DrawerItemList style={styles.item} {...props} />
        </View>
        <View style={styles.logoutButton}>
          <LogoutButton />
        </View>

      </DrawerContentScrollView>
    );
  }
  const styles = StyleSheet.create({
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      alignSelf: 'center',
      borderWidth: 2,
      borderColor: Colors.primary,
    },
    logoutButton: { 
      borderTopWidth: 1, 
      borderTopColor: '#ccc',
    },
    menu: {
      justifyContent: 'space-around',
    },
    name:{
      textAlign:'center',
      color:Colors.text,
      fontSize:20,
      fontWeight:'bold',
      height:30,
    },
    profileBox:{
      gap:10,
      justifyContent:'space-around',
      alignItems:'center',
      height:150,
      borderBottomWidth: 1, 
      borderBottomColor: '#ccc',
      marginVertical:30,

    },
  });

export default CustomDrawerContent;