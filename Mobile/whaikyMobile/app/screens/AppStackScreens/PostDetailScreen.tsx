import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, Alert , StyleSheet } from 'react-native'; 
import { getDoc, doc, deleteDoc, DocumentData } from 'firebase/firestore';  
import { firestore } from '../../../FirebaseConfig';
import { useUser } from '../../context/UserContext'; 
interface Post {
  id: string;
  title: string;
  description: string; 
  price: string;
  imageURL: string;
  ownerId: string; 
  ownerName: string; 
  ownerAvatar: string; 
}

const PostDetailScreen = ({ route, navigation }: any) => {
  const { currentUser } = useUser(); // from your user context
  const { id } = route.params;
  const [post, setPost] = useState<Post | null>(null);

  const handleGoBack = () => {
    navigation.goBack();
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(firestore, 'posts', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() } as Post);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await deleteDoc(doc(firestore, 'posts', id));
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting document:', error);
            }
          }
        }
      ]
    );
  };


  return (
    <View >
      {post ? (
        <>
          <Text>Title: {post.title}</Text>
          <Text>Description: {post.description}</Text>
          <Text>Price: {post.price}</Text>
          <Text>Owner ID: {post.ownerId}</Text>
          <Text>Owner Name: {post.ownerName}</Text>
          <Image source={{ uri: post.ownerAvatar }} style={{ width: 50, height: 50 }} />
          <Image source={{ uri: post.imageURL }} style={{ width: 100, height: 100 }} />
          {currentUser?.uid === post.ownerId && <Button title="Delete" onPress={handleDelete} />}
          <Button title="Go Back" onPress={handleGoBack} />
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};


export default PostDetailScreen;
