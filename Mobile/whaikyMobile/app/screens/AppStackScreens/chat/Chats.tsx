import React, { useEffect, useContext, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import { doc, onSnapshot } from 'firebase/firestore';
import { firestore } from '../../../../FirebaseConfig'; // Replace with your actual import
import { useUser } from '../../../context/UserContext'; // Replace with your actual import
import { ChatContext } from '../../../context/ChatContext'; // Replace with your actual import

const Chats: React.FC = () => {
  const [chats, setChats] = useState<Record<string, any>>({}); // Initialize as an object
  const { currentUser } = useUser();
  const { dispatch }:any = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(firestore, 'userChats', currentUser?.uid || ''), (docSnap) => {
        setChats(docSnap.data() || {}); // Ensure chats is always an object
      });

      return () => {
        unsub();
      };
    };

    if (currentUser?.uid) {
      const unsubscribe = getChats();
      return () => {
        unsubscribe();
      };
    }
  }, [currentUser?.uid]);

  const handleSelect = (u: any) => {
    dispatch({ type: 'CHANGE_USER', payload: u });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={Object.entries(chats).sort((a, b) => b[1].date - a[1].date)}
        keyExtractor={(item) => item[0]}
        renderItem={({ item }) => {
          const chat = item[1];
          return (
            <TouchableOpacity style={styles.userChat} onPress={() => handleSelect(chat.userInfo)}>
              <Image source={{ uri: chat.userInfo.photoURL }} style={styles.image} />
              <View style={styles.userChatInfo}>
                <Text>{chat.userInfo.displayName}</Text>
                <Text>{chat.lastMessage?.text}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userChat: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  userChatInfo: {
    marginLeft: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});

export default Chats;
