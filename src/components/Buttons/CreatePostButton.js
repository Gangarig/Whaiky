import { View, Text , StyleSheet } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Colors from '../../constant/Colors'
import { Global } from '../../constant/Global'
import { DrawerActions } from '@react-navigation/native'
import { shadowStyle } from '../../constant/Shadow'
import { SVGIcons } from '../../assets/SVGIcons'
const BackButton = ({onPress}) => {
  return (
        <TouchableOpacity onPress={onPress} style={Global.container}>

        </TouchableOpacity>
  )
}

export default BackButton

const styles = StyleSheet.create({
  icon:{
    width:30,
    height:30,
    borderRadius:5,
    backgroundColor:'transparent',
    justifyContent:'center',
    alignItems:'center',
    ...shadowStyle,
  }
})