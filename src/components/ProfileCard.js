import { View, Text,Image ,StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Global } from '../constant/Global'
import FastImage from 'react-native-fast-image'
import defaultImage from '../assets/images/avatar/avatar.png'
import { shadowStyle } from '../constant/Shadow'
import Colors from '../constant/Colors'

const ProfileCard = ({ displayName, lastMessage,avatar, onPress }) => {

  const avatarImage = avatar ? { uri: avatar } : defaultImage;
    return (
      <View style={styles.profileCardWrapper}>
        <TouchableOpacity onPress={onPress} style={styles.profileCard}>
          <View style={styles.profileImageWrapper}>
            <FastImage source={avatarImage} style={styles.profileImage} />
          </View>
          
          <View style={styles.profileCardInfo}>
            <Text style={Global.titleSecondary}>{displayName}</Text>
            <Text style={Global.Text}>Last Message: {lastMessage}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  

export default ProfileCard

const styles = StyleSheet.create({
    profileCardWrapper:{    
        height: 85,
        justifyContent:'center',
        alignItems:'center',
        width:'100%',
        maxWidth:380,
    },
    profileCard:{
        width: '95%',
        height: 65,
        backgroundColor: Colors.background,
        borderRadius:4,
        flexDirection:'row',
        gap:20,
    },

    profileImageWrapper:{
        width:63,
        height:60,
        borderRadius:4,
        overflow:'hidden',
        borderWidth:1,
        borderColor:Colors.primary,
        backgroundColor:Colors.background,
    },
    profileImage:{
        width:'100%',
        height:'100%',
    },
    profileCardInfo:{
        height:65,
        justifyContent:'space-between',
        paddingVertical:5,
        
    }
});