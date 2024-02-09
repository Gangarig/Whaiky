import { View, Text,Image ,StyleSheet, TouchableOpacity, Button } from 'react-native'
import React from 'react'
import { Global } from '../constant/Global'
import FastImage from 'react-native-fast-image'
import defaultImage from '../assets/images/avatar/avatar.png'
import { shadowStyle } from '../constant/Shadow'
import UserTheme from '../constant/Theme'
import Fonts from '../constant/Fonts'
import { useAuth } from '../context/AuthContext'
import firestore from '@react-native-firebase/firestore';
import { useEffect,useState } from 'react'


const ProfileCard = ({ item, onPress }) => {
  const [lastMessage, setLastMessage] = useState('No message available');
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchLastMessage = async () => {
      try {
        const chatDocRef = firestore().collection('chats').doc(item.chatId);
        const chatDocSnapshot = await chatDocRef.get();

        if (chatDocSnapshot.exists) {
          const chatData = chatDocSnapshot.data();
          const lastMessagesMap = chatData.lastMessages;

          if (lastMessagesMap && lastMessagesMap[item.userInfo.uid]) {
            const userLastMessage = lastMessagesMap[item.userInfo.uid];
            setLastMessage(userLastMessage.text); 
            // console.log("Last message:", userLastMessage.text);
          } else {
            console.log("No last message found for this user.");
          }
        } else {
          console.log("No such chat document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchLastMessage(); // Call the function to fetch the last message
  }, [item.chatId, item.userInfo.uid]);


  
  

 



  const avatarImage = item?.userInfo?.photoURL ? { uri: item?.userInfo?.photoURL } : defaultImage;
  const userName = item?.userInfo?.displayName || 'No name available';
  const isRead = item?.lastMessage?.read || false;
  const firebaseTimestamp = item?.lastMessage?.timestamp; 
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
    <View style={styles.profileCardWrapper}>
        <TouchableOpacity onPress={onPress} style={[styles.profileCard]}>
        <View style={[styles.profileImageWrapper]}>
          <FastImage source={avatarImage} style={[styles.profileImage]} />
        </View>
        <View style={styles.profileCardInfo}>
          <Text style={styles.name}>{userName}</Text>
          <Text 
          style={styles.lastMessage} 
          numberOfLines={3} 
          ellipsizeMode='tail'
        >
          {lastMessage}
        </Text>
          <View style={styles.status}>
            <Text style={styles.date}>{formattedDate}</Text>
            <Text style={styles.read}>{isRead ? 'Read' : 'Unread'}</Text>
          </View>
        </View>
      </TouchableOpacity>
      </View>

  );
};

  
  

export default ProfileCard

const styles = StyleSheet.create({
    profileCardWrapper:{
        width:'100%',
        ...shadowStyle,
        marginVertical:5,
        height:90,
    },
    profileCard:{
        width:'100%',
        height: 90,
        backgroundColor: UserTheme.background,
        borderRadius:4,
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:5,
        paddingVertical:5,
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
        ...shadowStyle,
        // borderWidth:1,
    },
    profileImage:{
        width:71,
        height:71,
        borderRadius:4,
        resizeMode:'cover',
        ...shadowStyle,
        borderWidth:1,
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