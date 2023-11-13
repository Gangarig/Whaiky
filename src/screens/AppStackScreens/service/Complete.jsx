import { View, Text, Button } from 'react-native'
import React from 'react'
import GradientButton from '../style/GradientButton'
import { Global } from '../style/Global'
import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';
import { useAuth } from '../src/context/AuthContext';
import { useState } from 'react';

const Complete = ({ navigation }) => {
    const { currentUser } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state
  
    const submit = async () => {
      setIsSubmitting(true); // Start the loading state
      try {
        if (!currentUser || !currentUser.uid) {
          throw new Error('No current user found');
        }
        const submissionRef = firestore().collection('submission').doc(currentUser.uid);
        await submissionRef.set({
          userId: currentUser.uid,
          submittedAt: firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
        
        showMessage({ message: 'Submission Successful', type: 'success' });
        navigation.navigate('ProfileScreen');
      } catch (error) {
        showMessage({
          message: 'Submission Failed - Please try again later.',
          description: error.message,
          type: 'danger',
        });
        navigation.navigate('ProfileScreen');
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <View style={Global.container}>
        <GradientButton
          text="Send a Submission"
          onPress={submit}
          disabled={isSubmitting}
        />
        
      </View>
    );
  };
  
  export default Complete;
