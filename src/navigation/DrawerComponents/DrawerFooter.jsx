import { View, Text ,StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import UserTheme from '../../constant/Theme'
import GradientText from '../../components/GradientText'
import { useAuth } from '../../context/AuthContext'
import Fonts from '../../constant/Fonts'
import auth from '@react-native-firebase/auth';


const DrawerFooter = ({navigation}) => {

  const {currentUser} = useAuth();
  return (
    <View style={style.container}>
      {currentUser && currentUser.status === 'contractor' ?
      null:(
      <TouchableOpacity onPress={()=>navigation.navigate('Contractor')}>
        <GradientText text='Become a Contrator' size={20} underline={true}/>
      </TouchableOpacity>
      )}
        <View style={style.footerLinks}>
            <TouchableOpacity 
            onPress={()=>navigation.navigate('Support')}
            >
              <Text style={style.footerText}>Support</Text>
            </TouchableOpacity>
            <TouchableOpacity 
            onPress={()=>auth().signOut()}
            >
              <Text style={style.footerText}>Log out</Text>
            </TouchableOpacity>
        </View>
    </View>
  )
}

export default DrawerFooter

const style = StyleSheet.create({
    container:{
      backgroundColor:UserTheme.white,
      justifyContent:'center',
      alignItems:'center',
    },
    footerLinks:{
        flexDirection:'row',
        justifyContent:'space-between',
        width:'100%',
        paddingHorizontal:20,
        paddingVertical:10,
    },
    footerText:{
      fontFamily: Fonts.primary,
      fontSize: 16,
      fontWeight: "300",
      fontStyle: "normal",
      lineHeight: 16,
      color: UserTheme.text,
    }
})