import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

export const UpdateAvatar = async (currentUser, setUserInfo,displayName) => {
  try {
      console.log("Opening image picker...");

      const image = await ImagePicker.openPicker({
          width: 300,
          height: 400,
          cropping: true
      });

      console.log("Image picked:", image);

      if (!image) {
          console.log("No image selected");
          return;
      }

      // Save the current avatar URL for deletion after the update
      const currentAvatarURL = currentUser.photoURL;

      // Upload the image to Firebase Storage
      console.log("Uploading image to Firebase Storage...");
      const filename = image.path.split('/').pop();
      const storageRef = storage().ref(`profile_images/${currentUser.uid}/${filename}`);
      await storageRef.putFile(image.path);
      console.log("Upload successful!");

      // Get the download URL
      console.log("Fetching download URL...");
      const downloadURL = await storageRef.getDownloadURL();
      console.log("Download URL fetched:", downloadURL);

      // Update the user's Firestore document with the new photoURL
      console.log("Updating Firestore with new photoURL...");
      await firestore().collection('users').doc(currentUser.uid).update({
          photoURL: downloadURL
      });
      console.log("Firestore document updated!");

      // Update local state
      setUserInfo(prevState => ({ ...prevState, photoURL: downloadURL }));

      // Optionally, delete the old image from storage
      if (currentAvatarURL) {
          console.log("Deleting old avatar from storage...");
          const oldAvatarRef = storage().refFromURL(currentAvatarURL);
          await oldAvatarRef.delete();
          console.log("Old avatar deleted!");
      }

      alert('Avatar updated successfully!');
  } catch (error) {
      console.error("Error updating avatar:", error);
      alert('Error updating avatar: ' + error.message);
  }
};
