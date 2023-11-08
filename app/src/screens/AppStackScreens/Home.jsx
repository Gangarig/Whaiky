import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity,
  Button, RefreshControl, SafeAreaView, StyleSheet
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { showMessage } from 'react-native-flash-message';

const DEFAULT_IMAGE = require('./../../../assets/images/default.png');

const Home = ({ navigation }) => {
  const { currentUser, profile , loading} = useAuth();
  
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [firstVisible, setFirstVisible] = useState(null);

  useEffect(() => {
    fetchPosts('initial');
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPosts('new');
    setRefreshing(false);
  };

  const fetchPosts = async (direction) => {
    try {
      let query;
      if (direction === 'initial' || direction === 'new') {
        query = firestore()
          .collection('posts')
          .orderBy('createdAt', 'desc')
          .limit(5);

        if (direction === 'new' && firstVisible) {
          query = query.endBefore(firstVisible);
        }
      } else if (direction === 'more' && lastVisible) {
        query = firestore()
          .collection('posts')
          .orderBy('createdAt', 'desc')
          .startAfter(lastVisible)
          .limit(5);
      }

      if (query) {
        const snapshot = await query.get();
        let fetchedPosts = snapshot.docs.map(doc => {
          const post = doc.data();
          if (!post.title || !post.description || !post.price) {
            throw new Error('Post data is incomplete');
          }
          return { id: doc.id, ...post };
        });

        // Filter out duplicates based on id
        if (direction !== 'initial') {
          fetchedPosts = fetchedPosts.filter(newPost => 
            !posts.some(existingPost => existingPost.id === newPost.id)
          );
        }

        if (direction === 'initial') {
          setPosts(fetchedPosts);
        } else if (direction === 'more') {
          setPosts(prevState => [...prevState, ...fetchedPosts]);
        } else if (direction === 'new') {
          setPosts(fetchedPosts);
        }
        
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        setFirstVisible(snapshot.docs[0]);
      }
    } catch (error) {
      showMessage({
        message: error.message || 'Failed to fetch posts',
        type: "danger",
      });
    }
  };

  const checkPostExistence = async (postId) => {
    try {
      const doc = await firestore().collection('posts').doc(postId).get();
      if (!doc.exists) {
        showMessage({
          message: 'This post is no longer available',
          type: "danger",
        });
        handleRefresh();  // refresh to fetch current posts
        return false;
      }
      return true;
    } catch (error) {
      showMessage({
        message: error.message,
        type: "danger",
      });
      return false;
    }
  };

  const navigateToPostDetail = async (postId) => {
    const exists = await checkPostExistence(postId);
    if (exists) {
      navigation.navigate('PostDetail', { id: postId });
    }
  };

  const checkAccountStatus = () => {
    if (!currentUser) {
      showMessage({
        message: 'Please sign in to create a post.',
        type: "danger",
      });
    } else if (profile !== 'completed') { // Check if profile is complete
      showMessage({
        message: 'Please complete your profile to create a post.',
        type: "danger",
      });
      navigation.navigate('PersonalInfo');  // Navigate to complete the profile if not done
    } else {
      navigation.navigate('AddPost');  // Navigate to the screen to create a post
    }
  };
  
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigateToPostDetail(item.id)}>
      <View style={styles.postContainer}>
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postPrice}>Price: {item.price}</Text>
        {item.images && item.images[0] && (
          <Image source={{ uri: item.images[0] }} style={styles.postImage} />
        )}
      </View>
    </TouchableOpacity>
  );

  // Ensure unique keys for each item
  const keyExtractor = item => item.id;

  return (
    <SafeAreaView style={styles.container}>
      <Button title="Create a Post" onPress={() => checkAccountStatus()} />
      {currentUser ? (
        <FlatList
          style={{ width: '100%' }}
          data={posts}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          onEndReached={() => fetchPosts('more')}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={<Text>No posts available.</Text>}
        />
      ) : (
        <Text>Please sign in to see posts.</Text>
      )}
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  postContainer: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc'
  },
  postTitle: {
    fontSize: 18
  },
  postPrice: {
    fontSize: 16,
    color: '#777'
  },
  postImage: {
    width: 100,
    height: 100
  },
});
