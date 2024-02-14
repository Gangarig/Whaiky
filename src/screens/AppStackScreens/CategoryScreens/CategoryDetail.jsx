import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';
import { Global } from '../../../constant/Global';
import { shadowStyle } from '../../../constant/Shadow';
import PostCard from '../../../components/PostCard';

const CategoryDetail = ({ navigation, route }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const { optionId } = route.params;
  console.log('optionId:', optionId);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await firestore()
        .collection('posts')
        .where('optionId', '==', optionId)
        .limit(10)
        .orderBy('timestamp', 'desc')
        .get();
      const data = querySnapshot.docs.map(doc => doc.data());
      setPosts(data);
      if (querySnapshot.docs.length > 0) {
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 2]);
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
  };

  const fetchMorePosts = async () => {
    if (lastVisible) {
      setLoading(true);
      try {
        const querySnapshot = await firestore()
          .collection('posts')
          .where('optionId', '==', optionId)
          .orderBy('timestamp', 'desc') // Move this line here
          .startAfter(lastVisible) // Move this line here
          .limit(10)
          .get();
        const data = querySnapshot.docs.map(doc => doc.data());
        setPosts(prevPosts => [...prevPosts, ...data]);
        if (querySnapshot.docs.length > 0) {
          setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        }
      } catch (error) {
        console.error('Error fetching more posts:', error);
        showMessage({
          message: 'Error',
          description: 'Failed to fetch more posts. Please try again later.',
          type: 'danger',
        });
      } finally {
        setLoading(false);
      }
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

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPosts().then(() => setRefreshing(false));
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        numColumns={2}
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
        onEndReached={fetchMorePosts}
        onEndReachedThreshold={0.5} // Adjust as needed
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
    padding: 5,
  },
});

export default CategoryDetail;


