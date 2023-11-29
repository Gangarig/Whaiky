import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Image, StyleSheet } from 'react-native';
import uuid from 'react-native-uuid';
import { showMessage } from 'react-native-flash-message';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from "../../../../context/AuthContext";
import { useChat } from "../../../../context/ChatContext";
import ImageCropPicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';

const Input = () => {
  const [text, setText] = useState('');
  const [images, setImages] = useState([]);
  const { currentUser } = useAuth();
  const { data } = useChat();
  const [ send , setSend ] = useState(false);
  const pickImages = () => {
    ImageCropPicker.openPicker({
      multiple: true,
      maxFiles: 3, // Limit to 3 images
      cropping: true,

    }).then(selectedImages => {
      setImages(selectedImages.map(img => img.path));
    });
  };
  

  const openCamera = () => {
    ImageCropPicker.openCamera({
      cropping: true,
    }).then(image => {
      setImages([image.path]);
    });
  };

  const handleSend = async () => {
    if (send) {
      showMessage({
        message: "Sending message... Please wait.",
        type: "danger",
      });
      return;
    }

    if (!text.trim() && images.length === 0) {
      // Notify user that they can't send an empty message
      showMessage({
        message: "You cannot send an empty message.",
        type: "danger",
      });
      return;
    }

    if (!currentUser?.uid || !data.chatId) {
     showMessage({
        message: "You are not authorized to send messages.",
        type: "danger",
      });
      return;
    }

    const messageId = uuid.v4();
    let uploadedImageURLs = [];

    if (images.length > 0) {
      for (let img of images) {
        const reference = storage().ref(`chat/images/${messageId}`);
        await reference.putFile(img);
        const url = await reference.getDownloadURL();
        uploadedImageURLs.push(url);
      }
    }

    try {
      await firestore()
        .collection("chats")
        .doc(data.chatId)
        .update({
          messages: firestore.FieldValue.arrayUnion({
            id: messageId,
            text,
            senderId: currentUser.uid,
            images: uploadedImageURLs,
          }),
        });
        // Update userChats for the current user
        const userChatRef = firestore().collection('userChats').doc(currentUser.uid);
        await userChatRef.update({
            [`${data.chatId}.lastMessage`]: { text },
            [`${data.chatId}.date`]: firestore.FieldValue.serverTimestamp(),
        });

        // Update userChats for the other user
        const otherUserChatRef = firestore().collection('userChats').doc(data.user.uid);
        await otherUserChatRef.update({
            [`${data.chatId}.lastMessage`]: { text },
            [`${data.chatId}.date`]: firestore.FieldValue.serverTimestamp(),
        });
        setSend(true);
    } catch (error) {
      console.error("Error updating document:", error);
      showMessage({
        message: "An error occurred while sending the message.",
        type: "danger",
      });
    }
    
    setText('');
    setImages([]);
    setSend(false);
  };

  return (
    <View style={styles.container}>
      {images.map((image, index) => (
        <Image key={index} source={{ uri: image }} style={styles.previewImage} />
      ))}
      <TextInput
        style={styles.input}
        onChangeText={setText}
        value={text}
        placeholder="Type something..."
      />
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.button} onPress={pickImages}>
          <Text>Select Images</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={openCamera}>
          <Text>Open Camera</Text>
        </TouchableOpacity>
        <Button title="Send" onPress={handleSend} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  previewImage: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});

export default Input;
