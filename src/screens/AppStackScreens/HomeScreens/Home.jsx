import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet,TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../../context/AuthContext';
import PostCard from '../../../components/PostCard';
import { useTheme } from '../../../context/ThemeContext';
import PostCardSecondary from '../../../components/PostCardSecondary';

const Home = ({ navigation }) => {
  const { currentUser } = useAuth();
  const theme = useTheme();
  const styles = getStyles(theme);
  const [forYouPosts, setForYouPosts] = useState([]);
  const [justAddedPosts, setJustAddedPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [primaryList, setPrimaryList] = useState(true);
  
  const toggleList = () => {
    setPrimaryList(!primaryList);
  }


  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setRefreshing(true);
    try {
      const allPostsQuery = firestore().collection('posts').orderBy('timestamp', 'desc').limit(20);
      const allPostsSnapshot = await allPostsQuery.get();
      const allPosts = allPostsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
      const forYou = allPosts.filter(post => 
        (currentUser.services ?? []).some(service => String(post.categoryId) === String(service.categoryId))
      ).slice(0, 2);
      
  
      const justAdded = allPosts.filter(post => !forYou.includes(post));
  
      setForYouPosts(forYou);
      setJustAddedPosts(justAdded);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setRefreshing(false);
    }
  };
  
  

  const onRefresh = () => {
    fetchPosts();
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {currentUser ? (
        <>
          <View style={styles.header}>
            <Text style={styles.headerText}>For You</Text>
            {primaryList ? (
            <TouchableOpacity onPress={()=>toggleList()} style={styles.horizontalLineWrapper}>
              <View style={styles.horizontalLine}></View>
              <View style={styles.horizontalLine}></View>
              <View style={styles.horizontalLine}></View>
            </TouchableOpacity>
            ):(
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
          <View style={styles.listWrap}>
            {forYouPosts.map((item) => (
              <View style={styles.postWrapperSecondary} key={item.id}>
                <PostCardSecondary  post={item} onPress={() => navigation.navigate('PostDetail', { id: item.id })} />
              </View>
            ))}
          </View>
          <Text style={styles.sectionTitle}>Just Added</Text>
          <View style={primaryList ? styles.listFlexWrap : styles.listWrap}>
          {justAddedPosts.map((item) => (
            <View style={primaryList ? styles.postWrapper : styles.postWrapperSecondary} key={item.id} >
              {primaryList ? (
                <PostCard key={item.id} post={item} onPress={() => navigation.navigate('PostDetail', { id: item.id })} />
              ):(
                <PostCardSecondary  post={item} onPress={() => navigation.navigate('PostDetail', { id: item.id })} />
              )}
            </View>
          ))}
          </View>
        </>
      ) : (
        <Text>Please sign in to see posts.</Text>
      )}
    </ScrollView>
  );
};

export default Home;

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
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
    width: 20,
    height: 3,
    backgroundColor: theme.primary,
    margin: 2,
  },
  quadratBox:{
    width: 8,
    height: 8,
    backgroundColor: theme.primary,
    margin: 2,
  },
  listWrap:{
 
  },
  listFlexWrap:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',  
    width: '100%',
  },
  postWrapper:{
    width: '50%',
    padding: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.text,
    margin: 10,
  },
  postWrapperSecondary:{
    margin: 5,
    marginVertical: 10,
  },

});


