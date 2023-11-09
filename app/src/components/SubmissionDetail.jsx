import { View, Text , StyleSheet } from 'react-native'
import React from 'react'
import { useAuth } from '../context/AuthContext'
import firestore from '@react-native-firebase/firestore'
import { Global } from '../../style/Global'

const SubmissionDetail = ({navigation, route}) => {
    const id = route.params.id
    console.log(id)
  return (
    <View style={style.container}>
      <Text style={Global.title}>SubmissionDetail</Text>
    </View>
  )
}

export default SubmissionDetail

const style = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center'
    }
})