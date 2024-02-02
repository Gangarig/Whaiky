import { View, Text,StyleSheet, TouchableOpacity } from 'react-native'
import React,{useEffect, useState} from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { shadowStyle } from '../constant/Shadow'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import FastImage from 'react-native-fast-image'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import firestore from '@react-native-firebase/firestore'
import { useTheme } from '../context/ThemeContext'

const ContractorCard = ({props , onPress}) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  
  return (
    <TouchableOpacity style={styles.ContractorCard} onPress={onPress}>
      <LinearGradient colors={['#9E41F0', '#01AD94']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
        <View>
          {props.photoURL ? (
            <FastImage
              source={{ uri: props.photoURL }}
              style={styles.avatar}
              resizeMode="cover"
              onError={(e) => {
                console.log("Image loading error:", e);
              }}
            />
          ) : (
            <View style={styles.avatar}>
            <FontAwesomeIcon icon={faUser} size={60} color={theme.white} />
            </View>
          )}
        </View>
        <View style={styles.info}>
            <Text style={styles.name}>{props.displayName}</Text>
            <Text style={styles.email}>{props.email}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  )
}



const getStyles = (theme) => {
  return StyleSheet.create({
    ContractorCard: {
      width: '100%',
      height: 100,
      borderRadius: 10,
      overflow: 'hidden',
      marginVertical: 10,
      ...shadowStyle,
    },
    gradient: {
      flex: 1,  
      padding: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    info: {
      paddingLeft: 20,
    },
    name: {
      color: theme.white,
      fontSize: 20,
      fontWeight: 'bold',
    },
    email: {
      color: theme.white,
      fontSize: 20,
      fontWeight: 'bold',
    },
  });
}


export default ContractorCard