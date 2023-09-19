import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, FlatList, SafeAreaView } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const CategoryDetail = ({ navigation, route }) => {
  const [posts, setPosts] = useState([]);
  const { optionId } = route.params;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsRef = firestore().collection('posts');
        const fetchedPosts = [];

        const snapshot = await postsRef.where('optionId', '==', optionId).get();

        snapshot.forEach(doc => {
          const post = { id: doc.id, ...doc.data() };
          fetchedPosts.push(post);
        });

        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchData();
  }, [optionId]);

  const renderItem = ({ item }) => (
    <View style={{ margin: 10, padding: 10, borderWidth: 1, borderColor: '#ccc' }}>
      <Text style={{ fontSize: 18 }}>{item.title}</Text>
      <Text style={{ fontSize: 16, color: '#777' }}>Price: {item.price}</Text>
      <Image source={{ uri: item.imageURL }} style={{ width: 100, height: 100 }} />
      <Button title='View Detail' onPress={() => navigation.navigate('postDetail', { id: item.id })} />
    </View>
  );

  return (
    <SafeAreaView>
      <Button title='Go Back' onPress={() => navigation.goBack()} />
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
};

export default CategoryDetail;
