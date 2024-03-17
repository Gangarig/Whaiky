import React, { useState, useEffect, useCallback,useRef } from 'react';
import { View, FlatList, TouchableOpacity, ActivityIndicator, Text, RefreshControl } from 'react-native';
import PostCard from '../../../components/PostCard';
import { useAuth } from '../../../context/AuthContext';
import firestore from '@react-native-firebase/firestore';
import { useTheme } from '../../../context/ThemeContext';
import { StyleSheet } from 'react-native';
import { showMessage } from "react-native-flash-message";

const MyPosts = ({ navigation }) => {
  const { currentUser } = useAuth();
  const theme = useTheme();
  const styles = getStyles(theme);
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
          ...(doc.data() || {}), 
          timestamp: doc.data()?.timestamp || { seconds: 0 }, 
        }));
  
        fetchedPosts.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
  
        setPosts(fetchedPosts);
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
        style={styles.flatList}
        renderItem={({ item }) => (
          <View style={styles.postCardWrapper}>
            <PostCard post={item} onPress={()=>navigateToPostDetail(item.id)}/>
          </View>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.flatList}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        ListEmptyComponent={
        <View style={styles.centered}>
        <Text style={styles.title}>No posts found</Text>
        </View>
      }
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

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    width: '100%',
    justifyContent: 'center',
    paddingTop: 16,
  },
  postCardWrapper: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  title: {
    fontSize: 20,
    color: theme.text,
  },

});
