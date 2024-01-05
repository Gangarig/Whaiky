import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet, TouchableOpacity, Alert, Modal, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../context/AuthContext';
import PrimaryButton from '../../../components/Buttons/PrimaryButton';
import PostCardDetail from '../../../components/PostCardDetail';
import { showMessage } from 'react-native-flash-message';

const PostDetail = ({ route, navigation }) => {
  const currentUser = useAuth(); 
  const { id } = route.params;
  const [post, setPost] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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


  const handleContact = () => {

  };

  return (
    <ScrollView style={styles.container}>
      {post ? <PostCardDetail post={post}/> : <Text>Loading...</Text>}
      <View style={styles.buttonBox}>
        <PrimaryButton text='Contact' onPress={handleContact}/>
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
