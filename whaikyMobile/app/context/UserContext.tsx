import React, { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth ,firestore } from '../../FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';


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
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (user) {
        // Fetch userName from Firestore based on uid
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        // If the user exists in Firestore
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            photoURL: user.photoURL,
            displayName: userData.displayName,
            personalInfo:userData.personalInfo,
            legalInfo:userData.legalInfo 
            
            // Add more fields as needed
          });
        } else {
          // User not found in Firestore. You can decide how to handle this case.
        }
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
