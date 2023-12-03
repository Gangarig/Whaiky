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
      <TouchableOpacity
        style={[styles.inputWrapper]}
        onPress={handleSearchButtonPress}
      >
        <Text style={[Global.titleSecondary,Colors]}>
          Search a User
        </Text>
      </TouchableOpacity>

      <Search isVisible={searchModalVisible} onClose={handleCloseSearch} />
      <Chats navigation={navigation} onSelectChat={handleChatSelect} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingHorizontal: 10,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputWrapper: {
    width: '100%',
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.black,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
});

export default ChatScreen;
