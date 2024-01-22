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

        // Listen for changes in the user's document
        const unsubscribeUserDoc = userRef.onSnapshot((docSnapshot) => {
          if (docSnapshot.exists) {
            const userData = docSnapshot.data();
            setCurrentUser({
              ...userData,
              uid: user.uid, // Ensure uid is always set
            });
          } else {
            console.log('User does not exist in Firestore');
            showMessage({
              message: 'User does not exist in Firestore',
              type: 'danger',
            });
            // Consider setting currentUser to null if the Firestore document doesn't exist
            setCurrentUser(null);
          }
          setLoading(false); // Set loading to false here
        });
        return () => unsubscribeUserDoc();
      } else {
        setCurrentUser(null);
        setLoading(false); // Set loading to false here as well
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  return useContext(AuthContext);
};
