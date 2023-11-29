import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useAuth } from "../../../../context/AuthContext";
import { useChat } from "../../../../context/ChatContext";
import { StyleSheet } from "react-native";
import { showMessage } from "react-native-flash-message";
import { Global } from "../../../../constant/Global";
import { Alert } from "react-native";
import defaultAvatar from '../../../../assets/images/avatar/avatar.png';
import ProfileCard from "../../../../components/ProfileCard";

const Chats = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const { currentUser } = useAuth();
  const { dispatch } = useChat();

  useEffect(() => {
    if (currentUser && currentUser.uid) {
      const unsubscribe = firestore()
        .collection("userChats")
        .doc(currentUser.uid)
        .onSnapshot((doc) => {
          if (doc.exists) {
            const chatData = doc.data() || {};
            const sortedChats = Object.entries(chatData)
              .map(([id, chat]) => ({
                ...chat,
                chatId: id,
                date: chat.date?.toDate().getTime() || 0, // convert Firestore Timestamp to milliseconds
              }))
              .sort((a, b) => b.date - a.date); // Sort chats by date
            setChats(sortedChats);
          } else {
            // Handle the case where the user has no chats
            setChats([]);
          }
        }, error => {
          showMessage({
            message: error.message,
            type: "danger",
          });
        });

      return () => {
        unsubscribe();
      };
    }
  }, [currentUser]);

  const handleSelect = (chatId, userInfo) => {
    dispatch({ type: "CHANGE_USER", payload: userInfo });
    navigation.navigate("Chat", {
      chatId: chatId,
      userInfo: userInfo,
    });
  };
  const deleteChat = async (userInfo) => {
    const combinedId = currentUser.uid > userInfo ? currentUser.uid + userInfo : userInfo + currentUser.uid;
    Alert.alert(
      "Delete Chat",
      "Are you sure you want to delete this chat?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK", 
          onPress: async () => {
            try {
              await firestore ()
              .collection("chats")
              .doc(combinedId)
              .delete();
              await firestore ()
              .collection("userChats")
              .doc(currentUser.uid)
              .delete();
              await firestore ()
              .collection("userChats")
              .doc(userInfo)
              .delete();
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
          }
      }
      ]
    );


  };
  

  const renderChatItem = ({ item }) => (
    <ProfileCard
      displayName={item.userInfo.displayName}
      message={item.lastMessage?.text || "No messages yet"}
      onPress={() => handleSelect(item.chatId, item.userInfo)}
    />
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

export default Chats;

const styles = StyleSheet.create({
  flatList: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
  },

});
