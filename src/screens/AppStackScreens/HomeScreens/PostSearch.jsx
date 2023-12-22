import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet,Modal,TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { debounce } from 'lodash';
import PostCard from '../../../components/PostCard';
import Colors from '../../../constant/Colors';
import { Global } from '../../../constant/Global';
import Location from '../../AppStackScreens/service/Location';
import CategoryPicker from '../service/CategoryPicker';
import ServiceCategoryPicker from '../service/ServiceCategoryPicker';
import PrimaryButton from '../../../components/Buttons/PrimaryButton';
import LinearGradient from 'react-native-linear-gradient';
import { shadowStyle } from '../../../constant/Shadow';

const PostSearch = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('');
  const [option, setOption] = useState('');
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');




  const fetchPosts = async () => {
    setLoading(true);
    try {
      const snapshot = await firestore().collection('posts').get();
      const fetchedPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllPosts(fetchedPosts);
    } catch (err) {
      setError('Failed to fetch posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearch = useCallback(debounce((query) => {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = allPosts.filter(post =>
      post.title.toLowerCase().includes(lowerCaseQuery) ||
      post.ownerName.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredPosts(filtered);
  }, 300), [allPosts]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPosts([]);
    } else {
      handleSearch(searchTerm);
    }
  }, [searchTerm, handleSearch]);


  const handleLocationSave = (selectedCountry, selectedState, selectedCity) => {
    if (
      selectedCountry !== country ||
      selectedState !== state ||
      selectedCity !== city
    ) {
      setCountry(selectedCountry || '');
      setState(selectedState || '');
      setCity(selectedCity || '');
    }
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
            <View style={[styles.infoContainer,shadowStyle]}>
              {country && <Text style={[Global.text,styles.white]}>Country : {country}</Text>}
              {state && <Text style={[Global.text,styles.white]}>State : {state}</Text>}
              {city && <Text style={[Global.text,styles.white]}>City : {city}</Text>}
            </View>
          </View>
          <View style={styles.categoryBtn}>
          <PrimaryButton text="Add Category" onPress={() => console.log('Filter pressed')} />
          <View style={styles.chosenCategory}>
          {category && <Text style={Global.text}>{category}</Text>}
          {option && <Text style={Global.text}>{option}</Text>}
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
    borderRadius: 10,
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
