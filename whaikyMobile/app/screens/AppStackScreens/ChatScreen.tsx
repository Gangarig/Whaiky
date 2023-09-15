import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useUser } from '../../context/UserContext';
import Search from './chat/Search';
import Chats from './chat/Chats';

const ChatScreen = () => {
  const [inputText, setInputText] = useState('');
  const { currentUser } = useUser();

  return (
    <View>  
      <Search />
      <Chats />
    </View>
  );
};

export default ChatScreen;
