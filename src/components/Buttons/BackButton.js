import { View, Text } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Colors from '../../constant/Colors'
import { Global } from '../../constant/Global'
import { DrawerActions } from '@react-navigation/native'
const BackButton = ({navigation}) => {
  return (
        <TouchableOpacity onPress={()=> navigation.goBack()}>
            <Text style={Global.titleSecondary}>Back</Text>
        </TouchableOpacity>
  )
}

export default BackButton