import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Chats from './chat/Chats';
import { useTheme } from '../../../context/ThemeContext';
const ChatScreen = ({ navigation }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
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
      {/* <View style={styles.ChatScreen}> */}
      {/* <TouchableOpacity
        style={[styles.inputWrapper]}
        onPress={handleSearchButtonPress}
      >
        <Text style={[Global.text]}>
          Search a User
        </Text>
      </TouchableOpacity> */}
      {/* <Search isVisible={searchModalVisible} onClose={handleCloseSearch} /> */}
      <Chats navigation={navigation} onSelectChat={handleChatSelect} />
      {/* </View> */}
    </View>
  );
};

const getStyles = (theme) => {
  return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
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
    borderColor: theme.primary,
    paddingVertical: 10,
    paddingHorizontal: 10,  
  },
});
}

export default ChatScreen;