import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { useTheme } from '../context/ThemeContext'
import LinearGradient from 'react-native-linear-gradient'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import FastImage from 'react-native-fast-image'
import { AirbnbRating } from 'react-native-ratings';


const SecondaryProfileCard = ({profile}) => {
    const theme = useTheme();   
    const styles = getStyles(theme);
    
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.secondary, theme.primary]}
        start={{ x: -.3, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.profileContainer}
        >
          <View style={styles.cardHeader}>
            {profile && profile?.photoURL ? (
              <FastImage
                style={styles.avatar}
                source={{
                  uri: profile?.photoURL,
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            ) : (
              <View style={styles.userIcon}>
                <FontAwesomeIcon icon={faUser} size={70} color={theme.white} />
              </View>
            )}
            <View style={styles.cardInfo}>
              <Text
                ellipsizeMode='tail'
                numberOfLines={1}
                style={styles.cardName}>
                {profile?.firstName || profile?.lastName ? `${profile.firstName} ${profile.lastName}`.trim() : "No Name Currently"}
              </Text>
              {profile?.services && profile?.services.length > 0 ? (
              <Text
                ellipsizeMode='tail'
                numberOfLines={1} 
                style={styles.categoryText}>{profile.services[0]?.categoryText}</Text>
              ):(
                <Text
                ellipsizeMode='tail'
                numberOfLines={1}
                style={styles.categoryText}>No Category Currently</Text>
              )}
                {profile?.averageRating ? (
                  <View style={styles.rating}>
                    <AirbnbRating
                      count={5}
                      defaultRating={profile?.averageRating > 1 ? profile?.averageRating: 1}
                      size={15}
                      showRating={false}
                      isDisabled={true}
                    />
                    <Text style={styles.ratingText}>({profile?.ratingCount} Reviews) </Text>
                </View>
              ) : (
                <View style={styles.rating}>
                  <Text
                  ellipsizeMode='tail'
                  numberOfLines={1} 
                  style={styles.ratingText}>No Rating Currently</Text>
                </View>
              )} 
            </View>
          </View>
          <View style={styles.cardBody}>

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
    },
    profileContainer: {
        width: '100%',
        height: 227,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 10,
    },
})
export default SecondaryProfileCard