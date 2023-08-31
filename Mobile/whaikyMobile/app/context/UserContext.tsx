import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import {auth} from '../../FirebaseConfig';
export interface User {
  email?: string | null;
  uid?: string;
  avatarURL?: string | null;
  country?: string;
  region?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  userName?: string;
  createdAt?: Date | number;
}

interface UserProviderProps {
  children: ReactNode;
}

const UserContext = createContext<{
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
}>({
  currentUser: null,
  setCurrentUser: () => null,
});

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        // User is signed in
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          avatarURL: user.photoURL,
          // ... You can add more fields here
        });
      } else {
        // User is signed out
        setCurrentUser(null);
      }
    });

    // Cleanup
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
