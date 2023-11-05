import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity,
  Button, RefreshControl, SafeAreaView, StyleSheet ,Modal
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { Global } from '../../../style/Global';
import AddPost from '../../components/AddPost';
import { shallowEqual } from 'react-native-reanimated/lib/typescript/reanimated2/hook/utils';
import { showMessage } from 'react-native-flash-message';

const DEFAULT_IMAGE = require('./../../../assets/images/default.png');
const Home = ({ navigation }) => {
  const { currentUser , personalInfoComplete } = useAuth();
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [firstVisible, setFirstVisible] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const initialFetch = async () => {
    try {
      const query = firestore()
        .collection('posts')
        .orderBy('createdAt', 'desc')
        .limit(5);

      const snapshot = await query.get();

      const fetchedPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(fetchedPosts || []);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      setFirstVisible(snapshot.docs[0]);

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
        const newPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(prevState => [...prevState, ...newPosts]);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);

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
        const newPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(prevState => [...newPosts, ...prevState]);
        setFirstVisible(snapshot.docs[0]);

      } catch (error) {
        console.error('Error fetching new posts:', error);
      }
    }
  };

  useEffect(() => {
    initialFetch();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNew();
    setRefreshing(false);
  };
  const openModal = () => {
    if(personalInfoComplete){
      setModalVisible(true);
    }else{
      showMessage({
        message: "Please complete your personal info first",
        type: "danger",
      });
    }
  };

  const renderItem = ({ item }) => {
    if (!item.title || !item.price ) {
      console.warn('Incomplete post data', item);
      return null;
    }
    return (
      <TouchableOpacity onPress={() => navigation.navigate('PostDetail', { id: item.id })}>
        <View style={{ margin: 10, padding: 10, borderWidth: 1, borderColor: '#ccc' }}>
          <Text style={{ fontSize: 18 }}>{item.title}</Text>
          <Text style={{ fontSize: 16, color: '#777' }}>Price: {item.price}</Text>
          <Image 
            source={item.images && item.images[0] ? { uri: item.images[0] } : DEFAULT_IMAGE} 
            style={{ width: 100, height: 100 }} 
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView>
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
        <Button title="Create a Post" onPress={openModal} />
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
            onEndReachedThreshold={0.5}
            ListEmptyComponent={<Text>No posts available.</Text>}
          />
        ) : (
          <Text>Please sign in to see posts.</Text>
        )}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.container}>
          <View style={styles.modalContent}>
            <AddPost onPostSubmitted={() => setModalVisible(false)} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#fff'
  },

});