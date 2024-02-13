import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import debounce from 'lodash/debounce';
import PostCard from '../../../components/PostCard';
import { Global } from '../../../constant/Global';
import Location from '../service/Location';
import CategoryPicker from '../service/CategoryPicker';
import PrimaryButton from '../../../components/Buttons/PrimaryButton';
import shadowStyle from '../../../constant/Shadow';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { showMessage } from 'react-native-flash-message';
import { useTheme } from '../../../context/ThemeContext';

const PostSearch = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [optionId, setOptionId] = useState('');
  const [category, setCategory] = useState('');
  const [option, setOption] = useState('');
  const [lastVisible, setLastVisible] = useState(null);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const isSearchActive = searchTerm.trim() !== '' || country || state || city || categoryId || optionId;
  const theme = useTheme();
  const styles = getStyles(theme);

  const fetchPosts = async () => {
    setLoading(true);

    try {
      let query = firestore()
        .collection('posts')
        .orderBy('timestamp', 'desc')
        .limit(10); // Set limit to 1 for testing

      if (lastVisible) {
        query = query.startAfter(lastVisible);
      }

      const snapshot = await query.get();
      const fetchedPosts = snapshot.docs.map(doc => doc.data());

      if (fetchedPosts.length > 0) {
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        setAllPosts(prevPosts => [...prevPosts, ...fetchedPosts]);
        setShowLoadMore(true); // Show 'Load More' button if more posts are available
      } else {
        setShowLoadMore(false); // Hide 'Load More' button if no more posts
      }
    } catch (error) {
      console.error('Error fetching users:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    // Only filter posts if there is a search term, country, state, city, categoryId, or optionId selected
    if (searchTerm.trim() !== '' || country || state || city || categoryId || optionId) {
      const filtered = allPosts.filter(post => {
        const matchesSearchTerm = !searchTerm.trim() || 
          (post.title && post.title.toLowerCase().includes(lowerCaseSearchTerm)) ||
          (post.ownerName && post.ownerName.toLowerCase().includes(lowerCaseSearchTerm));
  
        const matchesCountry = !country || (post.country === country);
        const matchesState = !state || (post.state === state);
        const matchesCity = !city || (post.city === city);
        const matchesCategoryId = !categoryId || (post.categoryId === categoryId);
        const matchesOptionId = !optionId || (post.optionId === optionId);
  
        return matchesSearchTerm && matchesCountry && matchesState && matchesCity && matchesCategoryId && matchesOptionId;
      });
  
      setFilteredPosts(filtered);
    } else {
      // If no filters are selected, set filteredPosts to an empty array
      setFilteredPosts([]);
    }
  }, [searchTerm, country, state, city, categoryId, optionId, allPosts]);
  


  const navigateToPostDetail = async (postId) => {
    const exists = await checkPostExistence(postId);
      if (exists) {
        navigation.navigate('PostDetail', { id: postId });
      }
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


  const handleLocationSave = (selectedCountry, selectedState, selectedCity) => {
    setCountry(selectedCountry || '');
    setState(selectedState || '');
    setCity(selectedCity || '');
  };

  const handleCategorySave = (selectedCategoryId, selectedOptionId, selectedCategoryText, selectedOptionText) => {
    setCategoryId(selectedCategoryId);
    setOptionId(selectedOptionId);
    setCategory(selectedCategoryText);
    setOption(selectedOptionText);
    console.log(selectedCategoryId, selectedOptionId, selectedCategoryText, selectedOptionText);
  };

  const clearCountry = () => {
    setCountry('');
  };
  const clearState = () => {
    setState('');
  };
  const clearCity = () => {
    setCity('');
  };



  const clearCategory = () => {
    setCategoryId('');
    setCategory('');
    setOptionId('');
    setOption('');
  };
  const clearOption = () => {
    setOptionId('');
    setOption('');
    setCategoryId('');
    setCategory('');
  }


  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <View style={styles.searchInput}>
        <Text style={[Global.titleSecondary,styles.searchLabel]}> Search with / Post Title or Poster Name /. </Text>
        <View style={styles.searchTextInputWrapper}>
        <TextInput
          placeholder="Search"
          style={Global.input}
          onChangeText={(text) => setSearchTerm(text)}
          value={searchTerm}
        />
        </View>
        </View>
        <View style={styles.btnContainer}>
          {/* <PrimaryButton text="Search" onPress={handleSearch} /> */}
          <View style={styles.locationBtn}>
          <PrimaryButton text="Add Location" 
          onPress={() => setLocationModalVisible(true)} 
          />
          {country && 
            <View style={[styles.infoContainer,shadowStyle]}>
              {country &&
              <View style={styles.subInfo}>
              <Text style={[Global.text,styles.white]}>Country : {country}</Text>
              <TouchableOpacity onPress={
                ()=>clearCountry()
              }>
              <FontAwesomeIcon color={theme.white} size={22} icon="fa-solid fa-delete-left" />
              </TouchableOpacity>
              </View>
              }
              
              {state &&
              <View style={styles.subInfo}>
              <Text style={[Global.text,styles.white]}>State : {state}</Text>
              <TouchableOpacity onPress={
                ()=>clearState()
              }>
              <FontAwesomeIcon color={theme.white} size={22} icon="fa-solid fa-delete-left" />
              </TouchableOpacity>
              </View>
              }
              
              {city &&
              <View style={styles.subInfo}>
              <Text style={[Global.text,styles.white]}>City : {city}</Text>
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
          
          <View style={styles.categoryBtn}>
          <PrimaryButton text="Add Category" 
          onPress={() => setCategoryModalVisible(true)}
          />
          <View style={styles.chosenCategory}>
            {category && 
              <View style={[styles.infoContainer,shadowStyle]}>
                  {category && 
                  <View style={styles.subInfo}>
                    <Text style={[Global.text,styles.white]}>{category} {categoryId}</Text>
                    <TouchableOpacity onPress={
                      ()=>clearCategory()
                    }>
                    <FontAwesomeIcon color={theme.white} size={22} icon="fa-solid fa-delete-left" />
                    </TouchableOpacity>
                  </View>
                  }
                  {option && 
                  <View style={styles.subInfo}>
                  <Text style={[Global.text,styles.white]}>{option}</Text>
                  <TouchableOpacity onPress={
                    ()=>clearOption()
                  }>
                  <FontAwesomeIcon color={theme.white} size={22} icon="fa-solid fa-delete-left" />
                  </TouchableOpacity>
                  </View>
                  }
              </View>
            }
          </View>
          </View>
        </View>
      </View>

      {loading && 
      <View style={styles.statusMSG}>
      <ActivityIndicator size="large" color={theme.primary} />
      </View>
      }
      {error ?
      <View style={styles.statusMSG}>
       <Text style={[Global.titleSecondary,styles.errorText,]}>{error}</Text> 
      </View>
       : null}
      <View style={styles.flatListWrapper}>
      <FlatList
        data={filteredPosts}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.postWrapper} onPress={() => navigation.navigate('PostDetail', { postId: item.id })}>
            <PostCard 
              post={item}
              onPress={() => navigateToPostDetail(item.postId)}
            />
          </TouchableOpacity>
        )}
        refreshing={isRefreshing}
        numColumns={2}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={searchTerm && !loading && filteredPosts.length === 0 && 
        <Text>No posts found</Text>}
      />

        {showLoadMore && isSearchActive && (
            <TouchableOpacity 
              style={styles.loadMoreBtn} 
              onPress={fetchPosts}
            >
              <FontAwesomeIcon color={theme.primary} size={25} icon="fa-solid fa-chevron-down" />
            </TouchableOpacity>
        )}
      </View>


          {/* Location Picker Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={locationModalVisible}
            onRequestClose={() => {
              setLocationModalVisible(false);
            }}
          >
            <View style={styles.locationModal}>
              <TouchableOpacity 
                style={styles.modalOverlay} 
                activeOpacity={1} 
                onPressOut={() => { setLocationModalVisible(false); }}
              />
              <Location
                onSave={(selectedCountry, selectedState, selectedCity) => {
                  handleLocationSave(selectedCountry, selectedState, selectedCity);
                  setLocationModalVisible(false); 
                }}
                onClose={() => setLocationModalVisible(false)} 
              />
            </View>
          </Modal>
          {/* Category Picker Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={categoryModalVisible}
            onRequestClose={() => {
              setCategoryModalVisible(false);
            }}
          >
            <View style={styles.categoryModal}>
              <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPressOut={() => {
                  setCategoryModalVisible(false);
                }}
              />
            <CategoryPicker
              onSave={(selectedCategoryId, selectedOptionId, selectedCategoryText, selectedOptionText) => {
                handleCategorySave(selectedCategoryId, selectedOptionId, selectedCategoryText, selectedOptionText);
              }}
              onClose={() => setCategoryModalVisible(false)}
            />
            </View>
          </Modal>
    </View>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.background,
    flex: 1,
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  searchBox:{
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor : theme.background,
    borderColor : theme.primary,
    borderWidth : 1,
    borderRadius : 10,
    marginTop: 10,
  },
  btnContainer:{
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    gap: 10,
  },
  searchLabel:{
    marginBottom: 10,
  },
  infoContainer:{
    backgroundColor: theme.primaryLight,
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    width: 296,
  },
  white:{
    color: theme.white,
    fontWeight: 'bold',
  },
  locationModal: {
    height: 450,
    width: '100%',
    bottom: 0,
    position: 'absolute',
    borderTopColor: '#696969',
    borderTopWidth: 2,
    backgroundColor: theme.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryModal: {
    height: 350,
    width: '100%',
    bottom: 0,
    position: 'absolute',
    borderTopColor: '#696969',
    borderTopWidth: 2,
    backgroundColor: theme.background,
    paddingTop: 20,
    alignItems: 'center',
  },
  subInfo:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchTextInputWrapper:{
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    backgroundColor: theme.white,
    borderRadius: 5,
  },
  more:{
    position: 'absolute',
    width: '100%',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusMSG:{
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  loadMoreBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    ...shadowStyle,
  },
  flatListWrapper :{
    width: '100%',
    flex: 1,
    paddingBottom: 10
  },
  postWrapper:{
    width: '50%',
    padding: 2.5,
  },
});

export default PostSearch;