import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});
  const [userData, setUserData] = useState(null);
  const [userType, setUserType] = useState(null); // Add userType state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser && currentUser.displayName) {
        const q = query(
          collection(db, 'users'),
          where('displayName', '==', currentUser.displayName)
        );
        try {
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            setUserData(userData);
          } else {
            setUserData(null); // No data found
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  // Function to update userType
  const updateUserType = (newUserType) => {
    setUserType(newUserType);
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, userData, userType, updateUserType }} // Include userType and updateUserType
    >
      {children}
    </AuthContext.Provider>
  );
};
