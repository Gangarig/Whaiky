import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';
import { Global } from '../../../constant/Global';
import { shadowStyle } from '../../../constant/Shadow';
import PostCard from '../../../components/PostCard';

const CategoryDetail = ({ navigation, route }) => {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [endReached, setEndReached] = useState(false);
  const { optionId } = route.params;

  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
        setEndReached(false); // Reset endReached on refresh
      } else if (endReached) {
        // If we've already reached the end, don't attempt to fetch more
        return;
      } else {
        setLoadingMore(true);
      }

      let query = firestore().collection('posts').where('optionId', '==', optionId);

      if (!isRefresh && lastVisible) {
        query = query.startAfter(lastVisible);
      }

      const snapshot = await query.limit(10).get();

      const fetchedPosts = snapshot.docs.map(doc => {
        const post = doc.data();
        if (!post.title || !post.description || !post.price) {
          return null; // Skip posts with missing fields
        }
        return { ...post, id: doc.id };
      }).filter(Boolean); // Filter out null values

      if (isRefresh) {
        setPosts(fetchedPosts);
      } else {
        setPosts(prevPosts => [...prevPosts, ...fetchedPosts]);
      }

      if (snapshot.docs.length > 0) {
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      }

      if (snapshot.docs.length < 10) {
        setEndReached(true); // No more posts to load
      }
    } catch (error) {
      showMessage({ message: error.message, type: "danger" });
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoadingMore(false);
      }
    }
  }, [optionId, lastVisible, endReached]);

  useEffect(() => {
    fetchData(true); // Initial fetch
  }, [fetchData]);

  const handleRefresh = () => {
    fetchData(true);
  };

  const handleLoadMore = () => {
    if (!loadingMore && !endReached) {
      fetchData();
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.postWrapper, shadowStyle]}>
      <PostCard
        navigation={navigation}
        post={item}
        onPress={() => navigation.navigate('PostDetail', { id: item.id })}
      />
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        numColumns={2}
        keyExtractor={(item, index) => `${item.id}-${index}`} // Ensure unique keys
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={
          <View style={styles.NoPosts}>
            <Text style={Global.titleSecondary}>No posts available in this category.</Text>
          </View>
        }
      />
    </View>
  );
};

export default CategoryDetail;

const styles = StyleSheet.create({
  NoPosts: {
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postWrapper: {
    width: '50%',
    padding: 5,
  },
});
