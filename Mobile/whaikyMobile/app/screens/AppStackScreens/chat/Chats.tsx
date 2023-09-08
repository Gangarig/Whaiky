import React, { useContext, useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, FlatList,Button } from "react-native";
import { doc, onSnapshot } from "firebase/firestore";
import { useUser } from "../../../context/UserContext";
import { useChat } from "../../../context/ChatContext";
import { firestore } from "../../../../FirebaseConfig";
import { useNavigation } from "@react-navigation/native";

interface UserChat {
  date: number;
  lastMessage?: { text: string };
  userInfo: {
    displayName: string;
    photoURL: string;
    uid: string;
  };
}

const Chats: React.FC = () => {
  const [chats, setChats] = useState<Record<string, UserChat>>({});
  const navigation = useNavigation<any>();
  const { currentUser } = useUser();
  const { dispatch } = useChat();

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(firestore, "userChats", currentUser!.uid!), (doc) => {
        setChats(doc.data() as Record<string, UserChat> || {});
      });

      return () => {
        unsub();
      };
    };

    if (currentUser!.uid) {
      const unsubscribe = getChats();
      return () => {
        unsubscribe();
      };
    }
}, [currentUser!.uid]);

const handleSelect = (chatId: string, userInfo: UserChat["userInfo"]) => {
  dispatch({ type: "CHANGE_USER", payload: userInfo });
};




  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={Object.entries(chats).sort((a, b) => b[1].date - a[1].date)}
        keyExtractor={(item) => item[0]}
        renderItem={({ item }) => (
          <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center", padding: 10 }}
          onPress={() => {
             handleSelect(item[0], item[1].userInfo);
             navigation.navigate("Chat", { chatId: item[0], userInfo: item[1].userInfo });
          }}
              
          >
           
              <Image source={{ uri: item[1].userInfo.photoURL }} style={{ width: 50, height: 50, borderRadius: 25 }} />
              <View style={{ marginLeft: 10 }}>
                  <Text>{item[1].userInfo.displayName}</Text>
                  <Text>{item[1].lastMessage?.text}</Text>
              </View>
          </TouchableOpacity>

        )}
      />
    </View>
  );
};

export default Chats;
