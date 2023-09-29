import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../context/AuthContext';

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {userData && (
          <View style={styles.profileContainer}>
            <Image source={{ uri: userData.photoURL }} style={styles.avatar} />
            <Text style={styles.nameText}>{userData.displayName || 'N/A'}</Text>
            <Text style={styles.infoText}>Email: {userData.email || 'N/A'}</Text>
            <Text style={styles.infoText}>UID: {userData.uid || 'N/A'}</Text>
            <Text style={styles.infoText}>Avatar URL: {userData.photoURL || 'N/A'}</Text>
            <Text style={styles.infoText}>Country: {userData.country || 'N/A'}</Text>
            <Text style={styles.infoText}>State: {userData.state || 'N/A'}</Text>
            <Text style={styles.infoText}>City: {userData.city || 'N/A'}</Text>
            <Text style={styles.infoText}>Phone: {userData.phone || 'N/A'}</Text>
            <Text style={styles.infoText}>First Name: {userData.firstName || 'N/A'}</Text>
            <Text style={styles.infoText}>Last Name: {userData.lastName || 'N/A'}</Text>
            <Text style={styles.infoText}>
              Created At: {userData.createdAt ? new Date(userData.createdAt).toLocaleString() : 'N/A'}
            </Text>
          </View>
        )}
        <View style={styles.buttonContainer}>
          <Button title="Fill the personal Info forms" onPress={() => navigation.navigate('PersonalInfo')} />
          <Button title="Become a Contractor" onPress={() => navigation.navigate('LegalInfo')} />
          <Button title="Log Out" onPress={() => auth().signOut()} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5', // Facebook-like background color
  },
  scrollContainer: {
    padding: 16,
  },
  profileContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
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
