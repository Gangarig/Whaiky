import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, Button } from "react-native";
import firestore from "@react-native-firebase/firestore";
import Messages from "./Messages";
import Input from "./Input";
import { useChat } from "../../../../context/ChatContext";
import defaultAvatar from '../../../../assets/images/avatar/avatar.png';
const Chat = ({ navigation, route }) => {
  const { data } = useChat();
  const { chatId, userInfo } = route.params;

  return (
    <View style={styles.chatContainer}>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
      <View style={styles.chatInfo}>
        <Text style={styles.chatDisplayName}>{userInfo.displayName}</Text>
        <View style={styles.chatIcons}>
          <Image source={
            userInfo.photoURL
              ? { uri: userInfo.photoURL }
              : defaultAvatar
          } style={{ width: 50, height: 50, borderRadius: 25 }} />
        </View>
      </View>
      <Messages chatId={chatId} />
      <Input />
    </View>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
  },
  chatInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  chatDisplayName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  chatIcons: {
    flexDirection: "row",
  },
});

export default Chat;
