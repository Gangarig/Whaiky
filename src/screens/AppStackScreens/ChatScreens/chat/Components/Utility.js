import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';
import ImageCropPicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import uuid from 'react-native-uuid';

export const sendMessage = async (message, chatId) => {
  try {
    // Destructuring message object
    const { text, user, imageUrls } = message;

    // Check if at least text or imageUrls is present
    if (!text && (!imageUrls || imageUrls.length === 0)) {
      throw new Error("Message text and images are undefined.");
    }

    // Check for user ID
    if (!user || !user._id) {
      throw new Error("User ID is undefined.");
    }

    // Prepare message data for Firestore
    let messageData = {
      text: text || '', 
      user: {
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
      }, 
      senderId: user._id,
      timestamp: firestore.FieldValue.serverTimestamp(),
    };

    // Add image URLs if present
    if (imageUrls && imageUrls.length > 0) {
      messageData.imageUrls = imageUrls;
    }

    // Firestore operations
    await firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .add(messageData);
    firestore()
      .collection('chats')
      .doc(chatId)
      .set({
        lastMessage: messageData,
        
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

export const pickImages = () => {
  return new Promise((resolve, reject) => {
    ImageCropPicker.openPicker({
      multiple: true,
      maxFiles: 3,
      cropping: true,
      compressImageMaxWidth: 1024,
      compressImageMaxHeight: 1024,
      compressImageQuality: 0.7,
    })
    .then((selectedImages) => {
      resolve(selectedImages.map((img) => img.path));
    })
    .catch((error) => {
      reject(error);
    });
  });
};


export const openCamera = (setImage) => {
  ImageCropPicker.openCamera({
    cropping: true,
    compressImageMaxWidth: 1024,
    compressImageMaxHeight: 1024,
    compressImageQuality: 0.7,
  })
    .then((image) => {
      setImage([image.path]);
    })
    .catch((error) => {
      console.error("Error opening camera: ", error);
    });
};
