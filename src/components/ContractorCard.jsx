import { View, Text,StyleSheet, TouchableOpacity } from 'react-native'
import React,{useEffect, useState} from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { shadowStyle } from '../constant/Shadow'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import FastImage from 'react-native-fast-image'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import firestore from '@react-native-firebase/firestore'
import { useTheme } from '../context/ThemeContext'
import { Rating, AirbnbRating } from 'react-native-ratings';

const ContractorCard = ({props , onPress}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  

  return (
    <TouchableOpacity style={styles.ContractorCard} onPress={onPress}>
      <LinearGradient colors={[theme.primary,theme.secondary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
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
            <Text
             ellipsizeMode='tail'
             numberOfLines={1}
             style={styles.name}>{props.displayName}</Text> 
          {props.services && props.services.length > 0 && (
            <Text
            ellipsizeMode='tail'
            numberOfLines={1} 
            style={styles.categoryText}>{props.services[0]?.categoryText}</Text>
          )}
            {props.averageRating ? (
              <View style={styles.rating}>
            <AirbnbRating
              count={5}
              defaultRating={props.averageRating}
              size={15}
              showRating={false}
              isDisabled={true}
            />
            <Text style={styles.ratingText}>({props.ratingCount} Reviews) </Text>
            </View>
          ) : (
            <Text
            ellipsizeMode='tail'
            numberOfLines={1} 
            style={styles.ratingText}>No Rating Currently</Text>
          )} 
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
      paddingHorizontal: 20,
    },
    info: {
      paddingLeft: 30,
    },
    name: {
      color: theme.white,
      fontSize: 16,
      fontWeight: 'bold',
      width: '100%',
      maxWidth: 200,
    },
    ratingText: {
      color: theme.white,
      fontSize: 16,
      fontWeight: 'bold',
      width: '100%',
    },
    categoryText: {
      color: theme.white,
      fontSize: 16,
      fontWeight: 'bold',
      width: '100%',
    },
    rating: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      gap: 5,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      borderWidth: 1,
      borderColor: theme.white,
      ...shadowStyle,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
}


export default ContractorCard