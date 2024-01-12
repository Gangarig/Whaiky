import { View, Text ,StyleSheet, TouchableOpacity} from 'react-native'
import React from 'react'
import GradientText from '../../components/GradientText'
import UserTheme from '../../constant/Theme'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { shadowStyle } from '../../constant/Shadow'

const StackHeader = ({title,navigation,isHomeScreen}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
          onPress={() => {
            if (isHomeScreen) {
              navigation.toggleDrawer();
            } else {
              navigation.goBack();
            }
          }}
      >
        <FontAwesomeIcon icon={isHomeScreen ? "fa-solid fa-bars" : "fa-solid fa-caret-left" }
        size={20} color={UserTheme.primary} />
      </TouchableOpacity>
      <GradientText text={title} size={25}/>
      <TouchableOpacity onPress={()=>navigation.navigate('SearchPost')}>
      <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" size={20}  color={UserTheme.primary}/>
      </TouchableOpacity>
    </View>
  )
}

export default StackHeader

const styles = StyleSheet.create({
  container:{
    height:50,
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row',
    backgroundColor:UserTheme.white,
    justifyContent:'space-between',
    paddingHorizontal:20,
    borderBottomColor:UserTheme.black,
    borderBottomWidth:0,
    ...shadowStyle
  }
})
