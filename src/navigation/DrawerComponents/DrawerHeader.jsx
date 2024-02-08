import { View, Text,StyleSheet } from 'react-native'
import React from 'react'
import FastImage from 'react-native-fast-image'
import UserTheme from '../../constant/Theme'
import { useAuth } from '../../context/AuthContext' 
import { SafeAreaView } from 'react-native-safe-area-context'
import { Global } from '../../constant/Global'
import { Rating, AirbnbRating } from 'react-native-ratings';
import Fonts from '../../constant/Fonts';
import { shadowStyle } from '../../constant/Shadow'
import defaultAvatar from '../../assets/images/avatar/avatar.png'

const DrawerHeader = ({navigation}) => {
    const {currentUser} = useAuth();
    const getDisplayName = () => {
        if (currentUser.displayName) {
            return currentUser.displayName;
        } else if (currentUser.firstName && currentUser.lastName) {
            return `${currentUser.firstName} ${currentUser.lastName}`;
        } else if (currentUser.firstName) {
            return currentUser.firstName;
        } else if (currentUser.lastName) {
            return currentUser.lastName;
        } else {
            return 'No Name';
        }
    };
    const avatarImage = currentUser?.photoURL ? { uri: currentUser?.photoURL } : defaultAvatar;
  return (
    <View style={[style.container]}>
        <View style={style.info}>
            <FastImage
                style={style.avatar}
                source={avatarImage}
                resizeMode={FastImage.resizeMode.cover}
            />
            <View style={style.headerInfo}>
            <Text
            ellipsizeMode='tail'
            numberOfLines={1}
            style={style.headerName}>{getDisplayName()}</Text>
            <Text
            ellipsizeMode='tail'
            numberOfLines={1}
            style={style.headerText}>Status : {currentUser.status}</Text>
            {currentUser.status === 'contractor' && (
                currentUser.averageRating && currentUser.averageRating > 0 ? (
                    <AirbnbRating
                        count={5}
                        defaultRating={currentUser.averageRating}
                        size={15}
                        showRating={false}
                    />
                ) : (
                    <Text style={style.headerText}>No Rating</Text>
                )
            )}
            <Text 
            onPress={() => navigation.navigate('Profile')}
            numberOfLines={1}
            ellipsizeMode='tail'
            style={style.headerText}>Sea my social Profile</Text>
            </View>
        </View>
    </View>
  )
}

export default DrawerHeader

const style = StyleSheet.create({
    container:{
        height:150,
        justifyContent:'center',
        alignItems:'center',
        borderBottomColor:UserTheme.black,
        borderBottomWidth:1,
    },
    info:{
        flexDirection:'row',
    },
    headerInfo:{
        width:'60%',
        justifyContent:'center',
        alignItems:'center',
        marginLeft:5,
    },
    avatar:{
        width:80,
        height:80,
        borderRadius:40,
        borderWidth:1,
        borderColor:UserTheme.black,
        backgroundColor:UserTheme.background,
        ...shadowStyle,
    },
    headerName:{
        fontFamily: Fonts.primary,
        fontSize: 20,
        fontWeight: "500",
        fontStyle: "normal",
        lineHeight: 20,
        color: UserTheme.white,     
        width:100,
        textAlign:'center',
    },
    headerText:{
        fontFamily: Fonts.primary,
        fontSize: 15,
        fontWeight: "500",
        fontStyle: "normal",
        lineHeight: 15,
        color: UserTheme.white,
    }
})