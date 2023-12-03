import React, { useState, useEffect, useCallback } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../../../context/AuthContext';
import { sendMessage, uploadImages } from './Utility';
import Input from './Input'; 
import { View } from 'react-native';

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
          // Fallback for timestamp if it's null
          const timestamp = data.timestamp ? new Date(data.timestamp.seconds * 1000) : new Date();
          return {
            _id: doc.id,
            text: data.text,
            createdAt: timestamp,
            user: {
              _id: data.senderId,
            },
          };
        });
        setMessages(firebaseMessages);
      });
  
    return () => unsubscribe();
  }, [chatId]);
  


  const handleSend = useCallback(async (newMessages = []) => {
    if (newMessages.length > 0) {
      const message = {
        ...newMessages[0],
        user: { _id: currentUser.uid },
      };

      // Check if the message contains images
      if (message.images && message.images.length > 0) {
        const imageUrls = await uploadImages(message.images, chatId);
        // Create a new message object with image URLs
        const imageMessage = {
          ...message,
          image: imageUrls,
        };
        sendMessage(imageMessage, chatId);
      } else {
        sendMessage(message, chatId);
      }
    }
  }, [currentUser.uid, chatId]);

  return (
    <View style={{flex:1}}>
      <GiftedChat
        messages={messages}
        onSend={handleSend}
        user={{ _id: currentUser.uid }}
        renderInputToolbar={props => (
          <Input onSend={handleSend} chatId={chatId} />
        )}
        // Optionally, add a renderer for image messages
        renderMessageImage={message => {
          // Render the image in the message here
        }}
      />
    </View>
  );
};

export default Messages;
