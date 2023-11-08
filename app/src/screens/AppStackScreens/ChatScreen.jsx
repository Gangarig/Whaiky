import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import Search from '../../components/chat/Search';
import Chats from '../../components/chat/Chats';
import { SafeAreaView } from 'react-native-safe-area-context';
import { showMessage } from 'react-native-flash-message';

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
        <View style={styles.header}>
          <Text style={styles.title}>Chats</Text>
          <Button
            title="Search"
            onPress={handleSearchButtonPress}
            color="#007AFF" // Use your preferred color
          />
        </View>
        <Search isVisible={searchModalVisible} onClose={handleCloseSearch} />
        <Chats navigation={navigation}/>
        <View style={styles.footer}>
          <Button title="Go back" onPress={() => navigation.goBack()} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8', // Use a neutral background color
  },
  container: {
    flex: 1,
    paddingHorizontal: 16, // Maintain padding for content spacing
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10, // Provide vertical padding for header content
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  footer: {
    padding: 10, // Provide padding for the footer button
  },
  image: {
    width: 40, // Set image size
    height: 40,
    borderRadius: 20, // Make the image circular
  },
});

export default ChatScreen;
