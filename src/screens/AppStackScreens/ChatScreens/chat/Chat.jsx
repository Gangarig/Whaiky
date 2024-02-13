import React from "react";
import { View, Text, StyleSheet } from "react-native";
import FastImage from 'react-native-fast-image'; 
import Messages from "./Messages";
import defaultAvatar from '../../../../assets/images/avatar/avatar.png'; 
import { useTheme } from "../../../../context/ThemeContext";

const Chat = ({ navigation, route }) => {
  const { chatId, userInfo } = route.params;
  const theme = useTheme();
  const styles = getStyles(theme);

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
      headerTintColor: theme.primary,
    });
  }, [navigation, userInfo]);

  return (
    <View style={styles.chatContainer}>
      <Messages chatId={chatId} userInfo={userInfo}/>
    </View>
  );
};

const getStyles = (theme) => StyleSheet.create({
  chatContainer: {
    flex: 1,
    backgroundColor: theme.background,
    borderTopColor: theme.black,
    borderTopWidth: .5,
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
    color: theme.text, 
  },
});


export default Chat;