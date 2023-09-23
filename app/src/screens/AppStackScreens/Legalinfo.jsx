import { View, Text , Button } from 'react-native'
import React from 'react'

const Legalinfo = ({navigation}) => {
  return (
    <View>
      <Text>Legalinfo</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  )
}

export default Legalinfo