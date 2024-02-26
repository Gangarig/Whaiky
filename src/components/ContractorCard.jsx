import { View, Text,StyleSheet, TouchableOpacity,TouchableHighlight } from 'react-native'
import React,{useEffect, useState} from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { shadowStyle } from '../constant/Shadow'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import FastImage from 'react-native-fast-image'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import firestore from '@react-native-firebase/firestore'
import { useTheme } from '../context/ThemeContext'
import { Rating, AirbnbRating } from 'react-native-ratings';
import { handleSelect } from '../screens/AppStackScreens/service/ChatService'
import { height, width } from '@fortawesome/free-solid-svg-icons/faSquareCheck'


const ContractorCard = ({currentUser ,onPress ,selectedUser ,navigation}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const handleContact = () => {
    handleSelect(currentUser,selectedUser)
    navigation.navigate('Chat')
  }
  

  return (
    <TouchableOpacity  activeOpacity={0.5}  style={styles.ContractorCard} onPress={onPress}>
      <LinearGradient colors={[theme.secondary,theme.primary]} start={{ x: 0, y: -2 }} end={{ x: .7, y: 1.6 }} style={styles.gradient}>
        <View>
          {selectedUser?.photoURL ? (
            <View style={styles.avatarWrapper}>
            <FastImage
              source={{ uri: selectedUser.photoURL }}
              style={styles.image}
              resizeMode="cover"
              onError={(e) => {
                console.log("Image loading error:", e);
              }}
            />
            </View>
          ) : (
            <View style={[styles.avatar]}>
              <FontAwesomeIcon style={{...shadowStyle}} icon={faUser} size={70} color={theme.white} />
            </View>
          )}
        </View>
        <View style={styles.info}>
        <Text
          ellipsizeMode='tail'
          numberOfLines={1}
          style={styles.name}>
          {selectedUser?.firstName || selectedUser?.lastName ? `${selectedUser.firstName} ${selectedUser.lastName}`.trim() : "No Name Currently"}
        </Text>
          {selectedUser?.services && selectedUser?.services.length > 0 && (
            <Text
            ellipsizeMode='tail'
            numberOfLines={1} 
            style={styles.categoryText}>{selectedUser.services[0]?.categoryText}</Text>
          )}
            {selectedUser?.averageRating ? (
              <View style={styles.rating}>
                <AirbnbRating
                  count={5}
                  defaultRating={selectedUser?.averageRating > 1 ? selectedUser?.averageRating: 1}
                  size={15}
                  showRating={false}
                  isDisabled={true}
                />
                <Text style={styles.ratingText}>({selectedUser?.ratingCount} Reviews) </Text>
            </View>
          ) : (
            <View style={styles.rating}>
              <Text
              ellipsizeMode='tail'
              numberOfLines={1} 
              style={styles.ratingText}>No Rating Currently</Text>
            </View>
          )} 
          <View style={styles.btnContainer}>
            <TouchableOpacity onPress={()=>handleContact()} style={styles.btn}>
                <FontAwesomeIcon color={theme.white} size={14} icon="fa-regular fa-comment-dots" />
                <Text style={styles.btnText}>Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={onPress}>
                <FontAwesomeIcon color={theme.white} size={14} icon="fa-regular fa-user" />
                <Text style={styles.btnText}>View Profile</Text>
            </TouchableOpacity>
          </View>
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
      // marginVertical: 10,
    },
    gradient: {
      flex: 1,  
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    info: {
      flex: 1,
      paddingHorizontal: 10,
      paddingVertical: 5,
      justifyContent  : 'space-around',
    },
    name: {
      color: theme.white,
      fontSize: 14,
      width: '100%',
      maxWidth: 200,
      fontWeight: 'bold',
    },
    ratingText: {
      color: theme.white,
      fontSize: 12,
      width: '100%',
    },
    categoryText: {
      color: theme.white,
      fontSize: 12,
      width: '100%',
    },
    rating: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      gap: 5,
    },
    avatarWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 100,
      width: 100,
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: 11,
      borderWidth: .5,
      borderColor: theme.white,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 11,
      borderWidth: .5,
      borderColor: theme.white,
      justifyContent: 'center',
      alignItems: 'center',
    },
    btnContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '90%',
    },
    btn: {
      padding: 5,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      gap: 5,
    },
    btnText: {
      color: theme.white,
      fontSize: 14,
      fontWeight: 'bold',
    },
  });
}


export default ContractorCard