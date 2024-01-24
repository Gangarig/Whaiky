import { View, Text,Image ,StyleSheet, TouchableOpacity, Button } from 'react-native'
import React from 'react'
import { Global } from '../constant/Global'
import FastImage from 'react-native-fast-image'
import defaultImage from '../assets/images/avatar/avatar.png'
import { shadowStyle } from '../constant/Shadow'
import UserTheme from '../constant/Theme'
import Fonts from '../constant/Fonts'

const ProfileCard = ({ item, onPress }) => {
  // Check if item, lastMessage, and user are defined
  const avatarImage = item?.lastMessage?.user?.avatar ? { uri: item.lastMessage.user.avatar } : defaultImage;
  const userName = item?.lastMessage?.user?.name || 'Unknown User';
  const lastMessage = item?.lastMessage?.text || 'No message available';
  const isRead = item?.lastMessage?.read || false;
  const firebaseTimestamp = item?.lastMessage?.timestamp; // Firebase Timestamp
  const date = firebaseTimestamp ? firebaseTimestamp.toDate() : new Date();
  const formatDate = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const year = date.getFullYear();
  
    return `${hours}:${minutes} ${day}.${month}.${year}`;
  };
  const formattedDate = formatDate(date);
  

  return (
      <TouchableOpacity onPress={onPress} style={[styles.profileCard,shadowStyle]}>
        <View style={[styles.profileImageWrapper]}>
          <FastImage source={avatarImage} style={[styles.profileImage,shadowStyle]} />
        </View>
        <View style={styles.profileCardInfo}>
          <Text style={styles.name}>{userName}</Text>
          <Text 
          style={styles.lastMessage} 
          numberOfLines={3} 
          ellipsizeMode='tail'
        >
          {item?.lastMessage?.text || 'No message available'}
        </Text>
          <View style={styles.status}>
            <Text style={styles.date}>{formattedDate}</Text>
            <Text style={styles.read}>{isRead ? 'Read' : 'Unread'}</Text>
          </View>
        </View>
      </TouchableOpacity>
  );
};

  
  

export default ProfileCard

const styles = StyleSheet.create({
    profileCard:{
        width:'100%',
        height: 90,
        backgroundColor: UserTheme.background,
        borderRadius:4,
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:5,
        marginVertical:2,
    },
    profileImageWrapper:{
        width: 90,
        height:'100%',
        borderRadius:4,
        overflow:'hidden',
        backgroundColor:UserTheme.background,
        justifyContent:'center',
        alignItems:'center',
        ...shadowStyle
    },
    profileImage:{
        width:71,
        height:71,
        borderRadius:4,
        resizeMode:'cover',
    },
    profileCardInfo:{
      paddingHorizontal:5,
      justifyContent:'space-between',
      height:'100%',
      flex:1,
    },
    name:{
        fontFamily:Fonts.primary,
        fontSize:16,
        fontWeight:'bold',
        color:UserTheme.black,
    },
    lastMessage:{
        fontFamily:Fonts.primary,
        fontSize:12,
        fontWeight:'400',
        color:UserTheme.black,
    },
    status:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    date:{
        fontFamily:Fonts.primary,
        fontSize:14,
        fontWeight:'bold',
        color:UserTheme.black,

    },
    read:{
        fontFamily:Fonts.primary,
        fontSize:14,
        fontWeight:'bold',
        color:UserTheme.black,
    }

});