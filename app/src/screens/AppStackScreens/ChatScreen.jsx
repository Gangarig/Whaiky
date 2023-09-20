import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Search from '../../components/chat/Search'
import Chats from '../../components/chat/Chats'
import { SafeAreaView } from 'react-native-safe-area-context'

const ChatScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Search />
        <Chats />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 0,
  },
});

export default ChatScreen;
