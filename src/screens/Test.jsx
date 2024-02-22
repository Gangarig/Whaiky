import { View, Text } from 'react-native'
import React from 'react'
import SecondaryDocumentCard from '../components/SecondaryDocumentCard'
import SecondaryProfileCard from '../components/SecondaryProfileCard'

const Test = () => {
  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center',width:'100%'}}>
      <Text>Test</Text>
      <SecondaryDocumentCard />
      <SecondaryProfileCard />
    </View>
  )
}

export default Test