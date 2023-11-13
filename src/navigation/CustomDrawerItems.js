import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useAuth } from '../context/AuthContext';
import LogoutButton from '../service/LogOut';

function CustomDrawerContent(props) {
    const { currentUser } = useAuth();
    
    return (
      <DrawerContentScrollView {...props}>
        <View style={{height: '100%'}}> 
          <Image
            source={currentUser?.photoURL ? { uri: currentUser.photoURL } : defaultAvatar}
            style={styles.profileImage}
          />
          <DrawerItemList {...props} />
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
      borderRadius: 10,
      marginVertical: 30,
      alignSelf: 'center',
      borderWidth: 1,
      borderColor: '#ccc',
    },
    logoutButton: { 
      padding: 10,
      borderTopWidth: 1, 
      borderTopColor: '#ccc'
    },
  });

export default CustomDrawerContent;