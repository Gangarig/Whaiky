import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';
import { Global } from '../../../constant/Global';
import PostCard from '../../../components/PostCard';

const CategoryDetail = ({ navigation, route }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const { optionId } = route.params;
  const [allPosts, setAllPosts] = useState([]);
  console.log(posts);
  fetchAllPosts = async () => {
    try {
      const querySnapshot = await firestore().collection('posts').get();
      const data = querySnapshot.docs.map(doc => doc.data());
      setAllPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      showMessage({
        message: 'Error',
        description: 'Failed to fetch posts. Please try again later.',
        type: 'danger',
      });
    }
  };

  console.log(allPosts);


  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      let query = firestore().collection('posts').where('optionId', '==', optionId).orderBy('timestamp', 'desc');
      if (lastVisible) {
        query = query.startAfter(lastVisible);
      }
      const querySnapshot = await query.limit(10).get();
      const data = querySnapshot.docs.map(doc => doc.data());
      setPosts(prevPosts => (lastVisible ? [...prevPosts, ...data] : data));
      if (querySnapshot.docs.length > 0) {
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      showMessage({
        message: 'Error',
        description: 'Failed to fetch posts. Please try again later.',
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, [optionId, lastVisible]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setLastVisible(null); // Reset lastVisible when refreshing
    fetchPosts().then(() => setRefreshing(false));
  }, [fetchPosts]);

  const handleEndReached = useCallback(() => {
    if (!loading && lastVisible) {
      fetchPosts();
    }
  }, [fetchPosts, loading, lastVisible]);

  useEffect(() => {
    fetchAllPosts();
    fetchPosts();
  }, [fetchPosts]);

  const renderItem = ({ item }) => (
    <View style={styles.postWrapper}>
      <PostCard
        navigation={navigation}
        post={item}
        onPress={() => navigation.navigate('PostDetail', { id: item.postId })}
      />
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.NoPosts}>
            <Text style={Global.titleSecondary}>
              No posts available in this category.
            </Text>
          </View>
        }
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  NoPosts: {
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postWrapper: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
});

export default CategoryDetail;
