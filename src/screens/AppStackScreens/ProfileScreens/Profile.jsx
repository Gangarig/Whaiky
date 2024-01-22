import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';
import { useAuth } from '../../../context/AuthContext';
import defaultAvatar from '../../../assets/images/avatar/avatar.png';
import { Global } from '../../../constant/Global';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import { shadowStyle } from '../../../constant/Shadow';
import Colors from '../../../constant/Colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'

const Profile = ({ navigation }) => {
  const { currentUser } = useAuth();

  
  if (!currentUser) {
    return (
      <View style={styles.centered}>
        <Text>No user data found.</Text>
      </View>
    );
  }



  return (
    <ScrollView style={styles.container}>
      <View style={styles.LinearGradientWrapper}>
          <LinearGradient
            colors={['#9E41F0', '#4C7BC0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
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
                <Text style={styles.infoText}>{currentUser.firstName}</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>Last Name:</Text>
                <Text style={styles.infoText}>{currentUser.lastName}</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>Email:</Text>
                <Text style={styles.infoText}>{currentUser.email}</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>Phone:</Text>
                <Text style={styles.infoText}>{currentUser.phoneNumbers[0]}</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>Country:</Text>
                <Text style={styles.infoText}>{currentUser.country}</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>State:</Text>
                <Text style={styles.infoText}>{currentUser.state}</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>City:</Text>
                <Text style={styles.infoText}>{currentUser.city}</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>Status:</Text>
                <Text style={styles.infoText}>{currentUser.status}</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>Created:</Text>
                <Text style={styles.infoText}>
                  {currentUser.timeStamp ? new Date(currentUser.timeStamp).toLocaleDateString() : ''}
                </Text>
              </View>
            </View>
          </LinearGradient>

          <View style={styles.LinearGradientWrapper}>
              <LinearGradient
              colors={['#9E41F0', '#4C7BC0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.profileContainer}
            > 
              {currentUser.status == 'user' && (
              <TouchableOpacity onPress={handleContractor}>
                <Text style={[styles.btnText]}>Become a Contractor</Text>
              </TouchableOpacity>
              )}
              {currentUser.status == 'contractor' && (
                <View style={styles.contractorLinks}>
                <TouchableOpacity style={styles.linkWrapper} onPress={()=>navigation.navigate('DocumentUpload')}>
                  <Text style={[styles.btnText]}>Upload Document</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.linkWrapper} onPress={()=>navigation.navigate('Certificate')}>
                  <Text style={[styles.btnText]}>Upload Certificate</Text>
                </TouchableOpacity>
                </View>
              )}
              {currentUser.status == 'admin' && (
                <View style={styles.contractorLinks}>
                  <TouchableOpacity style={styles.linkWrapper} onPress={()=>navigation.navigate('DashBoard')}>
                    <Text style={[styles.btnText]}>DashBoard</Text>
                  </TouchableOpacity>
                  </View>
                )  
              }
            </LinearGradient>
          </View>
      </View>
      {!currentUser && (
        <View>
          <Text>No user data found.</Text>
        </View> 
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
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
  },
  contractorLinks: {
    gap: 15,
  },
  linkWrapper: {
    borderBottomColor: Colors.white,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 114,
    height: 119,
    borderWidth: 2,
    borderColor: Colors.white,
    borderRadius: 100,
    backgroundColor: Colors.background,
  },
  nameText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: Colors.white,
    paddingBottom: 10,
  },
  btnText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
  },
  infoWrapper: {
    width: '100%',
    gap: 5,
    paddingBottom: 80,
  },
  infoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 40,
  },
  infoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
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
