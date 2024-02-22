import { View, Text ,StyleSheet ,TouchableOpacity} from 'react-native'
import React , {useState} from 'react'
import { useTheme } from '../../context/ThemeContext'

const TwoSelectButton = ({onPressPrimary,onPressSecondary , primary, secondary}) => {
    const [buttonType, setButtonType] = useState(primary)
    const theme = useTheme();
    const styles = getStyles(theme);
    const primaryPress = () => {
        setButtonType(primary)
        onPressPrimary()
    }
    const secondaryPress = () => {
        setButtonType(secondary)
        onPressSecondary()
    }

    
    
  return (
    <View style={styles.wrapper}>
      <View style={[styles.buttonTypeBox]}>
        <TouchableOpacity 
          style={buttonType === secondary ? styles.activeBtnType : styles.inActiveBtnType} 
          onPress={secondaryPress}
        >
          <Text 
            style={buttonType === secondary ? styles.activeText : styles.inActiveText}
          >
            {secondary} 
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={buttonType === primary ? styles.activeBtnType : styles.inActiveBtnType}
          onPress={primaryPress}
        >
          <Text 
            style={buttonType === primary ? styles.activeText : styles.inActiveText}
          >
            {primary} 
          </Text>
        </TouchableOpacity>
      </View>
      </View>
  )
}

export default TwoSelectButton

const getStyles = (theme) => StyleSheet.create({
    wrapper: {
        justifyContent:'center',
        alignItems:'center',
        marginVertical:10,
        width:'100%',
        overflow:'hidden',
    },
    buttonTypeBox:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginVertical:10,
        borderRadius:12,
        borderWidth:1,
        backgroundColor:theme.background,
        borderColor:theme.primary,
        width:300,
        height:50,
        overflow:'hidden',
      },
    activeBtnType:{
        backgroundColor:theme.primary,
        width:150,
        height:50,
        justifyContent:'center',
        alignItems:'center',
    },
    inActiveBtnType:{
        backgroundColor:theme.background,
        width:150,
        height:50,
        justifyContent:'center',
        alignItems:'center',
    },
      activeText:{
        color:theme.white,
        fontSize:18,
      },
      inActiveText:{
        color:theme.text,
        fontSize:18,
      },
})
