import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet, TouchableOpacity, Alert, Modal, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../context/AuthContext';
import PrimaryButton from '../../../components/Buttons/PrimaryButton';
import PostCardDetail from '../../../components/PostCardDetail';

const PostDetail = ({ route, navigation }) => {
  const currentUser = useAuth(); // from your user context
  const { id } = route.params;
  const [post, setPost] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [viewImageIndex, setViewImageIndex] = useState(null);


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
    toggleConfirmModal();
  };

  const confirmDelete = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        { text: 'Delete', onPress: deleteDocumentAndImage, style: 'destructive' },
      ],
      { cancelable: true }
    );
  };
  const handleSelect = () => {

  };
  const handleContact = () => {

  };

  return (
    <ScrollView style={styles.container}>
      {post ? <PostCardDetail post={post}/> : <Text>Loading...</Text>}
      <View style={styles.buttonBox}>
        {currentUser && currentUser.uid === post?.ownerId && (
            <PrimaryButton text="Delete" onPress={confirmDelete} />
        )}
            <PrimaryButton text='Send a Message' onPress={handleSelect}/>
            <PrimaryButton text='Book Now' onPress={handleContact}/>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFBFB',
    position: 'relative',
  },
  buttonBox: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 100,
  }


});

export default PostDetail;
