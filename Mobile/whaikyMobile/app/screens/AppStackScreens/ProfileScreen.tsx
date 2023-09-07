import React, { useEffect, useState } from 'react';
import { View, Text, Button , Image } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { auth } from '../../../FirebaseConfig';
import { useUser } from '../../context/UserContext';
import { doc, getDoc, DocumentData } from 'firebase/firestore';
import { firestore } from '../../../FirebaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const ProfileScreen = ({ navigation }: RouterProps) => {
  const { currentUser } = useUser();
  const [userData, setUserData] = useState<DocumentData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser?.uid) {
        const userDoc = doc(firestore, 'users', currentUser.uid);
        const userSnap = await getDoc(userDoc);

        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }
      }
    };

    fetchData();
  }, [currentUser]);

  return (
    <SafeAreaView>
    <View>
      {/* Display user information fetched from Firestore */}
      <Button title='Complete Registration' onPress={()=>navigation.navigate('complete')} />
      <Button title='Become a Contractor' onPress={()=>navigation.navigate('complete')} />
      {userData && (
        <View>
          <Image source={ userData.photoURL } style={{ width: 100, height: 100 }}/>
          
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
      <Button title='Log Out' onPress={() => auth.signOut()} />
    </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
