import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Search from './chat/Search';
import Chats from './chat/Chats';
import Colors from '../../../constant/Colors';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { Global } from '../../../constant/Global';

const ChatScreen = ({ navigation }) => {
  const [searchModalVisible, setSearchModalVisible] = useState(false);

  const handleSearchButtonPress = useCallback(() => {
    setSearchModalVisible(true);
  }, []);

  const handleCloseSearch = useCallback(() => {
    setSearchModalVisible(false);
  }, []);

  const handleChatSelect = useCallback((chatId, chatName) => {
    // Navigate to DetailedChatScreen with the chatId and chatName
    navigation.navigate('DetailedChatScreen', { chatId, chatName });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.ChatScreen}>
      <TouchableOpacity
        style={[styles.inputWrapper]}
        onPress={handleSearchButtonPress}
      >
        <Text style={[Global.text]}>
          Search a User
        </Text>
      </TouchableOpacity>
      <Search isVisible={searchModalVisible} onClose={handleCloseSearch} />
      <Chats navigation={navigation} onSelectChat={handleChatSelect} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ChatScreen:{
    flex:1,
    width:'100%',
    paddingHorizontal:10,
    padding:10,
  },
  inputWrapper: {
    minWidth: '100%',
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 10,  
  },
});

export default ChatScreen;