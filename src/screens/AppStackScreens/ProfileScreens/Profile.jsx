import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import defaultAvatar from '../../../assets/images/avatar/avatar.png';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import { shadowStyle } from '../../../constant/Shadow';
import { useTheme } from '../../../context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'

const Profile = ({ navigation }) => {
  const { currentUser } = useAuth();
  const theme = useTheme();
  const styles = getStyles(theme);
  if (!currentUser) {
    return (
      <View style={styles.centered}>
        <Text>No user data found.</Text>
      </View>
    );
  }
  const handleContractor = () => {
    navigation.navigate('Services');
  }

  const convertTimestampToDate = (timestamp) => {
    if (!timestamp) {
      return 'N/A';
    }
    // Convert UNIX timestamp (in milliseconds) to a Date object
    const date = new Date(timestamp);
    // Format the date to a readable string
    return date.toLocaleDateString("en-US"); // Change "en-US" to your preferred locale
  };

  return (
  <ScrollView style={styles.container}>
    <View style={styles.LinearGradientWrapper}>
      <LinearGradient
        colors={[theme.primary, theme.secondary]}
        start={{ x: .5, y: 0 }}
        end={{ x: 2, y:  1}}        
        style={styles.profileContainer}
      >
        <View style={styles.avatarWrapper}>
          <FastImage
            source={currentUser.photoURL ? { uri: currentUser.photoURL } : defaultAvatar}
            style={styles.avatar}
          />
          <TouchableOpacity onPress={() => navigation.navigate('PersonalInfo')} style={styles.Edit}>
            <FontAwesomeIcon icon={faPenToSquare} color='#fff' size={30} />
          </TouchableOpacity>
        </View>
        <Text style={styles.nameText}>{currentUser.displayName}</Text>
        <View style={styles.infoWrapper}>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>First Name:</Text>
            <Text style={styles.infoText}>{currentUser.firstName || 'N/A'}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>Last Name:</Text>
            <Text style={styles.infoText}>{currentUser.lastName || 'N/A'}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>Email:</Text>
            <Text style={styles.infoText}>{currentUser.email || 'N/A'}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>Phone:</Text>
            <Text style={styles.infoText}>{currentUser.phoneNumber || 'N/A'}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>Country:</Text>
            <Text style={styles.infoText}>{currentUser.country || 'N/A'}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>State:</Text>
            <Text style={styles.infoText}>{currentUser.state || 'N/A'}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>City:</Text>
            <Text style={styles.infoText}>{currentUser.city || 'N/A'}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>Status:</Text>
            <Text style={styles.infoText}>{currentUser.status || 'N/A'}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>Created:</Text>
            <Text style={styles.infoText}>
              {convertTimestampToDate(currentUser.timeStamp)}
            </Text>
          </View>
        </View>
      </LinearGradient>

          {currentUser.status == 'user' && (
            <View style={styles.LinearGradientWrapper}>
            <LinearGradient
            colors={[theme.primary, theme.secondary]}
            start={{ x: .5, y: 0 }}
            end={{ x: 2, y:  1}}   
              style={styles.profileContainer}
              >
                <TouchableOpacity onPress={handleContractor}>
                  <Text style={[styles.btnText]}>Become a Contractor</Text>
                </TouchableOpacity>
            </LinearGradient>
            </View>
          )}
          {currentUser.status == 'contractor' && (
            <View style={styles.LinearGradientWrapper}>
            <LinearGradient
            colors={[theme.primary, theme.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1.5, y:  1}}   
              style={styles.profileContainer}
              >
                  <View style={styles.contractorLinks}>
                    <TouchableOpacity style={styles.linkWrapper} onPress={()=>navigation.navigate('DocumentUpload')}>
                      <Text style={[styles.btnText]}>Upload Document</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.linkWrapper} onPress={()=>navigation.navigate('Certificate')}>
                      <Text style={[styles.btnText]}>Upload Certificate</Text>
                    </TouchableOpacity>
                  </View>
            </LinearGradient>
            </View>
          )}
    </View>
    {!currentUser && (
      <View>
        <Text>No user data found.</Text>
      </View>
    )}
  </ScrollView>

  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.background,
    flex: 1,
    width: '100%',
    paddingVertical: 20,
  },
  LinearGradientWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadowStyle,
    paddingBottom: 100,
    paddingTop: 20,
  },
  profileContainer: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    minWidth: 300,
    width: '90%',
  },
  contractorLinks: {
    gap: 15,
  },
  linkWrapper: {
    borderBottomColor: theme.white,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 114,
    height: 119,
    borderWidth: 2,
    borderColor: theme.white,
    borderRadius: 100,
    backgroundColor: theme.background,
  },
  nameText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: theme.white,
    paddingBottom: 10,
  },
  btnText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.white,
  },
  infoWrapper: {
    width: '100%',
    gap: 5,
    paddingBottom: 80,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  infoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  infoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.white,
  },
  avatarWrapper: {
    position: 'relative',
  },
  Edit: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    ...shadowStyle,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default Profile;
