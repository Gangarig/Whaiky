import { View, Text,StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useTheme } from '../context/ThemeContext'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faIdBadge, faFile,faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'


const SecondaryDocumentCard = ({item}) => {
  const theme = useTheme()
  const styles = getStyles(theme)
  return (
    <View style={styles.container}>
      {item ? (
      <View style={styles.cardWrapper}>
        {item?.type === 'document' ? (
          <View style={styles.cardIcon}>
            <FontAwesomeIcon size={40} color={theme.primary} icon={faIdBadge} />
          </View>
        ):(
          <View style={styles.cardIcon}>
            <FontAwesomeIcon size={40} color={theme.primary} icon={faFile} />
          </View>
        )}
        <View style={styles.cardInfo}>
          <Text style={{color:theme.text}}>{item?.docType}</Text>
          <Text style={{color:theme.text}}>{item?.timeStamp}</Text>
        </View>
        <TouchableOpacity  style={styles.cardMenuWrapper} onPress={()=>console.log('Menu Pressed')}>
        <FontAwesomeIcon size={30} color={theme.primary} icon={faEllipsisVertical} />
        </TouchableOpacity>
      </View>
      ):(
      <View style={styles.Error}>
        <Text style={styles.errorText}>No Document Available</Text>
      </View> 
      )} 
    </View>
  )
}

const getStyles = (theme) => {
  return StyleSheet.create({
    container: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.backgroundColor,
      borderRadius: 12,
      marginVertical: 6,
      paddingHorizontal: 15,
      overflow: 'hidden',
    },
    cardWrapper: {
      borderWidth: 1,
      borderColor: theme.primary,
      borderRadius: 12,
      height: 60,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 5,
    },
    Error: {
      borderWidth: 1,
      borderColor: theme.primary,
      borderRadius: 12,
      height: 60,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorText: {
      color: theme.text,
      fontWeight: 'bold',
      fontSize: 16,
    },
  })
}

export default SecondaryDocumentCard