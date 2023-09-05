import React, { useEffect, useRef, useContext } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { useUser } from '../../../context/UserContext';
import { ChatContext } from '../../../context/ChatContext';
interface MessageProps {
  message: {
    senderId: string;
    text: string;
    img?: string;
  };
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const { currentUser } = useUser();
  const { data }:any = useContext(ChatContext);

  const scrollViewRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [message]);

  return (
    <View
      style={[
        styles.message,
        { alignSelf: message.senderId === currentUser?.uid ? 'flex-end' : 'flex-start' },
      ]}
    >
      <View style={styles.messageInfo}>
        <Image
          source={{
            uri: message.senderId === currentUser?.uid ? currentUser?.avatarURL : data.user?.photoURL,
          }}
          style={styles.avatar}
        />
        <Text style={styles.timeStamp}>Just now</Text>
      </View>
      <View style={styles.messageContent}>
        <Text style={styles.messageText}>{message.text}</Text>
        {message.img && <Image source={{ uri: message.img }} style={styles.messageImage} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  message: {
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'flex-end',
  },
  messageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  timeStamp: {
    fontSize: 10,
    color: 'gray',
  },
  messageContent: {
    maxWidth: '70%',
  },
  messageText: {
    fontSize: 16,
  },
  messageImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    marginTop: 10,
  },
});

export default Message;
