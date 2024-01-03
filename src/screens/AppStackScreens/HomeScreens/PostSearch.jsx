import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import debounce from 'lodash/debounce';
import PostCard from '../../../components/PostCard';
import Colors from '../../../constant/Colors';
import { Global } from '../../../constant/Global';
import Location from '../../AppStackScreens/service/Location';
import CategoryPicker from '../service/CategoryPicker';
import PrimaryButton from '../../../components/Buttons/PrimaryButton';
import shadowStyle from '../../../constant/Shadow';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { showMessage } from 'react-native-flash-message';

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

  const fetchPosts = async () => {
    setLoading(true);

    try {
      let query = firestore()
        .collection('posts')
        .orderBy('timestamp', 'desc')
        .limit(50); // Set limit to 1 for testing

      if (lastVisible) {
        query = query.startAfter(lastVisible);
      }

      const snapshot = await query.get();
      const fetchedPosts = snapshot.docs.map(doc => doc.data());

      if (fetchedPosts.length > 50) {
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
              <FontAwesomeIcon color={Colors.white} size={22} icon="fa-solid fa-delete-left" />
              </TouchableOpacity>
              </View>
              }
              
              {state &&
              <View style={styles.subInfo}>
              <Text style={[Global.text,styles.white]}>State : {state}</Text>
              <TouchableOpacity onPress={
                ()=>clearState()
              }>
              <FontAwesomeIcon color={Colors.white} size={22} icon="fa-solid fa-delete-left" />
              </TouchableOpacity>
              </View>
              }
              
              {city &&
              <View style={styles.subInfo}>
              <Text style={[Global.text,styles.white]}>City : {city}</Text>
              <TouchableOpacity onPress={
                ()=>clearCity()
              }>
              <FontAwesomeIcon color={Colors.white} size={22} icon="fa-solid fa-delete-left" />
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
                    <FontAwesomeIcon color={Colors.white} size={22} icon="fa-solid fa-delete-left" />
                    </TouchableOpacity>
                  </View>
                  }
                  {option && 
                  <View style={styles.subInfo}>
                  <Text style={[Global.text,styles.white]}>{option}</Text>
                  <TouchableOpacity onPress={
                    ()=>clearOption()
                  }>
                  <FontAwesomeIcon color={Colors.white} size={22} icon="fa-solid fa-delete-left" />
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
      <ActivityIndicator size="large" color={Colors.primary} />
      </View>
      }
      {error ?
      <View style={styles.statusMSG}>
       <Text style={[Global.titleSecondary,styles.errorText,]}>{error}</Text> 
      </View>
       : null}

      <FlatList
        data={filteredPosts}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('PostDetail', { postId: item.id })}>
            <PostCard 
              owner={item.ownerName} 
              postTitle={item.title} 
              postImageSource={item.images && item.images.length > 0 ? item.images[0] : null}
              onPress={() => navigateToPostDetail(item.postId)}
            />
          </TouchableOpacity>
        )}
        refreshing={isRefreshing}
        ListEmptyComponent={searchTerm && !loading && filteredPosts.length === 0 && 
        <Text>No posts found</Text>}
      />


          {/* Location Picker Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={locationModalVisible}
            onRequestClose={() => {
              setLocationModalVisible(false);
            }}
          >
            <View style={styles.fullScreenModal}>
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
            <View style={styles.fullScreenModal}>
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
        {/* Load More Button */}
        {showLoadMore && (
        <TouchableOpacity 
          style={styles.loadMoreBtn} 
          onPress={fetchPosts}
        >
          <FontAwesomeIcon color={Colors.primary} size={25} icon="fa-solid fa-chevron-down" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
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
    backgroundColor : Colors.background,
    borderColor : Colors.primary,
    borderWidth : 1,
    borderRadius : 10,
    marginTop: 10,
  },
  btnContainer:{
    width: '100%',
    flexDirection: 'column',
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'space-between',
    gap: 10,
  },
  searchLabel:{
    marginBottom: 10,
  },
  infoContainer:{
    backgroundColor: Colors.primaryLight,
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    width: 296,
  },
  white:{
    color: Colors.white,
    fontWeight: 'bold',
  },
  fullScreenModal: {
    height: 450,
    width: '100%',
    bottom: 0,
    position: 'absolute',
    borderTopColor: '#696969',
    borderTopWidth: 2,
    backgroundColor: Colors.background,
    justifyContent: 'center',
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
    backgroundColor: Colors.white,
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
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 5,
    marginBottom: 10,
    ...shadowStyle
  },
});

export default PostSearch;
