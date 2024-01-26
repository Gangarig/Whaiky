import React, { createContext, useContext, useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';
import TermsModal  from '../components/TermsModal';

export const AuthContext = createContext({
  currentUser: null,
  loading: true,
});

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [termsModalVisible, setTermsModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged(async (user) => {
      if (user) {
        const userRef = firestore().collection('users').doc(user.uid);
        const unsubscribeUserDoc = userRef.onSnapshot((docSnapshot) => {
          if (docSnapshot.exists) {
            const userData = docSnapshot.data();
            if (userData.TermsAndConditions !== 'agreed') {
              setTermsModalVisible(true); // Show terms modal
            } else {
              setCurrentUser({
                ...userData,
                uid: user.uid, // Ensure uid is always set
              });
            }
          } else {
            console.log('User does not exist in Firestore');
            setCurrentUser(null);
          }
          setLoading(false);
        });
        return () => unsubscribeUserDoc();
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);
  
  const handleAcceptTerms = async () => {
    // Update Firestore to reflect that the user has accepted the terms
    const user = auth().currentUser;
    if (user) {
      await firestore().collection('users').doc(user.uid).set({ TermsAndConditions: 'agreed' }, { merge: true });
      setTermsModalVisible(false);
      showMessage({ message: 'Terms and Conditions accepted', type: 'success' });
    }
  };

  const handleSignOut = async () => {
    try {
      await auth().signOut();
      showMessage({ message: 'Signed out successfully', type: 'info' });
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };


  return (
    <AuthContext.Provider value={{ currentUser, loading, setCurrentUser }}>
      {children}
      {termsModalVisible && (
        <TermsModal
        visible={termsModalVisible}
        onAccept={handleAcceptTerms}
        onClose={() => {
          setTermsModalVisible(false);
          handleSignOut(); 
        }}
      />
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
