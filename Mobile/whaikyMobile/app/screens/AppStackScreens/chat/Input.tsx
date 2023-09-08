import React, { useState } from 'react';
import { View, TextInput, Button, TouchableOpacity, Image, Text } from 'react-native';
import { useChat } from '../../../context/ChatContext';
import { useUser } from '../../../context/UserContext';

import {
  arrayUnion,
  doc,
  updateDoc,
  serverTimestamp,
  Timestamp,
  collection
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { firestore, storage } from "../../../../FirebaseConfig";
import * as ImagePicker from 'expo-image-picker';
import * as Random from 'expo-random';
import Messages from './Messages';

const generateUniqueId = async () => {
  const randomBytes = await Random.getRandomBytesAsync(16);
  const uniqueId = [...randomBytes].map(byte => byte.toString(16).padStart(2, '0')).join('');
  return uniqueId;
};



const Input = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const { currentUser } = useUser();
  const { data } = useChat();


  const handleSend = async () => {
    if (!text && !image) {
    // Neither text nor image is provided, so return early without doing anything.
    return;
  }
    if (!currentUser?.uid || !data.user?.uid || !data.chatId) {
      console.error('Required data is missing.');
      return;
    }
    const messageId = await generateUniqueId();


    // Time

    // Create a new Date object representing the current date and time
      const currentDate = new Date();

      // Get various components of the current date and time
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // Months are zero-based, so add 1
      const day = currentDate.getDate();
      const hours = currentDate.getHours();
      const minutes = currentDate.getMinutes();
      const seconds = currentDate.getSeconds();

      // Format the date and time as a string
      const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    if (image) {
      // Convert the image URI to a blob for uploading to Firebase Storage
      const response = await fetch(image);
      const blob = await response.blob();
  
      const storageRef = ref(storage, messageId);
      const uploadTask = uploadBytesResumable(storageRef, blob);
  
      uploadTask.on('state_changed',
        (snapshot) => {
          // You can add progress handling here if you wish
        },
        (error) => {
          console.error(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await updateDoc(doc(firestore, "chats", data.chatId), {
            messages: arrayUnion({
              id: messageId,
              text,
              senderId: currentUser!.uid,
              date: formattedDateTime,
              img: downloadURL,
            }),
          });
        }
      );
    } else {
      await updateDoc(doc(firestore, "chats", data.chatId), {
        messages: arrayUnion({
          id: messageId,
          text,
          senderId: currentUser!.uid,
          date: formattedDateTime,
        }),
      });
    }

    await updateDoc(doc(firestore, "userChats", currentUser!.uid), {
      [`${data.chatId}.lastMessage`]: { text },
      [`${data.chatId}.date`]: serverTimestamp(),
    });

    await updateDoc(doc(firestore, "userChats", data.user.uid), {
      [`${data.chatId}.lastMessage`]: { text },
      [`${data.chatId}.date`]: serverTimestamp(),
    });

    setText('');
    setImage(null);
  };
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = (result as any).uri;
      setImage(uri);
    }
  };

  return (
    <View>
      {image && (
        <Image source={{ uri: image }} style={{ width: 400, height: 400 }} />
      )}
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        onChangeText={(text) => setText(text)}
        value={text}
        placeholder="Type something..."
      />
      <TouchableOpacity onPress={pickImage}>
        <View style={{ backgroundColor: 'lightblue', padding: 10, marginTop: 10 }}>
          <Text>Select an Image</Text>
        </View>
      </TouchableOpacity>
      <Button title="Send" onPress={handleSend} />
    </View>
  );
};

export default Input;
