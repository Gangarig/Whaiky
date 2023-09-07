import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useUser } from '../../context/UserContext';
import { useChat } from '../../context/ChatContext';
import Search from './chat/Search';
const ChatScreen = () => {
  const [inputText, setInputText] = useState('');
  const { messages, sendMessage } = useChat();
  const { currentUser } = useUser();

  return (
    <View>  
      <Search />
      {messages.map((message) => (
        <Text key={message.id}>{message.text}</Text>
      ))}

      <TextInput
        value={inputText}
        onChangeText={(text) => setInputText(text)}
      />

      <Button
        title="Send"
        onPress={() => {
          if (currentUser && currentUser.uid) {
            sendMessage(inputText, currentUser.uid);
            setInputText('');
          }
        }}
      />
    </View>
  );
};

export default ChatScreen;
