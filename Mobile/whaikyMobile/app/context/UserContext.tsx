import React, { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../FirebaseConfig';

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

interface UserContextProps {
  currentUser: User | null;
  setCurrentUser: Dispatch<SetStateAction<User | null>>;
  menuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
}

// Using UserContextProps for createContext
const UserContext = createContext<UserContextProps>({
  currentUser: null,
  setCurrentUser: () => null,
  menuOpen: false,
  setMenuOpen: () => false,
  loading: true,
});

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);  


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          avatarURL: user.photoURL,
          // Add more fields as needed
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false); 
    });

    // Cleanup
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, menuOpen, setMenuOpen, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
