import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import Search from '../../components/chat/Search';
import Chats from '../../components/chat/Chats';
import { SafeAreaView } from 'react-native-safe-area-context';

const ChatScreen = ({ navigation }) => {
  const [searchModalVisible, setSearchModalVisible] = useState(false);

  const handleSearchButtonPress = () => {
    setSearchModalVisible(true);
  };

  const handleCloseSearch = () => {
    setSearchModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Button
          title="Search"
          onPress={handleSearchButtonPress}
          color="#007AFF" // Use your preferred color
        />
        <Button title="Go back" onPress={() => navigation.goBack()} />
        <Search isVisible={searchModalVisible} onClose={handleCloseSearch} />
        <Chats navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Use your preferred background color
  },
  container: {
    flex: 1,
    paddingHorizontal: 16, // Add padding for content spacing
    paddingTop: 20, // Add top padding for content spacing
  },
});

export default ChatScreen;
