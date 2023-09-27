import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, StyleSheet, SafeAreaView,ScrollView } from 'react-native';
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
      <ScrollView>
      {userData && (
        <View>
          <Image source={{ uri: userData.photoURL }} style={styles.avatar} />
          <Text style={styles.text}>Email: {userData.email || 'N/A'}</Text>
          <Text style={styles.text}>UID: {userData.uid || 'N/A'}</Text>
          <Text style={styles.text}>Avatar URL: {userData.photoURL || 'N/A'}</Text>
          <Text style={styles.text}>Country: {userData.country || 'N/A'}</Text>
          <Text style={styles.text}>State: {userData.state || 'N/A'}</Text>
          <Text style={styles.text}>City: {userData.city || 'N/A'}</Text>
          <Text style={styles.text}>Phone: {userData.phone || 'N/A'}</Text>
          <Text style={styles.text}>First Name: {userData.firstName || 'N/A'}</Text>
          <Text style={styles.text}>Last Name: {userData.lastName || 'N/A'}</Text>
          <Text style={styles.text}>User Name: {userData.displayName || 'N/A'}</Text>
          <Text style={styles.text}>
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
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  text: {
    marginBottom: 8,
  },
  buttonContainer: {
    marginTop: 16,
  },
});

export default Profile;
