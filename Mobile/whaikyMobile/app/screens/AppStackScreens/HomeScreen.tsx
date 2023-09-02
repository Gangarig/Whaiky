import React, { useContext, useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Button } from 'react-native';
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
}


const HomeScreen = ({ navigation }:any) => {
  const { currentUser } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    const postsRef = collection(firestore, 'posts');

    const fetchData = async () => {
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
    };

    fetchData();
  }, [currentUser]);

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
    <View>
      {currentUser ? (
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      ) : null}
      <Button title="Complete" onPress={() => navigation.navigate('Complete')} />
      <Button title="Profile" onPress={() => navigation.navigate('Profile')} />
    </View>
  );
};

export default HomeScreen;
