
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';

// Remove the setUserInfo parameter and use a callback to update the state
export const handleAvatarChange = async (currentUser, updateAvatarCallback) => {
  console.log('Function handleAvatarChange called!');
  try {
    const image = await ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    });
    console.log('Image:', image);
    if (!image) {
      return;
    }
    const storageRef = storage().ref(`profile_images/${currentUser.uid}`);
    await storageRef.putFile(image.path);
    const downloadURL = await storageRef.getDownloadURL();
    await firestore().collection('users').doc(currentUser.uid).update({
      photoURL: downloadURL,
    });

    console.log('downloadUrl from handleAvatarChange:', downloadURL);
    updateAvatarCallback(downloadURL);
    console.log('Avatar updated successfully!');
    showMessage({
      message: 'Avatar updated successfully!',
      type: 'success',
    });
  } catch (error) {
    showMessage({
      message: 'Error updating avatar: ' + error.message,
      type: 'danger',
    });
  }
};

