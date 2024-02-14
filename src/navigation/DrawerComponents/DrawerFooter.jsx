import { View, Text ,StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import UserTheme from '../../constant/Theme'
import GradientText from '../../components/GradientText'
import { useAuth } from '../../context/AuthContext'
import Fonts from '../../constant/Fonts'
import auth from '@react-native-firebase/auth';
import { text } from '@fortawesome/fontawesome-svg-core'
import { useTheme } from '../../context/ThemeContext'


const DrawerFooter = ({navigation}) => {

  const {currentUser} = useAuth();
  const theme = useTheme();
  const style = getStyles(theme);
  return (
    <View style={style.container}>
    {/* {
      currentUser && !(currentUser.status === 'contractor' || currentUser.status === 'admin') && (
        <TouchableOpacity onPress={()=>navigation.navigate('Services')}>
          <GradientText 
            colors={[theme.primary, theme.secondary]} 
            style={style.text}
            size={20} 
            underline={true}
          >
            Become a contractor
          </GradientText>
        </TouchableOpacity>
      )
    } */}
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

const getStyles = (theme) => StyleSheet.create({
    container:{
      backgroundColor:theme.white,
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
      color: theme.text,
    },
    text:{
      marginBottom:10,
    }
  })