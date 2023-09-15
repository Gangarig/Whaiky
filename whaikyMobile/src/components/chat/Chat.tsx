import React, { useContext } from "react";
import { View, Text, StyleSheet,Button , Image } from "react-native";
import Messages from "./Messages";
import Input from "./Input";
import { useChat } from "../../../context/ChatContext";

const Chat: React.FC = ({navigation,route}:any) => {
  const { data } = useChat();
  const { chatId, userInfo } = route.params;


  return (
    <View style={styles.chatContainer}>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
      <View style={styles.chatInfo}>
        <Text style={styles.chatDisplayName}>{userInfo.displayName} </Text>
        <View style={styles.chatIcons}> <Image source={userInfo.photoURL} style={{ width: 50, height: 50, borderRadius: 25 }} /></View>
      </View>
        <Messages/>
        <Input />
    </View>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1
  },
  chatInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10
  },
  chatDisplayName: {
    fontSize: 16,
    fontWeight: "bold"
  },
  chatIcons: {
    flexDirection: "row"
  }
});

export default Chat;
