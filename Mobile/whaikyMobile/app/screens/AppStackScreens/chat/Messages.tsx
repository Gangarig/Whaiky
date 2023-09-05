import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, View, FlatList } from 'react-native';
import { doc, onSnapshot } from 'firebase/firestore';
import { firestore } from '../../../../FirebaseConfig';
import { ChatContext } from '../../../context/ChatContext';
import { useUser } from '../../../context/UserContext';
import Message from './Message'; 

interface Message {
  id: string;
  senderId: string;
  text: string;
  img?: string;
}

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { data }:any = useContext(ChatContext);

  useEffect(() => {
    const unSub = onSnapshot(doc(firestore, 'chats', data.chatId), (doc) => {
      setMessages(doc.data()?.messages || []);
    });
  
    return () => {
      unSub();
    };
  }, [data.chatId]);
  

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={messages}
        renderItem={({ item }) => <Message message={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default Messages;
