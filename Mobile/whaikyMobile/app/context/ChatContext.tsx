import React, { createContext, useState, useContext, useEffect } from 'react';
import { firestore } from '../../FirebaseConfig';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export interface Message {
  id: string;
  text: string;
  createdAt: Date;
  userId: string;
}

interface ChatContextProps {
  messages: Message[];
  sendMessage: (text: string, userId: string) => void;
}

interface ChatProviderProps {
  children: React.ReactNode;
}

const ChatContext = createContext<ChatContextProps>({
  messages: [],
  sendMessage: () => {}
});

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }:ChatProviderProps) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const messagesCollection = collection(firestore, 'messages');
    const q = query(messagesCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, snapshot => {
      const fetchedMessages: Message[] = [];
      snapshot.forEach(doc => {
        const { id, ...restData } = doc.data() as Message;
        fetchedMessages.push({ id: doc.id, ...restData });
    });
    
      setMessages(fetchedMessages);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const sendMessage = (text: string, userId: string) => {
    // Add code to send a message to Firestore.
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  return useContext(ChatContext);
};
