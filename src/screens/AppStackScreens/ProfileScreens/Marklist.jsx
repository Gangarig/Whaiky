import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../../context/AuthContext';
import PostCard from '../../../components/PostCard';
import { useTheme } from '../../../context/ThemeContext';

const Marklist = ({ navigation }) => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();
  const styles = getStyles(theme);

  const fetchPosts = async () => {
    try {
      // Fetch the marked post IDs
      const markedPostsSnapshot = await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .collection('markedPosts')
        .get();
      const markedPostIds = markedPostsSnapshot.docs.map(doc => doc.id);
  
      const postsPromises = markedPostIds.map(postId =>
        firestore().collection('posts').doc(postId).get()
      );
      const postsSnapshots = await Promise.all(postsPromises);
  
      const fetchedPosts = [];
      postsSnapshots.forEach((doc, index) => {
        if (doc.exists) {
          fetchedPosts.push({ id: doc.id, ...doc.data() });
        } else {
          // Remove the non-existent post from markedPosts
          firestore()
            .collection('users')
            .doc(currentUser.uid)
            .collection('markedPosts')
            .doc(markedPostIds[index])
            .delete()
            .then(() => console.log(`Deleted non-existent marked post: ${markedPostIds[index]}`))
            .catch(error => console.error("Error removing non-existent marked post:", error));
        }
      });
  
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };
  
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .doc(currentUser.uid)
      .collection('markedPosts')
      .onSnapshot(snapshot => {
        const newMarkedPostIds = snapshot.docs.map(doc => doc.id);
        Promise.all(
          newMarkedPostIds.map(postId =>
            firestore().collection('posts').doc(postId).get()
          )
        ).then(postsSnapshots => {
          const newPosts = [];
          postsSnapshots.forEach((doc, index) => {
            if (doc.exists) {
              newPosts.push({ id: doc.id, ...doc.data() });
            } else {
              // Remove the non-existent post from markedPosts
              firestore()
                .collection('users')
                .doc(currentUser.uid)
                .collection('markedPosts')
                .doc(newMarkedPostIds[index])
                .delete()
                .then(() => console.log(`Deleted non-existent marked post: ${newMarkedPostIds[index]}`))
                .catch(error => console.error("Error removing non-existent marked post:", error));
            }
          });
          setPosts(newPosts);
        });
      });
  
    return () => unsubscribe();
  }, [currentUser.uid]);
  

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts().then(() => setRefreshing(false));
  }, []);

  return (
    <FlatList
      data={posts}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={styles.postWrapper}>
          <PostCard
            post={item}
            onPress={() => navigation.navigate('PostDetail', { id: item.id })}
            saved={true}
          />
        </View>
      )}
      numColumns={2}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
      ListEmptyComponent={
        <View style={styles.centered}>
          <Text style={styles.title}>No marked posts available.</Text>
        </View>
      }
    />
  );
};

const getStyles = (theme) => StyleSheet.create({
  postWrapper: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  title: {
    fontSize: 20,
    color: theme.text,
  },
});

export default Marklist;