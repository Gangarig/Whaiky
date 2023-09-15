import React, { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export interface User {
  email?: string | null;
  uid?: string;
  photoURL?: string | null;
  country?: string;
  state?: string;
  city?: string;
  phones?: string[];
  firstName?: string;
  lastName?: string;
  displayName?: string;
  createdAt?: Date | number;
  personalInfo?: string;
  legalInfo?: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextProps {
  currentUser: User | null;
  setCurrentUser: Dispatch<SetStateAction<User | null>>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  currentUser: null,
  setCurrentUser: () => null,
  loading: true,
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async user => {
      try {
        if (user) {
          const userDoc = await firestore().collection('users').doc(user.uid).get();
          if (userDoc.exists) {
            const userData = userDoc.data() as User;
            setCurrentUser({
              ...userData,
              uid: user.uid,
              email: user.email,
              photoURL: user.photoURL,
            });
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
  

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
