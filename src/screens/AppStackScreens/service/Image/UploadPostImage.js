import firebase from '@react-native-firebase/app';

const uploadImage = async (imageUri, postId, setUploadProgress) => {
  const filename = `${postId}_${Date.now()}.jpg`; // Unique filename for each image
  const storagePath = `posts/${postId}/${filename}`; // Updated path with postId
  const uploadTask = firebase.storage().ref(storagePath).putFile(imageUri);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error(error);
        reject(error);
      },
      () => {
        resolve(storagePath); // Return the storage path upon successful upload
      }
    );
  });
};

export default uploadImage;
