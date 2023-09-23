import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
const PostDetail = ({ route, navigation }) => {
  const currentUser = useAuth(); // from your user context
  const { id } = route.params;
  const [post, setPost] = useState(null);
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
        const docSnap = await firestore().collection('posts').doc(id).get();

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
    await firestore().collection('posts').doc(id).delete();
    navigation.goBack();
  };

  const deleteImageFromStorage = async () => {
    const imageRef = storage().ref(`post_images/${post?.imageName}`);
    try {
      await imageRef.delete();
      console.log("Deleted from Storage");
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const deleteDocumentAndImage = async () => {
    await deleteDocument();
    await deleteImageFromStorage();
  };

  return (
    <SafeAreaView>
      <View>
        <Button title="Go Back" onPress={handleGoBack} />
        {post ? (
          <>
            {/* ... (rest of your post display components) */}
            {currentUser?.uid === post.ownerId && <Button title="Delete" onPress={toggleConfirmModal} />}
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

export default PostDetail;
