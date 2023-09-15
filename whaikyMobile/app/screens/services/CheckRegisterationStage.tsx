import React, { useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { getDoc, doc } from 'firebase/firestore';
import { firestore } from '../../../FirebaseConfig';
import { useUser } from '../../context/UserContext';

const CheckRegistrationStage = () => {
  const { currentUser } = useUser();

  useEffect(() => {
    const checkRegistrationStatus = async () => {
      if (currentUser?.uid) {
        const userDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData?.personalInfo === 'incomplete') {
            Alert.alert("Incomplete Profile", "You have missing fields in your profile. Please complete them.");
          }
        }
      }
    };

    checkRegistrationStatus();
  }, [currentUser]);

  return (
    <View>
      <Text>CheckRegistrationStage</Text>
    </View>
  );
};

export default CheckRegistrationStage;
