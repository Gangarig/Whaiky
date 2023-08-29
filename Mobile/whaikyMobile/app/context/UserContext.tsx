import React, { useState, useEffect, useContext } from 'react';
import { auth } from '../../FirebaseConfig';

type User = {
  uid: string;
  email: string | null;
} | null;

interface UserProviderProps {
    children: React.ReactNode;
  }


const UserContext = React.createContext<User>(null);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          // ...other properties you want to track
        });
      } else {
        setCurrentUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={currentUser}>
      {children}
    </UserContext.Provider>
  );
};

export const useCurrentUser = (): User => {
  return useContext(UserContext);
};
