import { View, Text, Button } from 'react-native'
import React from 'react'

const AddPost = ({navigation}) => {
  return (
    <View>
      <Text>AddPost</Text>
      <Button title='Go Back' onPress={() => navigation.goBack()} />
    </View>
  )
}

export default AddPost