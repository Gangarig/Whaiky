import { View, Text } from 'react-native'
import React from 'react'
import { useCurrentUser } from '../../../context/UserContext'
import { useContext } from 'react'

const CompleteRegisterScreen = () => {

  const currentUser = useCurrentUser();
  
  return (
    <View>
      <Text>CompleteRegisterScreen</Text>
    </View>
  )
}

export default CompleteRegisterScreen