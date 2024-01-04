import React, { useState, useEffect,useRef } from 'react';
import {
  View, Text, TouchableOpacity, Button,
  RefreshControl, SafeAreaView, FlatList, StyleSheet,ActivityIndicator
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';
import { useAuth } from '../../../context/AuthContext';
import PostCard from '../../../components/PostCard';
import { Global } from '../../../constant/Global';
import { shadowStyle } from '../../../constant/Shadow';
import PrimaryButton from '../../../components/Buttons/PrimaryButton';
import GradientButton from '../../../components/GradientButton';
import { TextInput } from 'react-native-gesture-handler';
import Colors from '../../../constant/Colors';


const Home = ({ navigation }) => {
  const { currentUser, profile } = useAuth();
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const lastFetchedPost = useRef(null);

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
  
    console.log("Fetching posts, load more:", loadMore); // Debugging log
  
    try {
      let query = firestore()
        .collection('posts')
        .orderBy('timestamp', 'desc')
        .limit(10); // Keep this as 1 for now
  
      if (loadMore && lastFetchedPost.current) {
        query = query.startAfter(lastFetchedPost.current);
      }
  
      const snapshot = await query.get();
      const fetchedPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
      if (fetchedPosts.length > 0) {
        lastFetchedPost.current = snapshot.docs[snapshot.docs.length - 1];
        setPosts(prevPosts => loadMore ? [...prevPosts, ...fetchedPosts] : fetchedPosts);
        setHasMore(fetchedPosts.length === 5); // Update to match your limit
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

  const renderItem = ({ item }) => (
    <PostCard
      owner={item.ownerName}
      postTitle={item.title}
      postImageSource={item.images && item.images[0] ? item.images[0] : null}
      onPress={() => navigateToPostDetail(item.id)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.createPost}>
      <View
        style={styles.buttonBox}
      >
        <PrimaryButton text="Create a Post" onPress={checkAccountStatus} />
        <View style={styles.searchButtonBox}>
        <PrimaryButton text="Search" onPress={()=>navigation.navigate('SearchPost')} />
        </View>
      </View>
      
      </View>
      {currentUser ? (
        <View style={[styles.flashList]}>
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={onEndReached}
          onEndReachedThreshold={0.2} 
          ListFooterComponent={
            loadingMore && <ActivityIndicator size="large" color="#0000ff" />
          }
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />

        </View>
      ) : (
        <Text>Please sign in to see posts.</Text>
      )}
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    width: '100%',
  },
  flashList:{
    flex:1,
    paddingHorizontal:10,
    borderWidth:1,
    borderColor:'#ccc'
  },
  buttonBox:{
    backgroundColor:'#FBFBFB',
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center',
    paddingVertical:10,
    paddingHorizontal:10,
    borderRadius:10,
    marginHorizontal:10,
  }
  

});