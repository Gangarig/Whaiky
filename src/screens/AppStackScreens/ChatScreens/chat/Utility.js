import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';
import ImageCropPicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import uuid from 'react-native-uuid';

export const sendMessage = async (message, chatId) => {
  try {
    const { text, user } = message;
    if (!text || !user || !user._id) {
      throw new Error("Message text or user ID is undefined.");
    }

    await firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .add({
        text: message.text,
        senderId: message.user._id,
        timestamp: firestore.FieldValue.serverTimestamp(),
      });
    firestore()
      .collection('chats')
      .doc(chatId)
      .set({
        lastMessage: {
          text: message.text,
          senderId: message.user._id,
          timestamp: firestore.FieldValue.serverTimestamp(),
        },
      }, { merge: true });
  } catch (error) {
    console.error("Error sending message: ", error);
    showMessage({
      message: `Error: ${error.message}`,
      type: 'danger',
    });
  }
};

export const uploadImages = async (images, chatId) => {
  if (!images || images.length === 0) {
    throw new Error("No images to upload.");
  }

  try {
    const uploadPromises = images.map(async (img) => {
      const imageId = uuid.v4();
      const reference = storage().ref(`chat/images/${chatId}/${imageId}`);
      await reference.putFile(img);
      return await reference.getDownloadURL();
    });

    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error("Error uploading images: ", error);
    showMessage({
      message: `Upload Error: ${error.message}`,
      type: 'danger',
    });
    return [];
  }
};

export const pickImages = (setImage, setVisible, closeSidebar) => {
  ImageCropPicker.openPicker({
    multiple: true,
    maxFiles: 3,
    cropping: true,
    compressImageMaxWidth: 1024,
    compressImageMaxHeight: 1024,
    compressImageQuality: 0.7,
  })
    .then((selectedImages) => {
      setImage(selectedImages.map((img) => img.path));
      setVisible(false);
      closeSidebar(); 
    })
    .catch((error) => {
      console.error("Error picking images: ", error);
      setVisible(false);
      closeSidebar(); 
    });
};

export const openCamera = (setImage, setVisible, closeSidebar) => {
  ImageCropPicker.openCamera({
    cropping: true,
    compressImageMaxWidth: 1024,
    compressImageMaxHeight: 1024,
    compressImageQuality: 0.7,
  })
    .then((image) => {
      setImage([image.path]);
      setVisible(false);
      closeSidebar();
    })
    .catch((error) => {
      console.error("Error opening camera: ", error);
      setVisible(false);
      closeSidebar(); 
    });
};
