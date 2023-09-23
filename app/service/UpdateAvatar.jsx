import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';

export const UpdateAvatar = async (currentUser, setUserInfo) => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true
      });
  
      if (!image) return;
  
      // Upload the image to Firebase Storage
      const filename = image.path.split('/').pop(); // Getting the filename from the path
      const storageRef = storage().ref(`avatars/${currentUser.uid}/${filename}`);
      const uploadTask = storageRef.putFile(image.path);
  
      // Get the download URL
      await uploadTask;
      const downloadURL = await storageRef.getDownloadURL();
  
      // Update the user's Firestore document with the new photoURL
      await firestore().collection('users').doc(currentUser.uid).update({
        photoURL: downloadURL
      });
  
      // Update local state (Optional, but good for immediate feedback to the user)
      setUserInfo(prevState => ({ ...prevState, photoURL: downloadURL }));
  
      // Optionally, delete the old image from storage. Note that if the filename for the 
      // new avatar is the same as the old one, this will delete the newly uploaded image.
      // Hence, it's crucial to ensure filenames are unique.
      const oldAvatarRef = storage().refFromURL(prevState.photoURL);
      if (oldAvatarRef) {
        await oldAvatarRef.delete();
      }
  
      alert('Avatar updated successfully!');
    } catch (error) {
      alert('Error updating avatar: ', error.message);
    }
  };
  