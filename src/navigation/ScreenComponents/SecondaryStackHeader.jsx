import { View, Text ,StyleSheet, TouchableOpacity} from 'react-native'
import React from 'react'
import GradientText from '../../components/GradientText'
import { useTheme } from '../../context/ThemeContext'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { shadowStyle } from '../../constant/Shadow'
import { CommonActions } from '@react-navigation/native';


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
      <GradientText text={title} size={25}/>
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
    borderBottomColor:theme.black,
    borderBottomWidth:0,
    ...shadowStyle
  }
});