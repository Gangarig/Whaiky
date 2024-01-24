import React, { useState, useEffect, useCallback,useRef } from 'react';
import { View, FlatList, TouchableOpacity, ActivityIndicator, Text, RefreshControl } from 'react-native';
import PostCard from '../../../components/PostCard';
import { useAuth } from '../../../context/AuthContext';
import firestore from '@react-native-firebase/firestore';
import UserTheme from '../../../constant/Theme';
import { StyleSheet } from 'react-native';
import { showMessage } from "react-native-flash-message";

const MyPosts = ({ navigation }) => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [myPostIds, setMyPostIds] = useState([]);

  useEffect(() => {
    const fetchPostIds = async () => {
      try {
        const querySnapshot = 
          await firestore()
            .collection('users')
            .doc(currentUser.uid)
            .collection('myPosts')
            .get();
  
        const fetchedPostIds = querySnapshot.docs.map(doc => doc.data().postId);
        setMyPostIds(fetchedPostIds);
      } catch (error) {
        console.error('Error fetching post ids:', error);
      }
    };
  
    fetchPostIds();
  }, [currentUser.uid]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsPromises = myPostIds.map(postId => 
          firestore().collection('posts').doc(postId).get()
        );
  
        const postsSnapshots = await Promise.all(postsPromises);
        const fetchedPosts = postsSnapshots.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
  
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
  
    if (myPostIds.length > 0) {
      fetchPosts();
    }
  }, [myPostIds]);
  
  
  const navigateToPostDetail = (postId) => {
    navigation.navigate('PostDetail', { id: postId});
  }

  return (
    <View style={styles.container}>
        <FlatList
          data={posts}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.postCardWrapper}>
              <PostCard post={item} navigation={navigation} onPress={() => navigateToPostDetail(item.id)}/>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.flatList}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}

      
          numColumns={2}
          ListEmptyComponent={() => (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 25, color: UserTheme.text }}>No posts found</Text>
            </View>
          )}
        />
    </View>
  );
};

export default MyPosts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UserTheme.background,
    width: '100%',
  },
  postCardWrapper: {
    flex: 1,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
});
