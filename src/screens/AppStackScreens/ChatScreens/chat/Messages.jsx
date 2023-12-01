import React, { useEffect, useState, useRef } from "react";
import { FlatList, Text, StyleSheet, View } from "react-native";
import firestore from "@react-native-firebase/firestore";
import Message from "./Message";
import { useChat } from "../../../../context/ChatContext";
import Colors from "../../../../constant/Colors";
import { showMessage } from "react-native-flash-message";

const PAGE_SIZE = 10;

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { data } = useChat();
  const flatListRef = useRef(null);

  useEffect(() => {
    if (!data.chatId || data.chatId === "null") {
      console.warn("Invalid chatId:", data.chatId);
      return;
    }
    const unsubscribeFromNewMessages = listenForNewMessages();
    return () => unsubscribeFromNewMessages();
  }, [data.chatId]);

  const listenForNewMessages = () => {
    return firestore()
      .collection("chats")
      .doc(data.chatId)
      .collection("messages")
      .orderBy("timestamp", "desc")
      .limit(PAGE_SIZE)
      .onSnapshot((querySnapshot) => {
        if (!querySnapshot.empty) {
          const newMessages = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
          setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
          setMessages(prevMessages => {
            if (prevMessages.length > 0 && prevMessages[0].id === newMessages[0].id) {
              return prevMessages;
            }
            return newMessages;
          });
          if (isInitialLoading) {
            setIsInitialLoading(false);
            scrollToBottom();
          }
        }
      }, (error) => {
        showMessage({
          message: error.message,
          type: "danger",
        });
      });
  };

  const scrollToBottom = () => {
    if (flatListRef.current) {
      // Using setTimeout to allow the FlatList to finish updating its content before scrolling
      setTimeout(() => flatListRef.current.scrollToEnd({ animated: true }), 100);
    }
  };

  const onImageLoad = () => {
    scrollToBottom();
  };

  return (
    <FlatList
      ref={flatListRef}
      data={messages}
      renderItem={({ item }) => <Message message={item} onImageLoad={onImageLoad} />}
      keyExtractor={(item) => item.id.toString()}
      ListEmptyComponent={<Text style={styles.noMessages}>No messages yet.</Text>}
      style={styles.messageList}
      inverted
      onContentSizeChange={() => !isInitialLoading && scrollToBottom()} // Scroll when content size changes
    />
  );
};

const styles = StyleSheet.create({
  messageList: {
    backgroundColor: Colors.background,
  },
  noMessages: {
    textAlign: 'center',
    marginTop: 20,
    color: 'grey',
    fontSize: 16,
  },
});

export default Messages;
