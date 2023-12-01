import React, { useContext, useState, useRef } from 'react';
import { View, TextInput, Text, Button, TouchableOpacity, Image, StyleSheet, Animated, Modal } from 'react-native';
import uuid from 'react-native-uuid';
import { showMessage } from 'react-native-flash-message';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../../../context/AuthContext';
import { ChatContext } from '../../../../context/ChatContext';
import ImageCropPicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import Colors from '../../../../constant/Colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Global } from '../../../../constant/Global';
import { shadowStyle } from '../../../../constant/Shadow';
import FastImage from 'react-native-fast-image';

const Input = () => {
  const [text, setText] = useState('');
  const [images, setImages] = useState([]);
  const { currentUser } = useAuth();
  const { data } = useContext(ChatContext); 
  const [visible, setVisible] = useState(false);

  const sidebarWidth = useRef(new Animated.Value(25)).current;
  const slideInAnimation = useRef(new Animated.Value(0)).current;

  const uploadImages = async () => {
    const uploadedImageURLs = [];
    for (const img of images) {
      const imageId = uuid.v4();
      const reference = storage().ref(`chat/images/${data.chatId}/${imageId}`);
      await reference.putFile(img);
      const url = await reference.getDownloadURL();
      uploadedImageURLs.push(url);
    }
    return uploadedImageURLs;
  };

  const sendMessage = async () => {
    if (!text.trim() && images.length === 0) {
      showMessage({ message: 'Cannot send an empty message.', type: 'warning' });
      return;
    }

    const messageId = uuid.v4();
    const uploadedImageURLs = await uploadImages();

    const newMessage = {
      id: messageId,
      senderId: currentUser.uid,
      timestamp: firestore.FieldValue.serverTimestamp(),
      text,
      images: uploadedImageURLs,
    };

    try {
      const chatRef = firestore().collection('chats').doc(data.chatId);
      await firestore().runTransaction(async (transaction) => {
        transaction.update(chatRef, {
          lastMessage: { text, timestamp: firestore.FieldValue.serverTimestamp() },
        });
        transaction.set(chatRef.collection('messages').doc(messageId), newMessage);
      });

      setText('');
      setImages([]);
      closeSidebar(); // Close the sidebar after sending the message
    } catch (error) {
      showMessage({ message: 'Failed to send message.', type: 'danger' });
    }
  };

  const pickImages = () => {
    ImageCropPicker.openPicker({
      multiple: true,
      maxFiles: 3,
      cropping: true,
    })
      .then((selectedImages) => {
        setImages(selectedImages.map((img) => img.path));
        setVisible(false);
        closeSidebar(); 
      })
      .catch(() => {
        setVisible(false);
        closeSidebar(); 
      });
  };

  const openCamera = () => {
    ImageCropPicker.openCamera({
      cropping: true,
    })
      .then((image) => {
        setImages([image.path]);
        setVisible(false);
        closeSidebar();
      })
      .catch(() => {
        setVisible(false);
        closeSidebar(); 
      });
  };

  const closeSidebar = () => {
    Animated.parallel([
      Animated.timing(sidebarWidth, {
        toValue: 25,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(slideInAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const toggleSidebar = () => {
    const isOpen = sidebarWidth._value > 25;
    setVisible(!visible);
    if (isOpen) {
      closeSidebar();
    } else {
      Animated.parallel([
        Animated.timing(sidebarWidth, {
          toValue: 75,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(slideInAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  return (
    <View style={styles.container}>
      { images.length > 0 ? (
        <View style={styles.imageWrapper}>
          { images.map((img, index) => (
            <TouchableOpacity key={index} onPress={() => openImageModal(img)}>
              <FastImage source={{ uri: img }} style={styles.messageImage} />
            </TouchableOpacity>
          ))}
        </View>
      ) : null
      }
      <Animated.View style={[styles.sideWrapper, { width: sidebarWidth, transform: [{ translateX: slideInAnimation }] }]}>
        <TouchableOpacity onPress={toggleSidebar}>
          <FontAwesomeIcon size={18} color={Colors.white} icon="fa-solid fa-arrow-right" />
        </TouchableOpacity>
        { visible ? (
          <>
        <TouchableOpacity onPress={pickImages}>
          <FontAwesomeIcon size={18} color={Colors.white} icon="fa-solid fa-image" />
        </TouchableOpacity>
        <TouchableOpacity onPress={openCamera}>
          <FontAwesomeIcon size={18} color={Colors.white} icon="fa-solid fa-camera" />
        </TouchableOpacity>
          </>
        ) : null }
      </Animated.View>
      <TextInput
        style={styles.input}
        onChangeText={setText}
        value={text}
        placeholder="Type something..."
      />
      <TouchableOpacity style={styles.send} onPress={sendMessage}>
        <FontAwesomeIcon color={Colors.white} size={18} icon="fa-solid fa-arrow-up" />
      </TouchableOpacity>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    borderTopColor: Colors.primary,
    borderTopWidth: 1,
    borderColor: Colors.primary,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
    backgroundColor: Colors.background,
    position: 'relative',
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    width: '80%',
    flexDirection: 'row',
    ...Global.text,
    fontSize: 18,
  },
  send: {
    backgroundColor: Colors.primary,
    width: 25,
    height: 25,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadowStyle,
  },
  sideWrapper: {
    backgroundColor: Colors.primary,
    height: 25, 
    width: 25,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadowStyle,
    position: 'absolute',
    left: 5,
    zIndex: 1,
    flexDirection: 'row', 
    gap: 5,
  },
  rightArrow: {
    position: 'absolute',
    left: 0,
    zIndex: 1,
  },
  imageWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: Colors.primary,
    position: 'absolute',
    left: 10,
    zIndex: 1,
    padding: 5,
    borderRadius: 5,
    bottom: 50,
    ...shadowStyle,
  },
  messageImage: {
    width: 100, 
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.white,
  },
});

export default Input;
