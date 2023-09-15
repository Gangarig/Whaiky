import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, FlatList, SafeAreaView } from 'react-native'; 
import firestore from '@react-native-firebase/firestore';  // Updated the import for React Native Firebase

interface Post {
  id: string;
  title: string;
  description: string; 
  price: string;
  imageURL: string;
  ownerId: string; 
  ownerName: string; 
  ownerAvatar: string; 
  optionId: number;
}

const CategoryDetail = ( {navigation, route} :any) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const { optionId } = route.params; // Make sure to type this properly
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsRef = firestore().collection('posts');
        const fetchedPosts: Post[] = [];

        const snapshot = await postsRef.where('optionId', '==', optionId).get();
        
        snapshot.forEach(doc => {
          const post = { id: doc.id, ...doc.data() } as Post;
          fetchedPosts.push(post);
        });

        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchData();
  }, [optionId]);

  const renderItem = ({ item }: { item: Post }) => (
    <View style={{ margin: 10, padding: 10, borderWidth: 1, borderColor: '#ccc' }}>
      <Text style={{ fontSize: 18 }}>{item.title}</Text>
      <Text style={{ fontSize: 16, color: '#777' }}>Price: {item.price}</Text>
      <Image source={{ uri: item.imageURL }} style={{ width: 100, height: 100 }} />
        <Button title='View Detail' onPress={() => navigation.navigate('postDetail', { id: item.id })} />
    </View>
  );

  return (
    <SafeAreaView>
        <Button title='Go Back' onPress={()=> navigation.goBack()}/>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
};

export default CategoryDetail;
