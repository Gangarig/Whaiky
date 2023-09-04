import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, Alert , StyleSheet } from 'react-native'; 
import { getDoc, doc, deleteDoc, DocumentData } from 'firebase/firestore';  
import { firestore } from '../../../FirebaseConfig';
import { useUser } from '../../context/UserContext'; 
import { getStorage, ref, deleteObject } from "firebase/storage";
import { SafeAreaView } from 'react-native-safe-area-context';


interface Post {
  id: string;
  title: string;
  description: string; 
  price: string;
  imageURL: string;
  ownerId: string; 
  ownerName: string; 
  ownerAvatar: string; 
  imageName: string;
  postId: string;
}

const PostDetailScreen = ({ route, navigation }: any) => {
  const { currentUser } = useUser(); // from your user context
  const { id } = route.params;
  const [post, setPost] = useState<Post | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);


  const handleGoBack = () => {
    navigation.goBack();
  };

  const toggleConfirmModal = () => {
    setShowConfirmModal(!showConfirmModal);
  };
  


  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(firestore, 'posts', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPost({ id: docSnap.id, imageName: docSnap.data().imageName, ...docSnap.data() } as Post);

        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };
    fetchData();
  }, [id]);

  async function deleteDocument() {
    const docRef = doc(firestore, 'posts', id); // replace 'collectionName' and 'documentId' with your actual collection name and document ID
    await deleteDoc(docRef);
    navigation.goBack();
  }
  const deleteImageFromStorage = async () => {
    const storage = getStorage();
    const imageRef = ref(storage, `post_images/${post?.imageName}`);
    try {
      await deleteObject(imageRef);
      console.log("Deleted from Storage");
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };
  const deleteDocumentAndImage = async () => {
    // Delete from Firestore
    await deleteDocument();
    // Delete from Storage
    await deleteImageFromStorage();
  };




  return (
    <SafeAreaView>
    <View >
      <Button title="Go Back" onPress={handleGoBack} />
      {post ? (
        <>
          <Text>Title: {post.title}</Text>
          <Text>Description: {post.description}</Text>
          <Text>Price: {post.price}</Text>
          <Text>Owner ID: {post.ownerId}</Text>
          <Text>Owner Name: {post.ownerName}</Text>
          <Text>Post ID: {post.postId}</Text>
          <Text>Image Name: {post.imageName}</Text>
          <Image source={{ uri: post.ownerAvatar }} style={{ width: 50, height: 50 }} />
          <Image source={{ uri: post.imageURL }} style={{ width: 100, height: 100 }} />
          {currentUser?.uid === post.ownerId && <Button title="Delete" onPress={toggleConfirmModal} />}
          <View>
          {showConfirmModal && (
            <View style={styles.confirmModal}>
              <Text>Are you sure you want to delete this post?</Text>
              <Button title="Yes" onPress={async () => {
                await deleteDocumentAndImage();
                toggleConfirmModal();
              }} />
              <Button title="No" onPress={toggleConfirmModal} />
          </View>
            )}
          </View>

        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  confirmModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
 
});


export default PostDetailScreen;
