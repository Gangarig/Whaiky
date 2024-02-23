import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useTheme } from '../context/ThemeContext'
import LinearGradient from 'react-native-linear-gradient'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import FastImage from 'react-native-fast-image'
import { AirbnbRating } from 'react-native-ratings';
import image from '../assets/images/image1.png'
import { faPen } from '@fortawesome/free-solid-svg-icons/faPen'
import { useAuth } from '../context/AuthContext'


const SecondaryProfileCard = ({profile,navigation}) => {
    const theme = useTheme();   
    const styles = getStyles(theme);
    const { currentUser } = useAuth();
    const handleFeedBack = (uid) => {
      if(currentUser?.uid === uid){
        navigation.navigate('Reviews')
      } else {
        navigation.navigate('Feedback', {id: uid})
      } 
    }
    
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.secondary, theme.primary]}
        start={{ x: .3, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.profileContainer}
        >
          <View style={styles.cardHeader}>
            {currentUser?.uid === profile?.uid && (
            <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('PersonalInfo')}>
              <FontAwesomeIcon icon={faPen} color={theme.secondary} size={15} />
            </TouchableOpacity>
            )}
              {profile && profile?.photoURL ? (
              <View style={styles.userIconWrapper}>
                <FastImage
                  style={styles.avatar}
                  resizeMode={FastImage.resizeMode.cover}
                  source={{
                    uri: image1,
                    priority: FastImage.priority.normal,
                  }}
                />
              </View>
              ) : (
              <View style={styles.userIconWrapper}>
                <FontAwesomeIcon icon={faUser} size={50} color={theme.white} />
              </View>
              )} 
            <View style={styles.cardInfo}>
              <Text
                ellipsizeMode='tail'
                numberOfLines={1}
                style={[styles.cardInfoText,{fontSize:14}]}>
                {profile?.firstName || profile?.lastName ? `${profile.firstName} ${profile.lastName}`.trim() : "No Name Currently"}
              </Text>
              <Text        
                ellipsizeMode='tail'
                style={[styles.cardInfoText,styles.marginVertical]}
                numberOfLines={1}  >
                {profile?.status || "No Status Currently" }
              </Text>
              {profile?.services && profile?.services.length > 0 ? (
              <Text
                ellipsizeMode='tail'
                numberOfLines={1} 
                style={[styles.cardInfoText,styles.marginVertical]}>{profile.services[0]?.categoryText}</Text>
              ):(
                <Text
                ellipsizeMode='tail'
                numberOfLines={1}
                style={[styles.cardInfoText,styles.marginVertical]}>No Category Currently</Text>
              )}
                {profile?.averageRating ? (
                  <TouchableOpacity onPress={()=>handleFeedBack(profile.uid)} style={styles.rating}>
                    <AirbnbRating
                      count={5}
                      defaultRating={profile?.averageRating > 1 ? profile?.averageRating: 1}
                      size={15}
                      showRating={false}
                      isDisabled={true}
                    />
                    <Text style={styles.ratingText}>({profile?.ratingCount} Reviews) </Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.rating}>
                  <Text style={styles.cardInfoText}>No Rating </Text>
                </View>
              )} 
            </View>
          </View>
          <View style={styles.cardBody}>
              <View style={styles.cardBodyLabelWrapper}>
                <Text style={styles.cardBodyLabel}>Email: </Text>
                <Text style={styles.cardBodyLabel}>Phone: </Text>
                <Text style={styles.cardBodyLabel}>Location: </Text>
              </View>
              <View style={styles.cardBodyValueWrapper}>
                <Text style={styles.cardBodyValue}>{profile?.email || "No Email Currently"}</Text>
                <Text style={styles.cardBodyValue}>{profile?.phone || "No Phone Currently"}</Text>
                <Text style={styles.cardBodyValue}>{profile?.location || "No Location Currently"}</Text>
              </View>
          </View>
        </LinearGradient>
    </View>
  )
}

const getStyles = theme => StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.background,
        width: '100%',
        paddingHorizontal: 14,
    },
    profileContainer: {
        width: '100%',
        height: 227,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        paddingHorizontal: 12,
        paddingVertical: 13,
    },
    cardHeader: {
        flexDirection: 'row',
        width: '100%',
        height: '50%',
    },
    cardBody: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '50%',
        justifyContent: 'space-around',
    },
    userIconWrapper: {
      borderWidth: 1,
      borderRadius: 12,
      borderColor: theme.white,
      padding: 5,
      height: 100,
      width: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarWrapper: {
      flex:1,
      justifyContent: 'center',
      alignItems: 'center',
      width: 100,
      height: 100,
      borderRadius: 12,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 12,
    },
    cardInfo: {
      width: '100%',
      height: '100%',
      paddingLeft: 17,
    },
    cardBodyLabelWrapper: {
      height: '100%',
      width: '40%',
      alignItems: 'center',
      justifyContent: 'space-around',
      
    },
    cardBodyValueWrapper: {
      width: '70%',
      height: '100%',
      justifyContent: 'space-around',
    },
    cardInfoText: {
      color: theme.white,
      fontSize: 12,
      paddingBottom: 10,
    },
    rating: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyItems: 'center',
    },
    ratingText: {
      color: theme.white,
      fontSize: 12,
    },
    cardBodyLabel: {
      color: theme.white,
      fontSize: 14,
      textAlign: 'left',
      width: '50%',
    },
    cardBodyValue: {
      color: theme.white,
      fontSize: 12,
    },
    editBtn: {
      position: 'absolute',
      top: 75,
      left: 75,
      zIndex: 999,
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.secondary,
      borderRadius: 15,
      padding : 7,
    },


})
export default SecondaryProfileCard