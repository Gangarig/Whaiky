import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Button, RefreshControl } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const Home = ({ navigation }) => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  const fetchData = async () => {
    if (!currentUser) return;

    setRefreshing(true);

    try {
      const postsCollection = firestore().collection('posts');
      const snapshot = await postsCollection.get();
      const fetchedPosts = [];

      snapshot.forEach(doc => {
        const post = { id: doc.id, ...doc.data() };
        fetchedPosts.push(post);
      });

      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }

    setRefreshing(false);
  };

  const handleRefresh = () => {
    fetchData();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('postDetail', { id: item.id })}>
      <View style={{ margin: 10, padding: 10, borderWidth: 1, borderColor: '#ccc' }}>
        <Text style={{ fontSize: 18 }}>{item.title}</Text>
        <Text style={{ fontSize: 16, color: '#777' }}>Price: {item.price}</Text>
        <Image source={{ uri: item.imageURL }} style={{ width: 100, height: 100 }} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView>
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
          <Button title='AddPost' onPress={() => navigation.navigate('addPost')} />
          <Button title='Refresh' onPress={handleRefresh} />
        </View>
        {refreshing && <Text>Loading...</Text>}
        {currentUser ? (
          <FlatList
            data={posts}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={fetchData}
              />
            }
            ListEmptyComponent={<Text>No posts available.</Text>}
          />
        ) : (
          <Text>Please sign in to see posts.</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Home;
