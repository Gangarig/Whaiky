import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { debounce } from 'lodash';
import PostCard from '../../../components/PostCard';
import Colors from '../../../constant/Colors';
import {Global} from '../../../constant/Global';
import Location from '../../AppStackScreens/service/Location';
import CategoryPicker from '../service/CategoryPicker';
import PrimaryButton from '../../../components/Buttons/PrimaryButton';
import shadowStyle from '../../../constant/Shadow';

const PostSearch = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('');
  const [option, setOption] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [optionId, setOptionId] = useState('');
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  const isMounted = useRef(true);

  useEffect(() => {
    fetchPosts();
    return () => {
      isMounted.current = false;
      resetStates();
    };
  }, []);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError('');
    setFilteredPosts([]);

    try {
      let query = firestore().collection('posts');
      if (country) query = query.where('country', '==', country);
      if (state) query = query.where('state', '==', state);
      if (city) query = query.where('city', '==', city);
      if (categoryId) query = query.where('categoryId', '==', categoryId);
      if (optionId) query = query.where('optionId', '==', optionId);

      const snapshot = await query.get();
      const fetchedPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (isMounted.current) {
        setAllPosts(fetchedPosts);
        applyFilters(fetchedPosts);
      }
    } catch (err) {
      if (isMounted.current) {
        setError(`Failed to fetch posts: ${err.message}`);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [country, state, city, categoryId, optionId]);

  const resetStates = () => {
    setAllPosts([]);
    setFilteredPosts([]);
    setSearchTerm('');
    setError('');
    // Reset other states as needed
  };

  const applyFilters = useCallback((posts) => {
    const lowerCaseQuery = searchTerm.toLowerCase();
    const filtered = posts.filter(post =>
      (post.title.toLowerCase().includes(lowerCaseQuery) ||
       post.ownerName.toLowerCase().includes(lowerCaseQuery)) &&
      (!country || post.country === country) &&
      (!state || post.state === state) &&
      (!city || post.city === city) &&
      (!categoryId || post.categoryId === categoryId) &&
      (!optionId || post.optionId === optionId)
    );
    setFilteredPosts(filtered);
  }, [searchTerm, country, state, city, categoryId, optionId]);

  useEffect(() => {
    if (isMounted.current) {
      applyFilters(allPosts);
    }
  }, [searchTerm, applyFilters, allPosts]);

  const handleLocationSave = (selectedCountry, selectedState, selectedCity) => {
    setCountry(selectedCountry || '');
    setState(selectedState || '');
    setCity(selectedCity || '');
    fetchPosts();
  };

  const handleCategorySave = (selectedCategoryId, selectedOptionId, selectedCategoryText, selectedOptionText) => {
    setCategoryId(selectedCategoryId);
    setOptionId(selectedOptionId);
    setCategory(selectedCategoryText);
    setOption(selectedOptionText);
    fetchPosts();
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <View style={styles.searchInput}>
        <Text style={[Global.titleSecondary,styles.searchLabel]}> Search with / Post Title or Poster Name /. </Text>
        <TextInput
          placeholder="Search"
          style={Global.input}
          onChangeText={setSearchTerm}
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
              {country && <Text style={[Global.text,styles.white]}>Country : {country}</Text>}
              {state && <Text style={[Global.text,styles.white]}>State : {state}</Text>}
              {city && <Text style={[Global.text,styles.white]}>City : {city}</Text>}
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
              {category && <Text style={[Global.text,styles.white]}>{category}</Text>}
              {option && <Text style={[Global.text,styles.white]}>{option}</Text>}
              </View>
            }
          </View>
          </View>
        </View>
      </View>
      {loading && <ActivityIndicator size="large" color={Colors.primary} />}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <FlatList
        data={filteredPosts.length > 0 ? filteredPosts : allPosts}
        keyExtractor={(item) => item.id.toString()}
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

});

export default PostSearch;
