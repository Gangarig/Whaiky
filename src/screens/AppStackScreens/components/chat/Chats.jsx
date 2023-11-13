import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import defaultAvatar from "../../../assets/images/avatar/avatar.png";
import { StyleSheet } from "react-native";
import { showMessage } from "react-native-flash-message";
import { Global } from "../../../style/Global";
import { Alert } from "react-native";


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
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => handleSelect(item.chatId, item.userInfo)}
    >
      <Image
        source={item.userInfo.photoURL ? { uri: item.userInfo.photoURL } : defaultAvatar}
        style={styles.avatar}
      />
      <View style={styles.chatDetails}>
        <Text style={Global.titleSecondary}>Name: {item.userInfo.displayName}</Text>
        <Text style={Global.text}>Last Message :{item.lastMessage?.text || "No messages yet"}</Text>
      </View>
      <TouchableOpacity 
        onPress={() => deleteChat(item.userInfo.uid)}
      >
        <Text style={Global.textSecondary}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={chats}
      keyExtractor={(item) => item.chatId}
      renderItem={renderChatItem}
      ListEmptyComponent={<Text style={styles.noChatsText}>No chats available.</Text>}
    />
  );
};

export default Chats;

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 1,
    shadowOffset: {
      width: 3,
      height: 3,
    },
    elevation: 1,
    backgroundColor: '#fff',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  chatDetails: {
    marginLeft: 10,
    flex: 1,
  },
  chatName: {
    fontWeight: 'bold',
  },
  lastMessage: {
    color: '#666',
  },
  noChatsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});
