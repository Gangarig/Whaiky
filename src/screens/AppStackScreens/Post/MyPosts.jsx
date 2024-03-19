import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, RefreshControl, StyleSheet } from 'react-native';
import PostCard from '../../../components/PostCard';
import { useAuth } from '../../../context/AuthContext';
import firestore from '@react-native-firebase/firestore';
import { useTheme } from '../../../context/ThemeContext';
import { showMessage } from "react-native-flash-message";

const MyPosts = ({ navigation }) => {
  const { currentUser } = useAuth();
  const theme = useTheme();
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Attach a listener to Firestore for real-time updates
    const unsubscribe = firestore()
      .collection('posts')
      .where('ownerId', '==', currentUser.uid)
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        const updatedPosts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp || { seconds: 0 },
        }));
        setPosts(updatedPosts);
        if (refreshing) setRefreshing(false);
      }, err => {
        console.error('Error fetching posts:', err);
        showMessage({
          message: "Error",
          description: "There was an error fetching your posts. Please try again later.",
          type: "danger",
        });
        if (refreshing) setRefreshing(false);
      });

    return () => unsubscribe(); // Clean up the listener on component unmount
  }, [currentUser.uid, refreshing]);

  const navigateToPostDetail = postId => {
    navigation.navigate('PostDetail', { id: postId });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Refreshing is handled by the onSnapshot listener
  };

  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <View style={styles.postCardWrapper}>
            <PostCard post={item} onPress={() => navigateToPostDetail(item.id)} />
          </View>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.title}>No posts found</Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </View>
  );
};

const getStyles = theme => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    alignItems: 'center',
    paddingTop: 16,
  },
  postCardWrapper: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    color: theme.text,
  },
});

export default MyPosts;
