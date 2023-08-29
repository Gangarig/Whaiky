import { View, Text,Button } from 'react-native'
import React from 'react'
import NavigationProp from '@react-navigation/native'
import { auth } from '../../../FirebaseConfig';

interface RouterProps {
  navigation: NavigationProp.NavigationProp<any, any>;
}
const ProfileScreen = ({navigation}:RouterProps) => {
  return (
    <View>
      <Text>ProfileScreen</Text>

        <Button title='log Out' onPress={()=> auth.signOut()}/>
    </View>
  )
}

export default ProfileScreen