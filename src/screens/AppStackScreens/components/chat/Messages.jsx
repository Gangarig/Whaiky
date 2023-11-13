import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import firestore from "@react-native-firebase/firestore";
import Message from "./Message";
import { useChat } from "../../context/ChatContext";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useChat();

  useEffect(() => {
    if (!data.chatId || data.chatId === "null") {
      console.warn("Invalid chatId:", data.chatId);
      return;
    }

    const unSub = firestore()
      .collection("chats")
      .doc(data.chatId)
      .onSnapshot((doc) => {
        const chatData = doc.data();
        if (chatData && chatData.messages) {
          setMessages(chatData.messages);
        } else {
          setMessages([]);
        }
      });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  return (
    <FlatList
      data={messages}
      renderItem={({ item }) => <Message message={item} />}
      keyExtractor={(item) => item.id}
    />
  );
};

export default Messages;
