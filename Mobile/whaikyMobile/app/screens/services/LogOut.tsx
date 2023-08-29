import { View, Text,Button } from 'react-native'
import React from 'react'
import { auth } from '../../../FirebaseConfig'


const LogOut = () => {
  const handleLogout = () => {
    auth.signOut()
    console.log('logged out')
  }
  return (
    <View>
      <Button title='log Out' onPress={handleLogout}/>
    </View>
  )
}

export default LogOut