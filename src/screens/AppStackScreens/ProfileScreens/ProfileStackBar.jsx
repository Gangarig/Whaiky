import { View, Text,StyleSheet, Touchable, TouchableOpacity } from 'react-native'
import React , { useState } from 'react'
import { useTheme } from '../../../context/ThemeContext'
import { useAuth } from '../../../context/AuthContext'
import LinearGradient from 'react-native-linear-gradient'
import FastImage from 'react-native-fast-image'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Fonts from '../../../constant/Fonts'
import {AirbnbRating} from 'react-native-ratings';
import { shadowStyle } from '../../../constant/Shadow'
import auth from '@react-native-firebase/auth'
import image from '../../../assets/images/image1.png'
const ProfileStackBar = ({ navigation }) => {
    const theme = useTheme();
    const { currentUser } = useAuth();
    const [activeItem, setActiveItem] = useState('Home');
    const styles = getStyles(theme);

    const BarItem = ({ item, icon, label }) => {
        const isActive = item === activeItem;
        const containerStyle = isActive ? [styles.wrapper, styles.activeShadow] : styles.wrapper;

        return (
            <TouchableOpacity onPress={() => handlePress(item)} style={containerStyle}>
                {/* {isActive ? (
                    <LinearGradient
                        style={styles.gradientWrapper}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1.5, y: 0 }}
                        colors={[theme.primary, theme.secondary]}
                    >
                        <FontAwesomeIcon icon={icon} size={25} color={theme.white} />
                        <Text style={[styles.text, { color: theme.white }]}>{label}</Text>
                    </LinearGradient>
                ) : ( */}
                    <View style={styles.default}>
                        <FontAwesomeIcon icon={icon} size={24} color={theme.text} />
                        <Text style={styles.text}>{label}</Text>
                    </View>
                {/* )} */}
            </TouchableOpacity>
        );
    };

    const handlePress = (item) => {
        setActiveItem(item);
        navigation.navigate(item);
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[theme.primary, theme.secondary]}
                start={{ x: .2, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.profileContainer}
            >   
                <View style={styles.profileWrapper}>
                    {currentUser?.photoURL ? (
                        <View style={styles.avatarWrapper}>
                            <FastImage
                                source={image}
                                style={styles.image}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                        </View>
                    ) : (
                        <View style={styles.userIconWrapper}>
                            <FontAwesomeIcon style={{...shadowStyle}} icon={faUser} size={70} color={theme.white} />
                        </View>
                    )}
                    <View style={styles.profileInfo}>
                        <Text style={[styles.infoText,{marginTop:0}]}>{currentUser?.firstName} {currentUser?.lastName}</Text>
                        <Text style={[styles.infoText,{fontSize:12}]}>Status : {currentUser?.status}</Text>
                        <View style={styles.ratingWrapper}>
                            {currentUser?.averageRating ? (
                                <TouchableOpacity style={styles.rating} onPress={()=>navigation.navigate('Reviews')} >
                                    <AirbnbRating   
                                        count={5}
                                        defaultRating={currentUser?.averageRating > 1 ? currentUser?.averageRating: 1}
                                        size={15}
                                        showRating={false}
                                        isDisabled={true}
                                        unSelectedColor={theme.white}
                                    />
                                    <Text style={[styles.infoText,{fontSize:12,marginTop:0}]}>({currentUser?.ratingCount} Reviews) </Text>
                                </TouchableOpacity>
                            ):(
                                <View style={styles.rating}>
                                    <Text style={styles.infoText}>No Rating</Text>
                                </View> 
                            )}
                        </View>
                    </View> 
                </View>
            </LinearGradient>
            <View style={styles.barItems}>
                {currentUser && currentUser.status === 'admin' && (
                    <BarItem item="Dashboard" icon='fa-solid fa-desktop' label="Dashboard" />
                )}
                <BarItem item="MyPosts" icon='fa-solid fa-list' label="My Posts" />
                <BarItem item="Contractors" icon='fa-solid fa-user-group' label="Contractors" />
                <BarItem item="ProfileScreen" icon='fa-solid fa-gear' label="My Whaiky" />
                <BarItem item="Marklist" icon='fa-regular fa-star' label="Marklist" />
                <BarItem item="Services" icon='fa-regular fa-star' label="Services" />
            </View>
            <View style={styles.barFooter}>
                <TouchableOpacity style={styles.barText}
                    onPress={() => navigation.navigate('Support')}
                >
                    <Text style={styles.footerText}>
                        Support
                    </Text>
                </TouchableOpacity>
            <TouchableOpacity style={styles.barText}
                    onPress={() => auth().signOut()}
                >
                    <Text style={styles.footerText}>
                        Log Out
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ProfileStackBar

const getStyles = (theme) => {
    return StyleSheet.create({
  
    container: {
      flex: 1,
      backgroundColor: theme.background,
      alignItems: 'center',
    },
    barItems: {
        width: '100%',
        paddingTop: 10,
        paddingLeft: 31,
    },
    wrapper: {
      flexDirection: 'row',
      gap: 20,
      alignItems: 'center',
      width: '80%',
      borderRadius: 10,
    },
    text: {
      fontFamily: Fonts.primary,
      fontSize: 20,
      fontWeight: "600",
      fontStyle: "normal",
      paddingTop: 2,
      color: theme.text,
    },
    gradientWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 31,
      borderRadius: 5,
      marginVertical: 8,
      paddingVertical: 8,
      width: '100%',
      borderColor: theme.black,
      borderWidth: .5,
    },
    default: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 31,
      borderRadius: 10,
      width: '100%',
      marginVertical: 8,
      paddingVertical: 8,
    },
    profileContainer: {
      width: '100%',
      height: 226,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    profileWrapper: {
        flexDirection: 'row',
    },
    profileInfo: {
        marginLeft: 18,
        paddingVertical: 5,
        height: '100%',
        width: 200,
        alignItems: 'flex-start',
    },
    avatarWrapper: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        overflow: 'hidden',
    },
    userIconWrapper:{ 
        width: 100,
        height: 100,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: .5,
        borderColor: theme.white,
        borderRadius: 12,
      }
    ,
    ratingWrapper: {
        marginTop: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 100,
        height: 100,
    },
    rating: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    infoText: {
        marginTop: 12,
        color: theme.white,
        fontSize: 16,
    },
    barFooter: {
        position: 'absolute',
        bottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        paddingHorizontal: 10,
    },
    footerText: {
        color: theme.text,
        fontSize: 12,
    },
  });
  }