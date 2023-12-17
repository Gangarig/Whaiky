import React, { useState, useEffect, useCallback } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../../../context/AuthContext';
import { sendMessage, uploadImages } from './Components/Utility';
import Input from './Input'; 
import { Button, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import Bubble from './Components/Bubble';
const Messages = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const messagesRef = firestore()
      .collection('chats').doc(chatId).collection('messages');
  
    const unsubscribe = messagesRef
      .orderBy('timestamp', 'desc')
      .onSnapshot(querySnapshot => {
        const firebaseMessages = querySnapshot.docs.map(doc => {
          const data = doc.data();
          const timestamp = data.timestamp ? new Date(data.timestamp.seconds * 1000) : new Date();
          return {
            _id: doc.id,
            text: data.text,
            createdAt: timestamp,
            user: {
              _id: data.senderId,
              name: data.user.name,
              avatar: data.user.avatar,
            },
            image: data.imageUrls, 
          };
        });
        setMessages(firebaseMessages);
      });
  
    return () => unsubscribe();
  }, [chatId]);

  const handleSend = useCallback(async (newMessages = []) => {
    if (newMessages.length > 0) {
      const { text, image: imageUrls } = newMessages[0]; // Destructure text and imageUrls
  
      // Prepare message object
      let messageData = {
        text: text,
        senderId: currentUser.uid,
        user: {
           _id: currentUser.uid,
            name: currentUser.displayName,
            avatar:currentUser.photoURL,
          },
        timestamp: firestore.FieldValue.serverTimestamp(),
      };
  
      // Check if there are image URLs
      if (imageUrls && imageUrls.length > 0) {
        messageData = {
          ...messageData,
          imageUrls: imageUrls, // Include image URLs if present
        };
      }
  
      // Send the message
      sendMessage(messageData, chatId,);
    }
  }, [currentUser.uid, chatId]);


  return (
      <GiftedChat
        messages={messages}
        onSend={handleSend}
        user={{ _id: currentUser.uid }}
        renderInputToolbar={props => <Input onSend={handleSend} chatId={chatId} />}  
        renderBubble={props => <Bubble {...props} />}
        keyboardShouldPersistTaps={'never'}
        renderAvatar={null}
      />
  );
};

export default Messages;
