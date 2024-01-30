import React, { createContext, useContext, useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';

export const AuthContext = createContext({
  currentUser: null,
  loading: true,
});

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged(async (user) => {
      if (user) {
        const userRef = firestore().collection('users').doc(user.uid);
        const documentRef = firestore().collection('users').doc(user.uid).collection('documents');

        const unsubscribeUserDoc = userRef.onSnapshot(async (docSnapshot) => {
          if (docSnapshot.exists) {
            const userData = docSnapshot.data();

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
            // User document does not exist, set default values
            await userRef.set({
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
              status: 'user', // Default status
              timeStamp: firestore.FieldValue.serverTimestamp(),
              photoURL: '',
              country: '',
              city: '',
              state: '',
              phoneNumbers: '',
              services: [],
            });
            setCurrentUser({
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
              status: 'user',
              photoURL: '',
              country: '',
              city: '',
              state: '',
              phoneNumbers: '',
              services: [],
            });
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
      showMessage({ message: 'Signed out successfully', type: 'info' });
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
