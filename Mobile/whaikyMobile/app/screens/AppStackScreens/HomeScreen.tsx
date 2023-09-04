import React, { useContext, useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Button, RefreshControl } from 'react-native';
import {
  collection,
  getDocs,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { useUser } from '../../context/UserContext';
import { db, firestore, auth } from '../../../FirebaseConfig';
import { NavigationProp } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  imageName: string;
}

const HomeScreen = ({ navigation }: any) => {
  const { currentUser } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false); // Add this state variable

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  const fetchData = async () => {
    if (!currentUser) return;

    setRefreshing(true); // Set refreshing to true when you start fetching data

    const postsRef = collection(firestore, 'posts');
    try {
      const querySnapshot = await getDocs(postsRef);
      const fetchedPosts: Post[] = [];

      querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        const post = { id: doc.id, ...doc.data() } as Post;
        fetchedPosts.push(post);
      });

      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }

    setRefreshing(false); // Set refreshing to false when fetching is complete
  };

  const handleRefresh = () => {
    fetchData();
  };

  const renderItem = ({ item }: { item: Post }) => (
    <SafeAreaView>
      <TouchableOpacity onPress={() => navigation.navigate('postDetail', { id: item.id })}>
        <View style={{ margin: 10, padding: 10, borderWidth: 1, borderColor: '#ccc' }}>
          <Text style={{ fontSize: 18 }}>{item.title}</Text>
          <Text style={{ fontSize: 16, color: '#777' }}>Price: {item.price}</Text>
          <Image source={{ uri: item.imageURL }} style={{ width: 100, height: 100 }} />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );

  return (
    <SafeAreaView>
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
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

export default HomeScreen;

