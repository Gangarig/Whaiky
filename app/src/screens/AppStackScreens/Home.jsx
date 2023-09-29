import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Button, RefreshControl } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const Home = ({ navigation }) => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [firstVisible, setFirstVisible] = useState(null);

      
  const initialFetch = async () => {
    try {
      const query = firestore()
        .collection('posts')
        .orderBy('createdAt', 'desc') // assuming you have a createdAt field
        .limit(5);
        
      const snapshot = await query.get();

      if (!snapshot.empty) {
        const fetchedPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(fetchedPosts);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        setFirstVisible(snapshot.docs[0]);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchMore = async () => {
    if (lastVisible) {
      try {
        const query = firestore()
          .collection('posts')
          .orderBy('createdAt', 'desc')
          .startAfter(lastVisible)
          .limit(5);
          
        const snapshot = await query.get();

        if (!snapshot.empty) {
          const newPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setPosts(prevState => [...prevState, ...newPosts]);
          setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        }
      } catch (error) {
        console.error('Error fetching more posts:', error);
      }
    }
  };

  const fetchNew = async () => {
    if (firstVisible) {
      try {
        const query = firestore()
          .collection('posts')
          .orderBy('createdAt', 'desc')
          .endBefore(firstVisible)
          .limit(5);
          
        const snapshot = await query.get();

        if (!snapshot.empty) {
          const newPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setPosts(prevState => [...newPosts, ...prevState]);
          setFirstVisible(snapshot.docs[0]);
        }
      } catch (error) {
        console.error('Error fetching new posts:', error);
      }
    }
  };

  useEffect(() => {
    initialFetch();
  }, [currentUser]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNew();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('PostDetail', { id: item.id })}>
      <View style={{ margin: 10, padding: 10, borderWidth: 1, borderColor: '#ccc' }}>
        <Text style={{ fontSize: 18 }}>{item.title}</Text>
        <Text style={{ fontSize: 16, color: '#777' }}>Price: {item.price}</Text>
        <Image source={{ uri: item.images[0] }} style={{ width: 100, height: 100 }} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView>
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
          <Button title='AddPost' onPress={()=> navigation.navigate('AddPost')} />
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
              onRefresh={handleRefresh}
            />
          }
          onEndReached={fetchMore}
          onEndReachedThreshold={0.5} // Fetch more posts when the user is halfway through the list
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
