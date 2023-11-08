import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { Global } from '../../../style/Global';
import { showMessage } from 'react-native-flash-message';
import defaultAvatar from '../../../assets/images/avatar/avatar.png';

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
        const userDocRef = firestore().collection('users').doc(currentUser.uid);
  
        const userDoc = await userDocRef.get();
        if (userDoc.exists) {
          const userData = userDoc.data();
  
          // Check if legalInfo status is completed
          if (userData.legalInfo === 'completed') {
            // Navigate to the Contractor page
            navigation.navigate('Contractor');
          } else {
            // Navigate to the Services page
            navigation.navigate('Services');
          }
        } else {
          // Handle the case where user document does not exist
          showMessage({
            message: 'User document not found.',
            type: 'danger',
          });
        }
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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {userData && (
          <View style={styles.profileContainer}>
            <Image source={
              userData.photoURL
                ? { uri: userData.photoURL }
                : defaultAvatar
            } style={styles.avatar} />
            <Text style={styles.nameText}>{userData.displayName || 'N/A'}</Text>
            <Text style={styles.infoText}>First Name: {userData.firstName || 'N/A'}</Text>
            <Text style={styles.infoText}>Last Name: {userData.lastName || 'N/A'}</Text>
            <Text style={styles.infoText}>Email: {userData.email || 'N/A'}</Text>
            <Text style={styles.infoText}>UID: {userData.uid || 'N/A'}</Text>
            <Text style={styles.infoText}>Country: {userData.country || 'N/A'}</Text>
            <Text style={styles.infoText}>State: {userData.state || 'N/A'}</Text>
            <Text style={styles.infoText}>City: {userData.city || 'N/A'}</Text>
            <Text style={styles.infoText}>Phone Numbers:</Text>
            {userData.phoneNumbers && userData.phoneNumbers.length > 0 ? (
              userData.phoneNumbers.map((phoneNumber, index) => (
                <Text key={index} style={styles.infoText}>
                  {phoneNumber}
                </Text>
              ))
            ) : (
              <Text style={styles.infoText}>N/A</Text>
            )}
            <Text style={styles.infoText}>
              Created At: {userData.createdAt ? new Date(userData.createdAt).toLocaleString() : 'N/A'}
            </Text>
          </View>
        )}
        <View style={styles.buttonContainer}>
          <Button title="Complete Profile" onPress={() => navigation.navigate('PersonalInfo')} />
          <Button title="Become a Contractor" onPress={handleContractor} />
          <Button title="Log Out" onPress={() => auth().signOut()} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF', 
  },
  scrollContainer: {
    padding: 16,
  },
  profileContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 16,
    shadowColor: 'rgba(0, 0, 0, 0.2)', // Shadow color
    shadowOpacity: 1, // Shadow opacity
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    elevation: 2, // Android shadow
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  nameText: {
    fontSize: 24, // Larger font size for the name
    fontWeight: 'bold', // Bold text for the name
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
  },
  buttonContainer: {
    marginTop: 16,
  },
});

export default Profile;
