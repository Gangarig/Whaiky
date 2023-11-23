import { View, Text , StyleSheet } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Colors from '../../constant/Colors'
import { Global } from '../../constant/Global'
import { DrawerActions } from '@react-navigation/native'
import { shadowStyle } from '../../constant/Shadow'
import SVGIcons from '../../constant/SVGIcons'
import LinearGradient from 'react-native-linear-gradient'

const BackButton = ({onPress}) => {
  return (
    <LinearGradient
    colors={['#9E41F0', '#4C7BC0']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={[styles.icon]}
    >
        <TouchableOpacity onPress={onPress} style={Global.container}>
          <View style={[styles.icon,shadowStyle]}>
            {SVGIcons.back}
          </View>
        </TouchableOpacity>
    </LinearGradient>
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
  }
})