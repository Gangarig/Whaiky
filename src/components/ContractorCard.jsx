import { View, Text,StyleSheet } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'

const ContractorCard = ({props}) => {
  return (
    <View style={styles.ContractorCard}>
      <LinearGradient colors={['#9E41F0', '#01AD94']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
      <Text>{props.displayName}</Text>
      </LinearGradient>
    </View>
  )
}

export default ContractorCard

const styles = StyleSheet.create({
  ContractorCard:{
    width:200,
    height:200,
    borderRadius:10,
    margin:10,
    justifyContent:'center',
    alignItems:'center'
  },
  gradient:{
    width:200,
    height:200,
    borderRadius:10,
    justifyContent:'center',
    alignItems:'center'
  }
})  