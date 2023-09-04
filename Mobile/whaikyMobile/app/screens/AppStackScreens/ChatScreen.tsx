import { View, Text } from 'react-native'
import React from 'react'
import Search from './chat/Search'
import Chats from './chat/Chats'



const ChatScreen = () => {
  return (
    <View>
      <Search />
      <Chats />
    </View>
  )
}

export default ChatScreen