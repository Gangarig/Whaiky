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
  const setLoadingState = (value) => {
    setLoading(value); 
  }



  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged(async (user) => {
      if (user) {
        const userRef = firestore().collection('users').doc(user.uid);
        const documentRef = firestore().collection('users').doc(user.uid).collection('documents');
        const unsubscribeUserDoc = userRef.onSnapshot(async (docSnapshot) => {
          if (docSnapshot.exists) {
            const userData = docSnapshot.data();
            if (userData.TermsAndConditions !== 'agreed') {
              setShowTermsModal(true);
            }
            // Only update status if not admin
            if (userData.status !== 'admin') {
            const docSnapshot = await documentRef.where('status', '==', 'approved').get();
            if (!docSnapshot.empty && userData.status !== 'contractor') {
            // User has at least one approved document and is not already a contractor
            await userRef.update({ status: 'contractor' });
            userData.status = 'contractor';
            }
          }
            setCurrentUser({ ...userData, uid: user.uid });
          } else {
            setShowTermsModal(true);
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
    try {
      await auth().signOut();
    } catch (error) {
      showMessage({ message: 'Error signing out', type: 'danger' });
    }
  };

  const handleAcceptTerms = async () => {
    if (currentUser && currentUser.uid) {
      await firestore().collection('users').doc(currentUser.uid).update({
        TermsAndConditions: 'agreed',
      });
      setShowTermsModal(false); 
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
    <AuthContext.Provider value={{ currentUser, loading,setLoadingState, setCurrentUser, showTermsModal, handleAcceptTerms }}>
      {showTermsModal && <TermsModal visible={showTermsModal} onAccept={handleAcceptTerms} onClose={() => handleDisagree()} />}
      {showLoading ? <Loading /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
