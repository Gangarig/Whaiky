import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, Button, FlatList, SafeAreaView, RefreshControl, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';

const CategoryDetail = ({ navigation, route }) => {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { optionId } = route.params;

  const fetchData = useCallback(async () => {
    setRefreshing(true);
    try {
      const postsRef = firestore().collection('posts');
      const snapshot = await postsRef.where('optionId', '==', optionId).get();
      
      const fetchedPosts = snapshot.docs.map(doc => {
        const post = doc.data();
        if (!post.title || !post.description || !post.price) {
          return null; // If any of these fields are missing, don't add the post to the list
        }
        return { id: doc.id, ...post };
      }).filter(Boolean); // Remove any `null` items

      setPosts(fetchedPosts);
    } catch (error) {
      showMessage({ message: error.message, type: "danger" });
    }
    setRefreshing(false);
  }, [optionId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>Price: {item.price}</Text>
      {item.imageURL && <Image source={{ uri: item.imageURL }} style={styles.image} />}
      <Button title='View Detail' onPress={() => navigation.navigate('PostDetail', { id: item.id })} />
    </View>
  );

  return (
    <SafeAreaView>
      <Button title='Go Back' onPress={() => navigation.goBack()} />
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchData} />}
        ListEmptyComponent={<Text>No posts available in this category.</Text>}
      />
    </SafeAreaView>
  );
};

export default CategoryDetail;

const styles = StyleSheet.create({
  itemContainer: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc'
  },
  title: {
    fontSize: 18
  },
  price: {
    fontSize: 16,
    color: '#777'
  },
  image: {
    width: 100,
    height: 100
  }
});
