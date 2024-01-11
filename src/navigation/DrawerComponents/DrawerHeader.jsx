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

const DrawerHeader = () => {
    const {currentUser} = useAuth();
  return (
    <View style={[style.container]}>
        <View style={style.info}>
            <FastImage
                style={style.avatar}
                source={{
                    uri:currentUser.photoURL,
                    priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.cover}
            />
            <View style={style.headerInfo}>
            <Text style={style.headerName}>{currentUser.displayName}</Text>
            <Text style={style.headerText}>Lorem Ipsum</Text>
            <AirbnbRating
            count={5}
            defaultRating={3}
            size={15}
            showRating={false}
            />
            <Text style={style.headerText}>Sea my social Profile</Text>
            </View>
        </View>
    </View>
  )
}

export default DrawerHeader

const style = StyleSheet.create({
    container:{
        height:170,
        justifyContent:'center',
        alignItems:'center',
        borderBottomColor:UserTheme.black,
        borderBottomWidth:1,
    },
    info:{
        flexDirection:'row',
    },
    headerInfo:{
        padding:10,
        justifyContent:'center',
        alignItems:'center',
    },
    avatar:{
        width:100,
        height:100,
        borderRadius:50,
        borderWidth:1.5,
        borderColor:UserTheme.white,
    },
    headerName:{
        fontFamily: Fonts.primary,
        fontSize: 27,
        fontWeight: "500",
        fontStyle: "normal",
        lineHeight: 27,
        color: UserTheme.white,     
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