import { View ,StyleSheet, TouchableOpacity} from 'react-native'
import React from 'react'
import GradientText from '../../components/GradientText'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { CommonActions } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext'
import { shadowStyle } from '../../constant/Shadow';

const StackHeader = ({title,navigation,isHomeScreen}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
          onPress={() => {
              navigation.dispatch(CommonActions.goBack());
          }}
      >
        {isHomeScreen ? null :<FontAwesomeIcon icon={isHomeScreen ? "fa-solid fa-bars" : "fa-solid fa-caret-left" }
        size={20} color={theme.primary} />}
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>navigation.navigate('Home')} style={styles.Whaiky}>
      <GradientText colors={[theme.primary, theme.secondary]} style={styles.text}
      size={25}
      >
        {title}
      </GradientText>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>navigation.navigate('SearchPost')}>
      <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" size={20}  color={theme.secondary}/>
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
    backgroundColor:theme.background,
    justifyContent:'space-between',
    paddingHorizontal:20,
    borderBottomColor:theme.primary,
    borderBottomWidth:.5,
  },
  text:{
    fontSize:25,
    fontWeight:'bold',
    textAlign:'center',
    color:theme.primary,
  } ,
  Whaiky:{
    backgroundColor:theme.background,
  }
})

