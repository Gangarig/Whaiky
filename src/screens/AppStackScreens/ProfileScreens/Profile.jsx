import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, StyleSheet, SafeAreaView, ScrollView ,TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';
import { useAuth } from '../../../context/AuthContext';
import defaultAvatar from '../../../assets/images/avatar/avatar.png';
import { Global } from '../../../constant/Global';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import { shadowStyle } from '../../../constant/Shadow';
import  Colors  from '../../../constant/Colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

const Profile = ({ navigation }) => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser?.uid) {
        const userDocRef = firestore().collection('users').doc(currentUser.uid);

        const unsubscribe = userDocRef.onSnapshot((doc) => {
          if (doc.exists) {
            setUserData(doc.data());
          }
        });

        return () => {
          unsubscribe();
        };
      }
    };

    fetchData();
  }, [currentUser]);
  
  const handleContractor = async () => {

    try {
      if (currentUser?.uid) {
        const querySnapshot = await firestore()
          .collection('users')
          .doc(currentUser.uid)
          .collection('documents')
          .where('status', '==', 'approved')
          .get();
  
        if (!querySnapshot.empty) {
          // At least one document with status 'approved' exists, navigate to 'Contractor' screen
          navigation.navigate('Contractor'); // Replace 'Contractor' with your actual screen name
        } else {
          // No document with status 'approved' found, navigate to 'Services' screen
          navigation.navigate('Services'); // Replace 'Services' with your actual screen name
        }
      } else {
        // Handle the case where user document does not exist
        showMessage({
          message: 'User document not found.',
          type: 'danger',
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      showMessage({
        message: 'An error occurred while fetching user data.',
        type: 'danger',
      });
    }
  };
  
  
  return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {userData && (
          <LinearGradient
            colors={['#9E41F0', '#4C7BC0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.profileContainer]}
          >
            <View style={styles.avatarWrapper}>
            <FastImage
              source={
                userData.photoURL
                  ? { uri: userData.photoURL }
                  : defaultAvatar
              }
              style={styles.avatar}
            />
          <TouchableOpacity onPress={()=>navigation.navigate('PersonalInfo')} style={styles.Edit}>
             <FontAwesomeIcon icon='fa-solid fa-pen-to-square' color='#fff' size={32} />
          </TouchableOpacity>
            </View>
            <Text style={[styles.nameText]}>{userData.displayName || 'N/A'}</Text>
            <View style={styles.infoWrapper}>
              <View style={styles.infoBox}>
                <Text style={[styles.infoText]}>First Name:</Text>
                <Text style={[styles.infoText]}>{userData.firstName || 'N/A'}</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={[styles.infoText]}>Last Name:</Text>
                <Text style={[styles.infoText]}>{userData.lastName || 'N/A'}</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={[styles.infoText]}>Email:</Text>
                <Text style={[styles.infoText]}>{userData.email || 'N/A'}</Text>
                </View>
              <View style={styles.infoBox}>
                <Text style={[styles.infoText]}>Phone:</Text>
                <Text style={[styles.infoText]}>{userData.phoneNumbers[0] || 'N/A'}</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={[styles.infoText]}>Country:</Text>
                <Text style={[styles.infoText]}>{userData.country || 'N/A'}</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={[styles.infoText]}>City:</Text>
                <Text style={[styles.infoText]}>{userData.city || 'N/A'}</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={[styles.infoText]}>State:</Text>
                <Text style={[styles.infoText]}>{userData.state || 'N/A'}</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={[styles.infoText]}>City:</Text>
                <Text style={[styles.infoText]}>{userData.city || 'N/A'}</Text>
              </View>
              <View style={styles.infoBox}>
              <Text style={[styles.infoText]}>Created:</Text>
                <Text style={[styles.infoText]}>
                {userData.createdAt
                ? new Date(userData.createdAt).toLocaleDateString()
                : 'N/A'}
                </Text>
              </View>
            </View>
          </LinearGradient>
        )}
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 30,
    gap: 10,
    ...shadowStyle,
    flex: 1,
    width: '100%',
  },
  profileContainer: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  avatar: {
    width: 114,
    height: 119,
    borderWidth: 2,
    borderColor: Colors.white,
    borderRadius: 100,
  },
  nameText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: Colors.white,
    paddingBottom: 10,
  },
  infoWrapper: {
    width: '100%',
    gap: 5,
    paddingBottom: 80,
  },
  infoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
  },
  avatarWrapper:{
    position:'relative',
  },
  Edit:{
    position:'absolute',
    right:0,
    bottom:0,
    ...shadowStyle,
  }
});

export default Profile;
