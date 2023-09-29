import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet, TouchableOpacity, Alert, Modal, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useAuth } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const PostDetail = ({ route, navigation }) => {
  const currentUser = useAuth(); // from your user context
  const { id } = route.params;
  const [post, setPost] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [viewImageIndex, setViewImageIndex] = useState(null);

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

  const openImageView = (index) => {
    setViewImageIndex(index);
  };

  const closeImageView = () => {
    setViewImageIndex(null);
  };

  const renderImages = () => {
    return post.images.map((image, index) => (
      <TouchableOpacity key={index} onPress={() => openImageView(index)}>
        <Image source={{ uri: image }} style={styles.postImageThumbnail} />
      </TouchableOpacity>
    ));
  };

  const renderImageView = () => {
    if (viewImageIndex !== null) {
      return (
        <Modal visible={true} transparent={true}>
          <View style={styles.imageViewContainer}>
            <Image source={{ uri: post.images[viewImageIndex] }} style={styles.postImageFullscreen} />
            <TouchableOpacity style={styles.closeButton} onPress={closeImageView}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            {post.images.length > 1 && (
              <TouchableOpacity style={styles.prevButton} onPress={() => openImageView((viewImageIndex - 1 + post.images.length) % post.images.length)}>
                <Text style={styles.navButtonText}>{"<"}</Text>
              </TouchableOpacity>
            )}
            {post.images.length > 1 && (
              <TouchableOpacity style={styles.nextButton} onPress={() => openImageView((viewImageIndex + 1) % post.images.length)}>
                <Text style={styles.navButtonText}>{">"}</Text>
              </TouchableOpacity>
            )}
          </View>
        </Modal>
      );
    } else {
      return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Text>Go Back</Text>
      </TouchableOpacity>
      {post ? (
        <ScrollView>
          <Text style={styles.postTitle}>{post.title}</Text>
          <Text style={styles.postDescription}>{post.description}</Text>
          <View style={styles.imageContainer}>{renderImages()}</View>
          <Text style={styles.postPrice}>Price: {post.price}</Text>
          <Text style={styles.postOwner}>Posted by: {post.ownerName}</Text>
          <Text style={styles.postType}>Post Type: {post.postType}</Text>
          <Text style={styles.postLocation}>
            Location: {post.location.country}, {post.location.state}, {post.location.city}
          </Text>
          {currentUser?.uid === post.ownerId && (
            <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
              <Text style={{ color: 'white' }}>Delete</Text>
            </TouchableOpacity>
          )}
          {showConfirmModal && (
            <View style={styles.confirmModal}>
              <View style={styles.confirmModalContent}>
                <Text style={styles.confirmText}>Are you sure you want to delete this post?</Text>
                <View style={styles.confirmButtons}>
                  <Button title="Yes" onPress={deleteDocumentAndImage} color="red" />
                  <Button title="No" onPress={toggleConfirmModal} />
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      ) : (
        <Text>Loading...</Text>
      )}
      {renderImageView()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  backButton: {
    marginBottom: 20,
  },
  postTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  postDescription: {
    fontSize: 16,
    marginBottom: 20,
  },
  imageContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  postImageThumbnail: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  postImageFullscreen: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  postPrice: {
    fontSize: 18,
    color: 'green',
    marginBottom: 10,
  },
  postOwner: {
    fontSize: 16,
    color: '#777',
    marginBottom: 10,
  },
  postType: {
    fontSize: 16,
    color: '#777',
    marginBottom: 10,
  },
  postLocation: {
    fontSize: 16,
    color: '#777',
    marginBottom: 20,
  },
  deleteButton: {
    backgroundColor: 'red',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  confirmModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  confirmModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 18,
    marginBottom: 20,
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  imageViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 24,
    color: 'white',
  },
  prevButton: {
    position: 'absolute',
    top: '50%',
    left: 20,
    padding: 10,
    zIndex: 1,
  },
  nextButton: {
    position: 'absolute',
    top: '50%',
    right: 20,
    padding: 10,
    zIndex: 1,
  },
  navButtonText: {
    fontSize: 24,
    color: 'white',
  },
});

export default PostDetail;
