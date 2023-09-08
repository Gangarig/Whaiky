import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { View, FlatList, StyleSheet , Button } from "react-native";
import { useChat } from "../../../context/ChatContext";
import { firestore } from "../../../../FirebaseConfig";
import Message from "./Message";
interface MessageItem {
  id: string;
  date: string; 
  senderId: string;
  text: string;
  img: string | null;
}

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const { data } = useChat();


  useEffect(() => {
    if (!data.chatId || data.chatId === "null") {
      console.warn("Invalid chatId:", data.chatId);
      return;
    }
    const unSub = onSnapshot(doc(firestore, "chats", data.chatId), (doc) => {
      const chatData = doc.data();
      if (chatData && chatData.messages) {
        setMessages(chatData.messages as MessageItem[]);
      } else {
        setMessages([]);
      }
    });

    return () => {
      unSub();
    };
}, [data.chatId]);

  console.log(messages);
  console.log(data);
  return (
    <FlatList
      data={messages}
      renderItem={({ item }) => <Message message={item} />}
      keyExtractor={(item) => item.id}
     
    />

  );
};

export default Messages;
