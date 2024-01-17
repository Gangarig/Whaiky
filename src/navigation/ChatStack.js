import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChatScreen from '../screens/AppStackScreens/ChatScreens/ChatScreen';
import Chat from '../screens/AppStackScreens/ChatScreens/chat/Chat';
import StackHeader from './ScreenComponents/StackHeader';

const ChatStack = createStackNavigator();
function ChatStackScreen({navigation}) {
  return (
    <ChatStack.Navigator screenOptions={{headerShown:true}}>
      <ChatStack.Screen
       name="ChatScreen" 
       component={ChatScreen} 
        options={
          ({navigation}) => ({
            header: (props) => <StackHeader title="Whaiky" navigation={navigation} isHomeScreen={false} {...props}  />,
          })
        }
       />
      <ChatStack.Screen
       name="Message" 
       component={Chat}
       options={
        ({navigation}) => ({
          header: (props) => <StackHeader title="Whaiky" navigation={navigation} isHomeScreen={false} {...props}  />,
        })
       }  
       />
    </ChatStack.Navigator>
  );
}

export default ChatStackScreen;
