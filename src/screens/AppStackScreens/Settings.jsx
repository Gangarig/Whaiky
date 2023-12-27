import { View, Text ,StyleSheet, Button} from 'react-native'
import React from 'react'
import LogOut from './service/LogOut'
import { DrawerActions } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { Global } from '../../constant/Global';
import { shadowStyle } from '../../constant/Shadow';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../constant/Colors';

const Settings = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={Global.title}>Settings</Text>
      </View>
    </View>
  )
}

export default Settings

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 10,
    backgroundColor: Colors.background,
  },
})
