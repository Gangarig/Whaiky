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

    try {
      let query = firestore()
        .collection('posts')
        .orderBy('timestamp', 'desc')
        .limit(10);

      if (loadMore && lastFetchedPost.current) {
        query = query.startAfter(lastFetchedPost.current);
      }

      const snapshot = await query.get();
      const fetchedPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (fetchedPosts.length > 0) {
        lastFetchedPost.current = snapshot.docs[snapshot.docs.length - 1];
        setPosts(prevPosts => loadMore ? [...prevPosts, ...fetchedPosts] : fetchedPosts);
        setHasMore(fetchedPosts.length === 10);
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
            {posts.map(post => (
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
            ))}
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
