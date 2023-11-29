import { View, Text ,StyleSheet, Button} from 'react-native'
import React from 'react'
import LogOut from './service/LogOut'
import { DrawerActions } from '@react-navigation/native';


const Settings = ({navigation}) => {
  return (
    <View>
      <Text>Settings</Text>
      <LogOut />
      <Button
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        title="Open drawer"
      />
    </View>
  )
}

export default Settings