import React, { createContext, useContext, useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const AuthContext = createContext({
  currentUser: null,
  setCurrentUser: () => null,
  loading: true,
  profile: 'incomplete', // Track profile completion status
  setProfile: () => null, // Function to update profile status
});

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState('incomplete'); // Initialize profile status

  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged(user => {
      if (user) {
        // If there is a user, start listening to the user's document
        const unsubscribeUser = firestore().collection('users').doc(user.uid).onSnapshot(doc => {
          if (doc.exists) {
            const userData = doc.data();
            setCurrentUser({
              ...userData,
              uid: user.uid,
              email: user.email,
            });
            const isProfileComplete = checkProfileCompletion(userData);
            setProfile(isProfileComplete ? 'completed' : 'incomplete');
          } else {
            setCurrentUser(null);
            setProfile('incomplete');
          }
          setLoading(false); // Set loading to false after getting user data
        }, error => {
          console.error('Error listening to user data:', error);
          setLoading(false); // Set loading to false even if there's an error
        });
  
        return () => unsubscribeUser();
      } else {
        setCurrentUser(null);
        setProfile('incomplete');
        setLoading(false); // Set loading to false if there is no user
      }
    });
  
    return () => unsubscribeAuth();
  }, []);
  

  const checkProfileCompletion = (userData) => {
    // Implement the logic to check if the profile is complete
    const {
      firstName,
      lastName,
      country,
      state,
      city,
      phoneNumbers,
    } = userData;

    return (
      firstName &&
      lastName &&
      country &&
      state &&
      city &&
      Array.isArray(phoneNumbers) &&
      phoneNumbers.length > 0
    );
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        loading,
        profile, // Provide profile status in the context
        setProfile, // Provide function to update profile status
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
