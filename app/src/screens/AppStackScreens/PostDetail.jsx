import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

const PostDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [post, setPost] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = firestore().collection('posts').doc(id);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
          setPost({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };
    fetchData();
  }, [id]);

  const deleteDocument = async () => {
    const docRef = firestore().collection('posts').doc(id);
    await docRef.delete();
    navigation.goBack();
  };

  const deleteImageFromStorage = async (imageName) => {
    const imageRef = storage().ref(`post_images/${imageName}`);
    try {
      await imageRef.delete();
      console.log("Deleted from Storage");
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const deleteDocumentAndImage = async () => {
    // Delete from Firestore
    await deleteDocument();
    // Delete from Storage
    if (post && post.imageName) {
      await deleteImageFromStorage(post.imageName);
    }
  };

  return (
    <SafeAreaView>
      <View>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
        {post ? (
          <>
            <Text>Title: {post.title}</Text>
            <Text>Description: {post.description}</Text>
            <Text>Price: {post.price}</Text>
            <Image source={{ uri: post.imageURL }} style={{ width: 100, height: 100 }} />
            {/* Additional fields as per your data structure */}
            {post && currentUser && post.ownerId === currentUser.uid && (
              <Button title="Delete" onPress={deleteDocumentAndImage} />
            )}

          </>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default PostDetailScreen;
