import { View, Text, Button } from 'react-native'
import React from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { NavigationProp } from '@react-navigation/native';
import LogOut from '../services/LogOut';
import { firestore } from '../../../FirebaseConfig';

import { addDoc, collection } from 'firebase/firestore';

const HomeScreen = ({navigation}:any) => {
// Usage example

    return (
      <View>
        <Text>HomeScreen</Text>
        <Button title="complete" onPress={() => navigation.navigate('complete')} />
        <Button title="Profile" onPress={() => navigation.navigate('profile')} />
        <LogOut/>
      </View>
    );
  }

export default HomeScreen