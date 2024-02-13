import { View, Text ,StyleSheet, TouchableOpacity} from 'react-native'
import React from 'react'
import GradientText from '../../components/GradientText'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { shadowStyle } from '../../constant/Shadow'
import { CommonActions } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext'

const StackHeader = ({title,navigation,isHomeScreen}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  
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
        size={20} color={theme.primary} />
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>navigation.navigate('Home')} style={styles.Whaiky}>
      <GradientText colors={[theme.primary, theme.secondary]} style={styles.text}
      size={25}
      >
        {title}
      </GradientText>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>navigation.navigate('SearchPost')}>
      <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" size={20}  color={theme.primary}/>
      </TouchableOpacity>
    </View>
  )
}

export default StackHeader

const getStyles = (theme) => StyleSheet.create({
  container:{
    height:50,
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row',
    backgroundColor:theme.white,
    justifyContent:'space-between',
    paddingHorizontal:20,
    borderBottomColor:theme.gray,
    ...shadowStyle,
  },
  text:{
    fontSize:25,
    fontWeight:'bold',
    textAlign:'center',
    color:theme.primary,
  } ,
  Whaiky:{
    backgroundColor:theme.white,
  }
})

