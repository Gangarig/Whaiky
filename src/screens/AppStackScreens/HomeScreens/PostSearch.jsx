import React, { useState, useEffect,useCallback } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import PostCard from '../../../components/PostCard';
import Colors from '../../../constant/Colors';
import { Global } from '../../../constant/Global';
import Location from '../../AppStackScreens/service/Location';
import CategoryPicker from '../service/CategoryPicker';
import PrimaryButton from '../../../components/Buttons/PrimaryButton';
import shadowStyle from '../../../constant/Shadow';
import { showMessage } from 'react-native-flash-message';
import debounce from 'lodash/debounce'; // Import debounce function
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';


const PostSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [optionId, setOptionId] = useState('');
  const [category, setCategory] = useState('');
  const [option, setOption] = useState('');

  const debouncedSearch = useCallback(
    debounce((newSearchTerm) => {
      setSearchTerm(newSearchTerm);
      if (newSearchTerm || country || state || city || categoryId) {
        fetchPosts();
      }
    }, 500),
    [country, state, city, categoryId]
  );
  const fetchPosts = async () => {
    setLoading(true);
    setError('');
    console.log('Fetching posts with:', searchTerm, country, state, city, categoryId);
    try {
      let query = firestore().collection('posts');
  
      // Search by Post Title or Poster Name
      if (searchTerm) {
        query = query.where('title', '==', searchTerm)
      }
      if (searchTerm) {
        query = query.where('ownerName', '==', searchTerm)
      }
  
      // Filter by Location
      if (country ) {
        query = query.where('country', '==', country);
      }
      if ( state ) {
        query = query.where('state', '==', state);
      }
      if ( city) {
        query = query.where('city', '==', city);
      }
  
      // Filter by Category
      if (categoryId) {
        query = query.where('categoryId', '==', categoryId);
      }

      if (optionId) {
        query = query.where('optionId', '==', optionId);
      }
  
      // Execute the query
      const querySnapshot = await query.get();
      const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
      setFilteredPosts(posts);
    } catch (error) {
      setError('Error fetching posts');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (searchTerm || country || state || city || categoryId) {
      fetchPosts();
    }
  }, [searchTerm, country, state, city, categoryId]);
  

  

  
  const fetchMore = async () => {};

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
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <View style={styles.searchInput}>
        <Text style={[Global.titleSecondary,styles.searchLabel]}> Search with / Post Title or Poster Name /. </Text>
        <TextInput
          placeholder="Search"
          style={Global.input}
          onChangeText={(text) => debouncedSearch(text)}
          value={searchTerm}
        />

        </View>
        <View style={styles.btnContainer}>
          <View style={styles.locationBtn}>
          <PrimaryButton text="Add Location" 
          onPress={() => setLocationModalVisible(true)} 
          />
          {country && 
            <View style={[styles.infoContainer,shadowStyle]}>
              {country &&
              <View style={styles.subInfo}>
              <Text style={[Global.text,styles.white]}>Country : {country}</Text>
              <TouchableOpacity onPress={() => setCountry('')}>
              <FontAwesomeIcon color={Colors.white} size={22} icon="fa-solid fa-delete-left" />
              </TouchableOpacity>
              </View>
              }
              
              {state &&
              <View style={styles.subInfo}>
              <Text style={[Global.text,styles.white]}>State : {state}</Text>
              <TouchableOpacity onPress={() => setState('')}>
              <FontAwesomeIcon color={Colors.white} size={22} icon="fa-solid fa-delete-left" />
              </TouchableOpacity>
              </View>
              }
              
              {city &&
              <View style={styles.subInfo}>
              <Text style={[Global.text,styles.white]}>City : {city}</Text>
              <TouchableOpacity onPress={() => setCity('')}>
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
                    <Text style={[Global.text,styles.white]}>{category}</Text>
                    <TouchableOpacity onPress={() => setCategory('')}>
                    <FontAwesomeIcon color={Colors.white} size={22} icon="fa-solid fa-delete-left" />
                    </TouchableOpacity>
                  </View>
                  }
                  {option && 
                  <View style={styles.subInfo}>
                  <Text style={[Global.text,styles.white]}>{option}</Text>
                  <TouchableOpacity onPress={() => setOption('')}>
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
      {/* {loading && <ActivityIndicator size="large" color={Colors.primary} />} */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <FlatList
        data={filteredPosts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <PostCard 
            owner={item.ownerName} 
            postTitle={item.title} 
            postImageSource={item.images && item.images.length > 0 ? item.images[0] : null}
            onPress={() => console.log('Post pressed', item.images[0])}
          />
        )}
        ListEmptyComponent={searchTerm && !loading && filteredPosts.length === 0 && <Text>No posts found</Text>}
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
          <View style={styles.more}>
              <TouchableOpacity onPress={fetchMore}>
                <FontAwesomeIcon icon="fa-solid fa-chevron-down" />
              </TouchableOpacity>
          </View>
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

});

export default PostSearch;
