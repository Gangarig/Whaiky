import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, RefreshControl, StyleSheet, ActivityIndicator
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../../context/AuthContext';
import PostCard from '../../../components/PostCard';
import PostCardSecondary from '../../../components/PostCardSecondary';
import UserTheme from '../../../constant/Theme';

const Home = ({ navigation }) => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const lastFetchedPost = useRef(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async (loadMore = false) => {
    if (loadingMore && !loadMore) return;
    setLoadingMore(true);
    console.log('Fetching posts...');
    try {
      let query = firestore()
        .collection('posts')
        .orderBy('timestamp', 'desc')
        .limit(20);
  
      if (loadMore && lastFetchedPost.current) {
        query = query.startAfter(lastFetchedPost.current);
      }
  
      const snapshot = await query.get();
      let fetchedPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
      // Apply rearrangement here for both initial load and loading more
      let newPosts = rearrangePosts(fetchedPosts);
  
      if (newPosts.length > 0) {
        if (loadMore) {
          // When loading more, combine with existing posts
          newPosts = [...posts, ...newPosts];
        }
        lastFetchedPost.current = snapshot.docs[snapshot.docs.length - 1];
        setPosts(newPosts);
        setHasMore(newPosts.length === 20);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoadingMore(false);
      if (!loadMore) setRefreshing(false);
    }
  };
  
  

  const onRefresh = () => {
    setRefreshing(true);
    lastFetchedPost.current = null;
    fetchPosts();
  };

  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
      fetchPosts(true);
    }
  };
  const rearrangePosts = (originalPosts) => {
    // Separate sale and normal posts into different arrays
    const normalPosts = originalPosts.filter(post => !post.sale);
    const salePosts = originalPosts.filter(post => post.sale);
  
    let rearrangedPosts = [];
    let salePostIndex = 0;
  
    for (let i = 0; i < normalPosts.length; i++) {
      // Add normal posts to the rearranged array
      rearrangedPosts.push(normalPosts[i]);
  
      // Check the conditions to insert a sale post next
      if (salePostIndex < salePosts.length) {
        // Check if it's the right moment to add a sale post
        // We add a sale post after every 1 or 2 normal posts, depending on the situation
        if (i % 2 === 1 || (i % 2 === 0 && i + 1 === normalPosts.length)) { // Adjusted logic for when to insert sale posts
          rearrangedPosts.push(salePosts[salePostIndex++]);
        }
      }
    }
  
    // If there are any remaining sale posts, add them to the end
    while (salePostIndex < salePosts.length) {
      rearrangedPosts.push(salePosts[salePostIndex++]);
    }
  
    return rearrangedPosts;
  };
  

  // Call the rearrangePosts function before rendering
  const arrangedPosts = rearrangePosts(posts);
  const renderPosts = () => {
    return arrangedPosts.map(post => (
      <View
        style={post.sale ? styles.postWrapperSale : styles.postWrapper}
        key={post.id}
      >
        {post.sale ? (
          <PostCardSecondary
            post={post}
            onPress={() => navigation.navigate('PostDetail', { id: post.id })}
          />
        ) : (
          <PostCard
            post={post}
            onPress={() => navigation.navigate('PostDetail', { id: post.id })}
          />
        )}
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      {currentUser ? (
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          onScroll={({ nativeEvent }) => {
            if (isCloseToBottom(nativeEvent)) {
              handleLoadMore();
            }
          }}
          scrollEventThrottle={400}
        >
          <View style={styles.postsWrapper}>
            {renderPosts()}
          </View>
          {loadingMore && <ActivityIndicator size="large" color="#0000ff" />}
        </ScrollView>
      ) : (
        <Text>Please sign in to see posts.</Text>
      )}
    </View>
  );
};

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UserTheme.background,
  },
  scrollViewContent: {
    alignItems: 'center',
  },
  postsWrapper: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  postWrapper: {
    width: '50%',
    padding: 5,
  },
  postWrapperSale: {
    width: '100%',
    padding: 5,
  },
});

export default Home;
