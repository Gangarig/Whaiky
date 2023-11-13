import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChatScreen from '../screens/ChatScreen';
import Chat from '../components/chat/Chat';



const ChatStack = createStackNavigator();
function ChatStackScreen() {
  return (
    <ChatStack.Navigator screenOptions={{headerShown:false}}>
      <ChatStack.Screen name="ChatScreen" component={ChatScreen} />
      <ChatStack.Screen name="Chat" component={Chat} />
    </ChatStack.Navigator>
  );
}

export default ChatStackScreen;