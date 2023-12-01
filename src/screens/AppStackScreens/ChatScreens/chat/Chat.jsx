import React from "react";
import { View, Text, StyleSheet } from "react-native";
import FastImage from 'react-native-fast-image'; // Ensure this is imported
import Messages from "./Messages";
import Input from "./Input";
import Colors from "../../../../constant/Colors";
import defaultAvatar from '../../../../assets/images/avatar/avatar.png'; // Assuming you have a default avatar image

const Chat = ({ navigation, route }) => {
  const { chatId, userInfo } = route.params;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headerTitle}>
          <FastImage
            source={{ uri: userInfo.photoURL || defaultAvatar }}
            style={styles.avatar}
          />
          <Text style={styles.headerText}>{userInfo.displayName}</Text>
        </View>
      ),
      headerBackTitleVisible: false,
      headerTintColor: Colors.primary, // Adjusted to match the app's color theme
    });
  }, [navigation, userInfo]);

  return (
    <View style={styles.chatContainer}>
      <Messages chatId={chatId} />
      <Input chatId={chatId} />
    </View>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    // Removed border styling for a cleaner look
  },
  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  headerText: {
    fontWeight: "bold",
    color: Colors.text, // Adjusted to use the app's text color for consistency
  },
});

export default Chat;
