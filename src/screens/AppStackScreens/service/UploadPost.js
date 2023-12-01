import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import { showMessage } from 'react-native-flash-message';

const handlePost = async (post, currentUser, navigation) => {
  if (!post.title || !post.price || !post.description) {
    showMessage({
      message: 'Please ensure the title, price, and description are filled out.',
      type: 'warning',
    });
    return;
  }

  const newPostRef = firestore().collection('posts').doc();

  try {
    let imageUrls = [];
    if (post.images.length > 0) {
      for (const image of post.images) {
        const storagePath = await uploadImage(image.path, newPostRef.id);
        const downloadURL = await firebase.storage().ref(storagePath).getDownloadURL();
        imageUrls.push(downloadURL);
      }
    }

    const postData = {
      ...post,
      images: imageUrls,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };

    await newPostRef.set(postData);

    showMessage({
      message: 'Post created successfully!',
      type: 'success',
    });
    navigation.goBack();
  } catch (error) {
    console.error('Error creating post:', error);
    showMessage({
      message: 'There was an error creating the post.',
      type: 'danger',
    });
  }
};

export default handlePost;
