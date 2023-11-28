
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';

export const handleAvatarChange = async (currentUser, setUserInfo) => {
  try {
    const image = await ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true
    });

    if (!image) {
      return;
    }

    const storageRef = storage().ref(`profile_images/${currentUser.uid}`);
    await storageRef.putFile(image.path);
    const downloadURL = await storageRef.getDownloadURL();

    await firestore().collection('users').doc(currentUser.uid).update({
      photoURL: downloadURL
    });

    setUserInfo(prevState => ({ ...prevState, photoURL: downloadURL }));

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
