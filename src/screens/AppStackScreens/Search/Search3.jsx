import { View, Text ,StyleSheet,TouchableOpacity} from 'react-native'
import React from 'react'
import firestore from '@react-native-firebase/firestore'
import { useEffect } from 'react'
import { useState } from 'react'
import { FlatList } from 'react-native'
import PostCard from '../../../components/PostCard'
import { useTheme } from '../../../context/ThemeContext'
import Loading from '../../../components/Loading'
import Fonts from '../../../constant/Fonts'
import ContractorCard from '../../../components/ContractorCard'

const Search = () => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const [posts, setPosts] = useState([]);
  const [users , setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);

  const fetchPosts = async (loadMore = false) => {
    if (loadMore && !hasMorePosts) return; // Stop if no more posts to fetch
    setLoadingMore(loadMore);
    setRefreshing(!loadMore);

    try {
      let query = firestore().collection('posts').orderBy('timestamp', 'desc');
      if (loadMore && lastDoc) {
        query = query.startAfter(lastDoc);
      }
      query = query.limit(10);

      const snapshot = await query.get();
      const fetchedPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (fetchedPosts.length < 10) {
        setHasMorePosts(false); // No more posts to fetch
      }

      if (loadMore) {
        setPosts(prevPosts => [...prevPosts, ...fetchedPosts]);
      } else {
        setPosts(fetchedPosts);
      }

      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const Footer = () => {
    if (loadingMore) {
      return <Loading />;
    }
    if (!hasMorePosts) {
      return null; 
    }

    return (
      <TouchableOpacity style={styles.footer} onPress={() => fetchPosts(true)}>
        <View style={styles.border}></View>
        <Text style={styles.text}>Load More</Text>
        <View style={styles.border}></View>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.postWrapper}>
      <PostCard post={item} />
    </View>
  );
  
  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={item => item.postId || item.id}
        style={styles.FlatList}
        numColumns={2}
        refreshing={refreshing}
        onRefresh={fetchPosts}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={Footer}
      />
    </View>

  )
}

export default Search

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  FlatList: {
    margin: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  border: {
    borderBottomColor: theme.primary,
    borderBottomWidth: 1,
    width: '30%',
  },
  text: {
    color: theme.primary,
    fontSize: 16,
    fontFamily: Fonts.primary,
  },
  postWrapper: {
    width: '50%',
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

