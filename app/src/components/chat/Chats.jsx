import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import defaultAvatar from "../../../assets/images/avatar/avatar.png";
import { StyleSheet } from "react-native";
import { Global } from "../../../style/Global";
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
            const chatArray = Object.entries(chatData).map(([id, chat]) => ({
              ...chat,
              chatId: id,
              date: chat.date?.toDate().getTime() || 0, // convert Firestore Timestamp to milliseconds
            }));
            setChats(chatArray);
          }
        });

      return () => {
        unsubscribe();
      };
    }
  }, [currentUser]);

  const handleSelect = (chatId, userInfo) => {
    dispatch({ type: "CHANGE_USER", payload: userInfo });
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={chats.sort((a, b) => b.date - a.date)}
        keyExtractor={(item) => item.chatId}
        renderItem={({ item }) => (

          <TouchableOpacity
            style={styles.userInfo}
            onPress={() => {
              handleSelect(item.chatId, item.userInfo);
              navigation.navigate("Chat", {
                chatId: item.chatId,
                userInfo: item.userInfo,
              });
            }}
          >
            <Image
              source={
                item.userInfo.photoURL
                  ? { uri: item.userInfo.photoURL }
                  : defaultAvatar
              }
              style={{ width: 50, height: 50, borderRadius: 25 }}
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={Global.titleSecondary}>User: {item.userInfo.displayName}</Text>
              <Text style={Global.titleSecondary}>Last Message: {item.lastMessage?.text}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Chats;


const styles = StyleSheet.create({

  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 3,
  },
});
