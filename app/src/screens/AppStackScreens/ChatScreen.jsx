import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import Search from '../../components/chat/Search';
import Chats from '../../components/chat/Chats';
import { SafeAreaView } from 'react-native-safe-area-context';

const ChatScreen = ({navigation}) => {
  const [searchModalVisible, setSearchModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Button title="Search" onPress={() => setSearchModalVisible(true)} />
        <Search isVisible={searchModalVisible} onClose={() => setSearchModalVisible(false)} />
        <Chats navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  }
});

export default ChatScreen;

