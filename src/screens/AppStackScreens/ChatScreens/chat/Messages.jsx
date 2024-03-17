import React, { useState, useEffect, useCallback } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../../../context/AuthContext';
import { sendMessage } from './Components/Utility';
import Input from './Input'; 
import Bubble from './Components/Bubble';
import { Platform } from 'react-native';
const Messages = ({ chatId,userInfo }) => {
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
            timestamp: timestamp,
            user: {
              _id: data.senderInfo._id,
              name: data.senderInfo.name,
              avatar: data.senderInfo.avatar,
            },
            recipentInfo: {
              _id: data.recipentInfo._id,
              name: data.recipentInfo.name,
              avatar: data.recipentInfo.avatar,
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
      const { text, image: imageUrls } = newMessages[0]; 
      
      let messageData = {
        text: text,
        senderInfo: {
           _id: currentUser.uid,
            name: currentUser.displayName,
            avatar:currentUser.photoURL,
          },
        recipentInfo: {
          _id: userInfo.uid,
          name: userInfo.displayName,
          avatar: userInfo.photoURL,
        },
        timestamp: firestore.FieldValue.serverTimestamp(),
      };
      if (imageUrls && imageUrls.length > 0) {
        messageData = {
          ...messageData,
          imageUrls: imageUrls, 
        };
      }
      sendMessage(messageData, chatId,userInfo);
    }
  }, [currentUser.uid, chatId]);


  return (
      <GiftedChat 
        messages={messages}
        onSend={handleSend}
        user={{ _id: currentUser.uid }}
        renderSend={props => <Input {...props} chatId={chatId} />}
        renderBubble={props => <Bubble {...props} />}
        renderAvatar={null}
        bottomOffset={Platform.OS === 'ios' ? 80 :70}
      />
  );
};

export default Messages;

