import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../../context/AuthContext';
import PostCardDetail from '../../../components/PostCardDetail';
import { useTheme } from '../../../context/ThemeContext';

const PostDetail = ({ route, navigation }) => {
  const currentUser = useAuth(); 
  const theme = useTheme();
  const styles = getStyles(theme);
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

  return (
    <ScrollView style={styles.container}>
      {post ? <PostCardDetail navigation={navigation} post={post}/> : <Text>Loading...</Text>}
      <View style={styles.padding}></View>
    </ScrollView>
  );
};

  const getStyles = theme => {
    return StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: theme.background,
        position: 'relative',
      },
      padding: {
        height: 100,
      },
    });
  }


export default PostDetail;
