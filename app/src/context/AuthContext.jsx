import React, { createContext, useContext, useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const AuthContext = createContext({
  currentUser: null,
  setCurrentUser: () => null,
  loading: true,
  personalInfoComplete: false, // Add personalInfoComplete to the context
  updatePersonalInfoComplete: () => null, // Function to update personalInfoComplete
});

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [personalInfoComplete, setPersonalInfoComplete] = useState(false); // Initialize personalInfoComplete

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      try {
        if (user) {
          const userDoc = await firestore().collection('users').doc(user.uid).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            setCurrentUser({
              ...userData,
              uid: user.uid,
              email: user.email,
            });
            
            // Check personal info completion and update personalInfoComplete
            const isPersonalInfoComplete = checkPersonalInfoCompletion(userData);
            setPersonalInfoComplete(isPersonalInfoComplete);
          } else {
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const checkPersonalInfoCompletion = (userData) => {
    // Implement your logic to check personal info completion here
    const {
      firstName,
      lastName,
      country,
      state,
      city,
      phoneNumbers,
      createdAt,
    } = userData;

    return (
      firstName &&
      lastName &&
      country &&
      state &&
      city &&
      phoneNumbers &&
      phoneNumbers.length > 0 &&
      createdAt
    );
  };

  const updatePersonalInfoComplete = (value) => {
    setPersonalInfoComplete(value);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        loading,
        personalInfoComplete, 
        updatePersonalInfoComplete, 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
