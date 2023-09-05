import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Messages from './Messages'; // Make sure you have a React Native version of Messages
import Input from './Input'; // Make sure you have a React Native version of Input
import { ChatContext } from '../../../context/ChatContext'; // Adjust the path to your actual ChatContext import

const Chat: React.FC = () => {
  const { data }:any = useContext(ChatContext);

  return (
    <View style={styles.chat}>
      <View style={styles.chatInfo}>
        <Text style={styles.chatInfoText}>{data.user?.displayName}</Text>
        <View style={styles.chatIcons}>
          {/* Insert your icons here */}
        </View>
      </View>
      <Messages />
      <Input />
    </View>
  );
};

const styles = StyleSheet.create({
  chat: {
    flex: 1,
  },
  chatInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  chatInfoText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatIcons: {
    flexDirection: 'row',
  },
});

export default Chat;
