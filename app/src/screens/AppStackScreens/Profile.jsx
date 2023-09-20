import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, SafeAreaView } from 'react-native';
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
        const userDoc = await userDocRef.get();

        if (userDoc.exists) {
          setUserData(userDoc.data());
        }
      }
    };

    fetchData();
  }, [currentUser]);

  return (
    <SafeAreaView>
      <View>
        {userData && (
          <View>
            <Image source={{ uri: userData.photoURL }} style={{ width: 100, height: 100 }} />
            <Text>Email: {userData.email || 'N/A'}</Text>
            <Text>UID: {userData.uid || 'N/A'}</Text>
            <Text>Avatar URL: {userData.photoURL || 'N/A'}</Text>
            <Text>Country: {userData.country || 'N/A'}</Text>
            <Text>Region: {userData.region || 'N/A'}</Text>
            <Text>Phone: {userData.phone || 'N/A'}</Text>
            <Text>First Name: {userData.firstName || 'N/A'}</Text>
            <Text>Last Name: {userData.lastName || 'N/A'}</Text>
            <Text>User Name: {userData.displayName || 'N/A'}</Text>
            <Text>Created At: {userData.createdAt ? new Date(userData.createdAt).toLocaleString() : 'N/A'}</Text>
          </View>
        )}
                <Button title='Fill the personal Info forms' onPress={() => navigation.navigate('PersonalInfo')} />
        <Button title='Become a Contractor' onPress={() => navigation.navigate('LegalInfo')} />
        <Button title='Log Out' onPress={() => auth().signOut()} />
      </View>
    </SafeAreaView>
  );
};

export default Profile;
