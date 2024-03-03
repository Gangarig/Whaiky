import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet, Modal, TouchableOpacity, Button } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import debounce from 'lodash/debounce';
import PostCard from '../../../components/PostCard';
import Location from '../service/Location';
import CategoryPicker from '../service/CategoryPicker';
import PrimaryButton from '../../../components/Buttons/PrimaryButton';
import shadowStyle from '../../../constant/Shadow';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { showMessage } from 'react-native-flash-message';
import { useTheme } from '../../../context/ThemeContext';
import { BlurView } from "@react-native-community/blur";
import TwoSelectButton from '../../../components/Buttons/TwoSelectButton';
import Fonts from '../../../constant/Fonts';
import ContractorCard from '../../../components/ContractorCard';
import { fetchPosts , fetchUsers , filterPosts, filterUsers } from './SearchFunctions';
import Loading from '../../../components/Loading';
import { useAuth } from '../../../context/AuthContext';


const Search = ({ navigation }) => {
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [optionId, setOptionId] = useState('');
  const [category, setCategory] = useState('');
  const [option, setOption] = useState('');
  const theme = useTheme();
  const styles = getStyles(theme);
  const { currentUser } = useAuth();
  const [blur, setBlur] = useState(false);

  const clearOption = () => {
    setOption('');
    setOptionId('');
  }
  const clearCategory = () => {
    setCategory('');
    setCategoryId('');
    clearOption();
  }
  const clearCity = () => {
    setCity('');
  }
  const clearState = () => {
    setState('');
  }
  const clearCountry = () => {
    setCountry('');
    clearState();
    clearCity();
  }



  // states for posts and users list
  const [searchType, setSearchType] = useState('Post');
  const [posts, setPosts] = useState([]);
  const [users , setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const header = () => {
    return (
    <View style={styles.header}>
        <TextInput 
          style={styles.searchTextInput}
          placeholder="Search"
          // value={searchTerm}
          // onChangeText={text => setSearchTerm(text)}
        />
        <View style={styles.btn}>
        <TwoSelectButton
          primary={"Add Location"}
          secondary={"Add Category"}
          onPressPrimary={() => {
            setLocationModalVisible(true);
            setBlur(true);
          }}
          onPressSecondary={() => {
            setCategoryModalVisible(true);
            setBlur(true);
          }}
        />
        </View>
        <View style={styles.btn}>
        <TwoSelectButton
          primary={"Search"}
          secondary={`Search ${searchType === 'Post' ? 'Users' : 'Posts'}`}
          onPressPrimary={() => {
    
          }}
          onPressSecondary={toggleSearchType}
        />
        </View>
        { (country || state || city ) && (
        <View style={styles.info}>
            {country && 
              <View style={[styles.infoContainer,shadowStyle]}>
                {country &&
                <View style={styles.subInfo}>
                <Text style={styles.value}>Country : {country || 'N/A'}</Text>
                <TouchableOpacity onPress={
                  ()=>clearCountry()
                }>
                <FontAwesomeIcon color={theme.white} size={22} icon="fa-solid fa-delete-left" />
                </TouchableOpacity>
                </View>
                }
                
                {state &&
                <View style={styles.subInfo}>
                <Text style={styles.value}>State : {state}</Text>
                <TouchableOpacity onPress={
                  ()=>clearState()
                }>
                <FontAwesomeIcon color={theme.white} size={22} icon="fa-solid fa-delete-left" />
                </TouchableOpacity>
                </View>
                }
                
                {city &&
                <View style={styles.subInfo}>
                <Text style={styles.value}>City : {city}</Text>
                <TouchableOpacity onPress={
                  ()=>clearCity()
                }>
                <FontAwesomeIcon color={theme.white} size={22} icon="fa-solid fa-delete-left" />
                </TouchableOpacity>
                </View>
                }
              </View>
            }
        </View>
        )}
        { (category || option) && (
          <View style={[styles.info]}>
            <View style={[styles.infoContainer, shadowStyle]}>
              {category && (
                <View style={styles.subInfo}>
                  <Text style={styles.value}>{category} {categoryId || 'N/A'}</Text>
                  <TouchableOpacity onPress={clearCategory}>
                    <FontAwesomeIcon color={theme.white} size={22} icon="fa-solid fa-delete-left" />
                  </TouchableOpacity>
                </View>
              )}
              {option && (
                <View style={styles.subInfo}>
                  <Text style={styles.value}>{option || 'N/A'}</Text>
                  <TouchableOpacity onPress={clearOption}>
                    <FontAwesomeIcon color={theme.white} size={22} icon="fa-solid fa-delete-left" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )}
      <View style={styles.bottomBorder}>
      </View>
    </View>
    )
  }
  const Footer = () => {
    if (loadingMore) {
      return <Loading />;
    }
    if (!hasMore) {
      return null; 
    }

    return (
      <TouchableOpacity style={styles.footer} onPress={() =>{
        if(searchType === 'Post'){
          fetchPosts(true);
        } else {
          fetchUsers(true);
        }
      }}>
        <View style={styles.border}></View>
        <Text style={styles.text}>Load More</Text>
        <View style={styles.border}></View>
      </TouchableOpacity>
    );
  };

  const fetchPosts = async (loadMore = false) => {
    if (loadMore && !hasMore) return; 
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
        setHasMore(false); // No more posts to fetch
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

  const fetchUsers = async (loadMore = false) => {
    console.log('Fetching users');
    if (loadMore && !hasMore) return;
    setLoadingMore(loadMore);
    setRefreshing(!loadMore);
    try {
      let query = firestore().collection('users').limit(10);
      if (loadMore && lastDoc) {
        query = query.startAfter(lastDoc);
      }
      query = query.limit(10);

      const snapshot = await query.get();
      const fetchedUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (fetchedUsers.length < 10) {
        setHasMore(false);
      }

      if (loadMore) {
        setUsers(prevPosts => [...prevPosts, ...fetchedUsers]);
      } else {
        setUsers(fetchedUsers);
      }

      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }) => (
    searchType === 'Post' ? (
      <View style={styles.postWrapper}>
        <PostCard post={item} onPress={() => navigation.navigate('PostDetail', { id: item.postId })} />
      </View>
    ) : (
      <View style={styles.userWrapper}>
        <ContractorCard currentUser={currentUser} navigation={navigation} selectedUser={item} onPress={() => navigation.navigate('ContractorDetail', { id: item.uid })} />
      </View>
    )
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.statement}>No {searchType === 'Post' ? 'posts' : 'users'} found.</Text>
    </View>
  );
  
  const toggleSearchType = () => {
    setSearchType(prevType => prevType === 'Post' ? 'User' : 'Post');
  };


  useEffect(() => {
    const fetchData = async () => {
      if (searchType === 'Post') {
        await fetchPosts();
      } else {
        await fetchUsers();
      }
    };
  
    // Reset state
    setPosts([]);
    setUsers([]);
    setLastDoc(null);
    setHasMore(true);
    setLoadingMore(false);
    
    fetchData();
  }, [searchType]);
  

  
  
  

  return (
    <View style={styles.container}>
      {searchType === 'Post' ? (
        <FlatList
          key="post-list" // Unique key for posts
          data={posts}
          renderItem={renderItem}
          keyExtractor={item => item.postId || item.id}
          style={styles.postList}
          numColumns={2}
          refreshing={refreshing}
          onRefresh={fetchPosts}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={Footer}
          ListHeaderComponent={header}
          ListEmptyComponent={ListEmptyComponent}
        />
      ) : (
        <FlatList
          key="user-list" // Unique key for users
          data={users}
          renderItem={renderItem}
          keyExtractor={item => item.uid || item.id}
          style={styles.userList}
          numColumns={1} // Change to 1 for users
          refreshing={refreshing}
          onRefresh={fetchUsers}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={Footer}
          ListHeaderComponent={header}
          ListEmptyComponent={ListEmptyComponent}
        />
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={locationModalVisible}
        onRequestClose={() => {
          setLocationModalVisible(!locationModalVisible);
          setBlur(false);
        }}
      >
        <View style={styles.Modal}>
        <Location
          onClose={() => {
            setLocationModalVisible(false);
            setBlur(false);
          }}
          onSave={(country, state, city) => {
            setCountry(country);
            setState(state);
            setCity(city);
            setLocationModalVisible(false);
            setBlur(false);
          }}
        />
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={categoryModalVisible}
        onRequestClose={() => {
          setCategoryModalVisible(!categoryModalVisible);
          setBlur(false);
        }}
      >
        <View style={styles.Modal}>
        <CategoryPicker
          onClose={() => {
            setCategoryModalVisible(false);
            setBlur(false);
          }}
          onSave={(categoryId, optionId, category, option) => {
            setCategoryId(categoryId);
            setOptionId(optionId);
            setCategory(category);
            setOption(option);
            setCategoryModalVisible(false);
            setBlur(false);
          }}
        />
        </View>
      </Modal>
      {blur && (
        <BlurView
          style={styles.blur}
          blurType="light"
          blurAmount={10}
          reducedTransparencyFallbackColor="white"
        />
      )}
    </View>
  )
}

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  postList: {
    backgroundColor: theme.background,
    flex: 1,
  },
  userList: {
    backgroundColor: theme.background,
    flex: 1,
  },
  header: {
    paddingHorizontal: 15,
    paddingTop: 16,
    borderBottomColor: theme.primary,
    borderBottomWidth: 1,
  },
  searchTextInput: {
    backgroundColor: theme.background,
    borderColor: theme.primary,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  btn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  info: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    marginBottom : 16,
  },
  infoContainer: {
    padding: 10,
  },
  subInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  value: {
    color: theme.white,
    fontSize: 14,
    fontFamily: Fonts.primary,
  },
  Modal: {
    height: 400,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: theme.background,
  },
  blur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    width: '100%',
  },
  postWrapper: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  },
  userWrapper: {
    marginVertical: 8,
    paddingHorizontal: 10,
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
  emptyContainer: {
    height:100,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statement: {
    color: theme.text,
    fontSize: 20,
    fontFamily: Fonts.primary,
  },


});

export default Search;

