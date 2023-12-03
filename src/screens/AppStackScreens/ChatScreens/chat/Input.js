import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text ,TextInput } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import ImageCropPicker from 'react-native-image-crop-picker';
import { uploadImages } from './Utility';
import { showMessage } from 'react-native-flash-message';

const Input = ({ onSend , chatId }) => {
  const [text, setText] = useState('');

  const handleTextSend = () => {
    if (text.trim()) {
      onSend([{ text, user: { _id: chatId } }]); // Pass chatId as user._id
      setText('');
    }
    
  };

  const handleImageSend = async (images) => {
    const imageUrls = await uploadImages(images, chatId); // Pass chatId to uploadImages
    onSend([{ images: imageUrls, user: { _id: chatId } }]); // Pass chatId in the message
  };

  const pickImage = () => {
    ImageCropPicker.openPicker({
      multiple: true,
      maxFiles: 3,
      compressImageMaxWidth: 1024,
      compressImageMaxHeight: 1024,
      compressImageQuality: 0.7,
    }).then(images => {
      const paths = images.map(img => img.path);
      console.log(paths);
      handleImageSend(paths);
    }).catch(error => {
        console.log('Error picking images: ', error);
        showMessage({
            message: `Error: ${error.message}`,
            type: 'danger',
        });
    });
  };

  const openCamera = () => {
    ImageCropPicker.openCamera({
      compressImageMaxWidth: 1024,
      compressImageMaxHeight: 1024,
      compressImageQuality: 0.7,
    }).then(image => {
      handleImageSend([image.path]);
    }).catch(error => {
      console.log('Error opening camera: ', error);
        showMessage({
            message: `Error: ${error.message}`,
            type: 'danger',
        });
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconButton} onPress={pickImage}>
        <FontAwesomeIcon icon="fa-solid fa-image" size={24} color="gray" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton} onPress={openCamera}>
        <FontAwesomeIcon icon="fa-solid fa-camera" size={24} color="gray" />
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Type a message"
        onSubmitEditing={handleTextSend}
      />
      <TouchableOpacity style={styles.sendButton} onPress={handleTextSend}>
        <Text style={styles.sendText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'white',
    
  },
  iconButton: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 20,
    padding: 10,
  },
  sendButton: {
    marginLeft: 10,
  },
  sendText: {
    color: 'blue',
  },
});

export default Input;
