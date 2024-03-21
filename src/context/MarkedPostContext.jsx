import React, { createContext, useContext, useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from './AuthContext';

const MarkedPostsContext = createContext();

export const useMarkedPosts = () => useContext(MarkedPostsContext);

export const MarkedPostsProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const [markedPosts, setMarkedPosts] = useState(new Set());

    useEffect(() => {
        let unsubscribe = () => {};

        if (currentUser) {
            const fetchMarkedPosts = () => {
       
                unsubscribe = firestore()
                    .collection('users')
                    .doc(currentUser.uid)
                    .collection('markedPosts')
                    .onSnapshot(snapshot => {
                        const savedMarkedPosts = snapshot.docs.map(doc => doc.id);
                        setMarkedPosts(new Set(savedMarkedPosts));
                    }, error => {
                        console.error("Error fetching real-time marked posts:", error);
                    });
            };

            fetchMarkedPosts();
        } else {
            setMarkedPosts(new Set());
        }

        
        return () => unsubscribe();
    }, [currentUser]);

    const value = {
        markedPosts,
        setMarkedPosts, 
    };

    return <MarkedPostsContext.Provider value={value}>{children}</MarkedPostsContext.Provider>;
};
