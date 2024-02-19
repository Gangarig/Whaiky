import React, { createContext, useContext, useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';
import TermsModal from '../components/TermsModal'; 
import Loading from '../components/Loading';

export const AuthContext = createContext({
  currentUser: null,
  loading: true,
  showTermsModal: false, 
});

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTermsModal, setShowTermsModal] = useState(false); 
  const [showLoading, setShowLoading] = useState(false); 

  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged(async (user) => {
      if (user) {
        const userRef = firestore().collection('users').doc(user.uid);
        
        const unsubscribeUserDoc = userRef.onSnapshot(async (docSnapshot) => {
          if (docSnapshot.exists) {
            const userData = docSnapshot.data();

            // Check if TermsAndConditions is not agreed
            if (userData.TermsAndConditions !== 'agreed') {
              setShowTermsModal(true); // Show the TermsModal
            }

            setCurrentUser({ ...userData, uid: user.uid });
          } else {
            // If the user document does not exist, consider showing the TermsModal as part of the user onboarding
            setShowTermsModal(true);
            // Set default user data here as before
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

  const handleSignOut = async () => {
    // Your existing sign-out logic
  };

  const handleAcceptTerms = async () => {
    if (currentUser && currentUser.uid) {
      await firestore().collection('users').doc(currentUser.uid).update({
        TermsAndConditions: 'agreed',
      });
      setShowTermsModal(false); // Hide the modal after acceptance
      showMessage({ message: 'Terms and Conditions accepted', type: 'success' });
    }
  };

  const handleDisagree = async () => {
    setShowTermsModal(false);
    setShowLoading(true); 

    setTimeout(async () => {
      await auth().signOut();
      setShowLoading(false); 
      showMessage({ message: 'You must agree to the Terms and Conditions to continue', type: 'danger' });
    }, 500); 
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, setCurrentUser, showTermsModal, handleAcceptTerms }}>
      {showTermsModal && <TermsModal visible={showTermsModal} onAccept={handleAcceptTerms} onClose={() => handleDisagree()} />}
      {showLoading ? <Loading /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
