import React, { useState, useEffect,useRef } from 'react';
import {
  View, Text, TouchableOpacity, Button,
  RefreshControl, SafeAreaView, FlatList, StyleSheet,ActivityIndicator
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';
import { useAuth } from '../../../context/AuthContext';
import PostCard from '../../../components/PostCard';
import PostCardSecondary from '../../../components/PostCardSecondary';
import { useTheme } from '../../../context/ThemeContext';


const Home = ({ navigation }) => {
  const { currentUser, profile } = useAuth();
  const theme = useTheme();
  const styles = getStyles(theme);
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const lastFetchedPost = useRef(null);
  const [primaryList, setPrimaryList] = useState(true);
  const [secondaryList, setSecondaryList] = useState(false);
  const [columns, setColumns] = useState(2);
  const [listKey, setListKey] = useState('primaryList'); 
  const toggleList = () => {
    setPrimaryList(!primaryList);
    setSecondaryList(!secondaryList);
    const newColumns = columns === 2 ? 1 : 2;
    setColumns(newColumns);

    // Change the key prop to force a re-render of FlatList
    setListKey(newColumns === 2 ? 'primaryList' : 'secondaryList');
  };


  useEffect(() => {
    fetchPosts();
    return () => {
      setPosts([]);
    };
  }, []);

  const onEndReached = () => {
    console.log("onEndReached called"); // Debugging log
    if (!loadingMore && hasMore) {
      fetchPosts(true);
    }
  };

  
  const fetchPosts = async (loadMore = false) => {
    if (loadingMore && !loadMore) return;
    setLoadingMore(true);
  
    try {
      let query = firestore()
        .collection('posts')
        .orderBy('timestamp', 'desc')
        .limit(10); // Increase this limit if you want more posts per fetch
  
      if (loadMore && lastFetchedPost.current) {
        query = query.startAfter(lastFetchedPost.current);
      }
  
      const snapshot = await query.get();
      const fetchedPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
      if (fetchedPosts.length > 0) {
        lastFetchedPost.current = snapshot.docs[snapshot.docs.length - 1];
        setPosts(prevPosts => loadMore ? [...prevPosts, ...fetchedPosts] : fetchedPosts);
        setHasMore(fetchedPosts.length === 10); // Check if fetched posts are equal to the limit
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoadingMore(false);
      setRefreshing(false);
    }
  };
  
  
  


  const onRefresh = () => {
    setRefreshing(true);
    lastFetchedPost.current = null;
    fetchPosts();
  };


  const checkPostExistence = async (postId) => {
    try {
      const doc = await firestore().collection('posts').doc(postId).get();
      if (!doc.exists) {
        showMessage({
          message: 'This post is no longer available',
          type: "danger",
        });
        return false;
      }
      return true;
    } catch (error) {
      showMessage({
        message: error.message || 'Error checking post existence',
        type: "danger",
      });
      return false;
    }
  };
  const navigateToPostDetail = async (postId) => {
    const exists = await checkPostExistence(postId);
    if (exists) {
      navigation.navigate('PostDetail', { id: postId });
    }
  };

  const checkAccountStatus = () => {
    if (!currentUser) {
      showMessage({
        message: 'Please sign in to create a post.',
        type: "danger",
      });
    } else if (profile !== 'completed') {
      showMessage({
        message: 'Please complete your profile to create a post.',
        type: "danger",
      });
      navigation.navigate('PersonalInfo');
    } else {
      navigation.navigate('AddPost');
    }
  };

  const renderItem = ({ item }) => {
    const postCardWrapperStyle = [
      styles.postCardWrapper,
      { width: primaryList ? '50%' : '100%' }
    ];
  
    return (
      <View style={postCardWrapperStyle}>
        {columns === 2 ? (
          <PostCard
            post={item}
            onPress={() => navigateToPostDetail(item.id)}
          />
        ) : (
          <PostCardSecondary
            post={item}
            onPress={() => navigateToPostDetail(item.id)}
          />
        )}
      </View>
    );
  };
  

  return (
    <View style={styles.container}>
      {currentUser ? (
        <FlatList
          key={listKey}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <Text style={styles.headerText}>Just Added</Text>
              <View style={styles.gridView}>
                {primaryList && (
                <TouchableOpacity onPress={()=>toggleList()} style={styles.horizontalLineWrapper}>
                  <View style={styles.horizontalLine}></View>
                  <View style={styles.horizontalLine}></View>
                  <View style={styles.horizontalLine}></View>
                </TouchableOpacity>
                )}
                {secondaryList && (
                <TouchableOpacity onPress={()=>toggleList()} style={styles.quadratBoxWrapper}>
                  <View style={{flexDirection:'row'}}>  
                    <View style={styles.quadratBox}></View>
                    <View style={styles.quadratBox}></View>
                  </View> 
                  <View style={{flexDirection:'row'}}>  
                    <View style={styles.quadratBox}></View>
                    <View style={styles.quadratBox}></View>
                  </View> 
                </TouchableOpacity>
                )}
              </View>
            </View>
          }
          data={posts}
          renderItem={renderItem}
          style={styles.flatList}
          keyExtractor={item => item.id}
          ListEmptyComponent={<Text style={{ textAlign: 'center' }}>No posts available.</Text>}
          horizontal={false}
          numColumns={columns}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={onEndReached}
          onEndReachedThreshold={0.2} 
          ListFooterComponent={
            loadingMore && <ActivityIndicator size="large" color={theme.primary} />
          }
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
      ) : (
        <Text>Please sign in to see posts.</Text>
      )}
    </View>
  );
};

export default Home;

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    width: '100%',
  },
  flatList: {
    backgroundColor: theme.background,
    width: '100%',
    paddingHorizontal:5,
  },
  postCardWrapper: {
    padding: 5,
  },
  listHeader: {
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.text,
  },
  gridView: {
    height: 30,
  },
  horizontalLineWrapper:{
    height: 25,
  },
  quadratBoxWrapper:{
    height: 25,
  },
  horizontalLine:{
    width: 24,
    height: 5,
    backgroundColor: theme.primary,
    margin: 2,
  },
  quadratBox:{
    width: 10,
    height: 10,
    backgroundColor: theme.primary,
    margin: 2,
  }
});