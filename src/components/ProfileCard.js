import { View, Text,Image ,StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Global } from '../constant/Global'
import FastImage from 'react-native-fast-image'
import defaultImage from '../assets/images/avatar/avatar.png'
const ProfileCard = ({ displayName, message, onPress }) => {
    return (
      <View style={styles.profileCardWrapper}>
        <TouchableOpacity onPress={onPress} style={styles.profileCard}>
          <View style={styles.profileImageWrapper}>
            <FastImage source={defaultImage} style={styles.profileImage} />
          </View>
          <View style={styles.profileCardInfo}>
            <Text style={Global.titleSecondary}>Sent from: {displayName}</Text>
            <Text style={Global.Text}>Last Message: {message}</Text>
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
        width:'90%',
        borderBottomColor:'rgba(105, 105, 105, 1.0)',
        borderBottomWidth:0.5,
        maxWidth:380,
    },
    profileCard:{
        width: '100%',
        maxWidth: 380,
        height: 65,
        backgroundColor:'#fff',
        borderRadius:4,
        flexDirection:'row',
    },
    profileImageWrapper:{
        width:63,
        height:60,
        borderRadius:4,
        overflow:'hidden',
    },
    profileImage:{
        width:'100%',
        height:'100%',
    },
    profileCardInfo:{
        height:'100%',
        justifyContent:'space-between',
        paddingVertical:5,
    }
});