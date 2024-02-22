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
                {isActive ? (
                    <LinearGradient
                        style={styles.gradientWrapper}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1.5, y: 0 }}
                        colors={[theme.primary, theme.secondary]}
                    >
                        <FontAwesomeIcon icon={icon} size={25} color={theme.white} />
                        <Text style={[styles.text, { color: theme.white }]}>{label}</Text>
                    </LinearGradient>
                ) : (
                    <View style={styles.default}>
                        <FontAwesomeIcon icon={icon} size={24} color={theme.text} />
                        <Text style={styles.text}>{label}</Text>
                    </View>
                )}
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
                colors={[theme.secondary, theme.primary]}
                start={{ x: -.3, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.profileContainer}
            >   
                <View style={styles.profileWrapper}>
                    {currentUser?.photoURL ? (
                        <FastImage
                            source={{ uri: currentUser.photoURL }}
                            style={styles.image}
                            resizeMode="cover"
                            onError={(e) => {
                                console.log("Image loading error:", e);
                            }}
                        />
                    ) : (
                        <View style={styles.avatarWrapper}>
                        <FontAwesomeIcon style={{...shadowStyle}} icon={faUser} size={70} color={theme.white} />
                        </View>
                    )}
                    <View style={styles.profileInfo}>
                        <Text style={styles.infoText}>{currentUser?.firstName} {currentUser?.lastName}</Text>
                        <Text style={styles.infoText}>Status : {currentUser?.status}</Text>
                        <View style={styles.rating}>
                            {currentUser?.averageRating ? (
                                <TouchableOpacity style={styles.rating} onPress={()=>navigation.navigate('Reviews')} >
                                    <AirbnbRating   
                                        count={5}
                                        defaultRating={currentUser?.averageRating > 1 ? currentUser?.averageRating: 1}
                                        size={20}
                                        showRating={false}
                                        isDisabled={true}
                                        unSelectedColor={theme.white}
                                    />
                                    <Text style={styles.infoText}>({currentUser?.ratingCount} Reviews) </Text>
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
                <BarItem item="MyPosts" icon='fa-solid fa-list' label="My Posts" />
                <BarItem item="Contractors" icon='fa-solid fa-user-group' label="Contractors" />
                <BarItem item="ProfileScreen" icon='fa-solid fa-gear' label="My Whaiky" />
                <BarItem item="Marklist" icon='fa-regular fa-star' label="Marklist" />
                {currentUser && currentUser.status === 'admin' && (
                    <BarItem item="Dashboard" icon={faDesktop} label="Dashboard" />
                )}
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
        paddingVertical: 20,
        alignItems: 'center',
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
      paddingLeft: 10,
    },
    gradientWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 20,
      borderRadius: 5,
      width: '100%',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderColor: theme.black,
      borderWidth: .5,
    },
    default: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 20,
      borderRadius: 10,
      width: '100%',
      paddingHorizontal: 15,
      paddingVertical: 10,
    },
    profileContainer: {
      width: '100%',
      height: 200,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    profileWrapper: {
        flexDirection: 'row',
    },
    profileInfo: {
        marginLeft: 20,
        justifyContent: 'space-around',
        height: 100,
        
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: theme.white,
    },
    rating: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
        width: 100,
        borderWidth: .5,
        borderRadius : 10,
        borderColor: theme.white,
    },
    infoText: {
        color: theme.white,
        fontSize: 16,
    },
    barFooter: {
        position: 'absolute',
        bottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        padding: 10,
    },
    footerText: {
        color: theme.text,
        fontSize: 16,
    },
  });
  }