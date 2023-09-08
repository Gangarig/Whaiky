import React, { useContext } from "react";
import { View, Text, Image } from "react-native";
import { useUser } from "../../../context/UserContext";
import { useChat } from "../../../context/ChatContext";
const Message: React.FC<{ message: any }> = ({ message }) => {
  const { currentUser } = useUser();
  const { data } = useChat();

  const isOwner = message.senderId === currentUser!.uid;

  const userImageUri = isOwner
    ? (currentUser!.photoURL || '../../../../assets/user.png')
    : (data.user.photoURL || '../../../../assets/user.png');

  return (
    <View style={{ flexDirection: "row", margin: 5, alignItems: "center" }}>
      <Image
        source={{ uri: userImageUri }}
        style={{ width: 50, height: 50, borderRadius: 25 }}
      />
      <Text style={{ marginLeft: 10 }}>{message.text}</Text>
      {message.img && <Image source={{ uri: message.img }} style={{ width: 50, height: 50 }} />}
    </View>
  );
};

export default Message;