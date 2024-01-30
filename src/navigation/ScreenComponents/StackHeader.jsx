import { View, Text ,StyleSheet, TouchableOpacity} from 'react-native'
import React from 'react'
import GradientText from '../../components/GradientText'
import UserTheme from '../../constant/Theme'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { shadowStyle } from '../../constant/Shadow'
import { CommonActions } from '@react-navigation/native';
import { text } from '@fortawesome/fontawesome-svg-core'


const StackHeader = ({title,navigation,isHomeScreen}) => {
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
          onPress={() => {
            if (isHomeScreen) {
              navigation.toggleDrawer();
            } else {
              navigation.dispatch(CommonActions.goBack());

            }
          }}
      >
        <FontAwesomeIcon icon={isHomeScreen ? "fa-solid fa-bars" : "fa-solid fa-caret-left" }
        size={20} color={UserTheme.primary} />
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>navigation.navigate('Home')} style={styles.Whaiky}>
      <GradientText colors={[UserTheme.primary, UserTheme.secondary]} style={styles.text}
      size={25}
      >
        {title}
      </GradientText>
      </TouchableOpacity>
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

  },
  text:{
    fontSize:25,
    fontWeight:'bold',
    textAlign:'center',
    color:UserTheme.primary,
  } ,
  Whaiky:{
    backgroundColor:UserTheme.white,
  }
})
