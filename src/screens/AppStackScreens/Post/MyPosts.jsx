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
  const [refreshing , setRefreshing] = useState(false);

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

        fetchedPosts.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
  
        setPosts(fetchedPosts);
        console.log("Fetched posts:", fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
  
    if (myPostIds.length > 0) {
      fetchPosts();
    }
  }, [myPostIds]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const querySnapshot = await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .collection('myPosts')
        .get();
  
      const fetchedPostIds = querySnapshot.docs.map(doc => doc.data().postId);
      setMyPostIds(fetchedPostIds);
    } catch (error) {
      console.error('Error fetching post ids:', error);
    } finally {
      setRefreshing(false);
    }
  }, [currentUser.uid]);
  
  
  const navigateToPostDetail = (postId) => {
    navigation.navigate('PostDetail', { id: postId});
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <View style={styles.postCardWrapper}>
            <PostCard post={item} onPress={()=>navigateToPostDetail(item.id)}/>
          </View>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.flatList}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        ListEmptyComponent={<Text style={{ fontSize: 25, color: UserTheme.text,paddingTop:30 }}>No posts found</Text>}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  postCardWrapper: {
    width: '50%',
    padding: 5,
  },
});
