import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Alert, StyleSheet } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useAuth } from "../../../../context/AuthContext";
import Colors from "../../../../constant/Colors";
import ProfileCard from "../../../../components/ProfileCard";
import showMessage from "react-native-flash-message";

const Chats = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    let unsubscribeFromUserChats;
    let unsubscribeFromChatMessages = [];

    if (currentUser?.uid) {
      unsubscribeFromUserChats = firestore()
        .collection("userChats")
        .doc(currentUser.uid)
        .onSnapshot(doc => {
          if (doc.exists) {
            handleSnapshot(doc);
            Object.keys(doc.data()).forEach(chatId => {
              const unsubscribe = firestore()
                .collection("chats")
                .doc(chatId)
                .onSnapshot(chatDoc => {
                  if (chatDoc.exists) {
                    updateLastMessageInState(chatId, chatDoc.data().lastMessage);
                  }
                }, handleError);
              unsubscribeFromChatMessages.push(unsubscribe);
            });
          }
        }, handleError);
    }

    return () => {
      if (unsubscribeFromUserChats) unsubscribeFromUserChats();
      unsubscribeFromChatMessages.forEach(unsubscribe => unsubscribe());
    };
  }, [currentUser]);

  const handleSnapshot = (doc) => {
    if (!doc.exists) {
      setChats([]);
      return;
    }
    const sortedChats = sortChats(doc.data());
    setChats(sortedChats);
  };

  const updateLastMessageInState = (chatId, lastMessageData) => {
    setChats(currentChats => currentChats.map(chat => 
      chat.chatId === chatId ? { ...chat, lastMessage: formatMessage(lastMessageData.text) } : chat
    ));
  };

  const sortChats = (chatData) => {
    return Object.entries(chatData)
      .map(([id, chat]) => ({
        ...chat,
        chatId: id,
        lastMessage: formatMessage(chat.lastMessage?.text || "No messages yet"),
        date: chat.date?.toDate().getTime() || 0,
      }))
      .sort((a, b) => b.date - a.date);
  };

  const handleError = (error) => {
    showMessage({
      message: error.message,
      type: "danger",
    });
  };

  const handleSelect = (chatId, userInfo) => {
    navigation.navigate("Chat", {
      chatId,
      userInfo,
    });
  };

  const deleteChat = (userInfo) => {
    Alert.alert(
      "Delete Chat",
      "Are you sure you want to delete this chat?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK", onPress: () => handleDeleteChat(currentUser.uid, userInfo.uid) }
      ]
    );
  };

  const handleDeleteChat = async (currentUserId, otherUserId) => {
    const combinedId = currentUserId > otherUserId ? currentUserId + otherUserId : otherUserId + currentUserId;
    try {
      await firestore().collection("chats").doc(combinedId).delete();
      await firestore().collection("userChats").doc(currentUserId).update({
        [combinedId]: firestore.FieldValue.delete(),
      });
      showMessage({
        message: "Chat deleted successfully!",
        type: "success",
      });
    } catch (error) {
      showMessage({
        message: error.message,
        type: "danger",
      });
    }
  };

  const formatMessage = (message) => {
    const MAX_LENGTH = 30; // Adjust as needed
    return message.length > MAX_LENGTH ? `${message.substring(0, MAX_LENGTH)}...` : message;
  };

  const renderChatItem = ({ item }) => (
    <View style={styles.profileWrapper}>
      <ProfileCard
        displayName={item.userInfo.displayName || "Unknown User"}
        lastMessage={item.lastMessage}
        avatar={item.userInfo.photoURL}
        onPress={() => handleSelect(item.chatId, item.userInfo)}
        onDeletePress={() => deleteChat(item.userInfo)}
      />
      <View style={styles.borderBottom}></View>
    </View>
  );

  return (
    <View style={styles.flatList}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.chatId}
        renderItem={renderChatItem}
        ListEmptyComponent={<Text style={styles.noChatsText}>No chats available.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
    backgroundColor: Colors.background,
    width: '100%',
  },

  borderBottom: {
    borderBottomColor: 'rgba(105, 105, 105, 1.0)',
    borderBottomWidth: 2,
    
  },
  noChatsText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'grey',
    fontSize: 16,
  },
});

export default Chats;
