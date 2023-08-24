import { View, Text,Button } from 'react-native'
import React from 'react'
import NavigationProp from '@react-navigation/native'
import { FIREBASE_AUTH } from '../../../FirebaseConfig';

interface RouterProps {
  navigation: NavigationProp.NavigationProp<any, any>;
}
const ProfileScreen = ({navigation}:RouterProps) => {
  return (
    <View>
      <Text>ProfileScreen</Text>
      
        <Button title="Go to Settings Screen" onPress={()=>navigation.navigate("settings")}/>
        <Button title='log Out' onPress={()=> FIREBASE_AUTH.signOut()}/>
    </View>
  )
}

export default ProfileScreen