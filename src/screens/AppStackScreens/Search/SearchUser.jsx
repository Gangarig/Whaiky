import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useTheme } from '../../../context/ThemeContext';
import { BlurView } from "@react-native-community/blur";
import PostCard from '../../../components/PostCard';
import Location from '../service/Location';
import CategoryPicker from '../service/CategoryPicker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import TwoSelectButton from '../../../components/Buttons/TwoSelectButton';
import { useAuth } from '../../../context/AuthContext';
import Fonts from '../../../constant/Fonts';
import TwoSelectBtnWithActiveState from '../../../components/Buttons/TwoSelectBtnWithActiveState';
import ProfileCard from '../../../components/ProfileCard';
const Search = ({ navigation }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { currentUser } = useAuth();
  const [active,setActive] = useState(true)

  const [blur, setBlur] = useState(false);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [optionId, setOptionId] = useState('');
  const [category, setCategory] = useState('');
  const [option, setOption] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  const clearOption = () => {
    setOption('');
    setOptionId('');
  };
  
  const clearCategory = () => {
    setCategory('');
    setCategoryId('');
    clearOption();
  };
  
  const clearCity = () => {
    setCity('');
  };
  
  const clearState = () => {
    setState('');
  };
  
  const clearCountry = () => {
    setCountry('');
    clearState();
    clearCity();
  };

  const onAddLocationPress = () => {
    setLocationModalVisible(true);
    setBlur(true);
  };

  const onAddCategoryPress = () => {
    setCategoryModalVisible(true);
    setBlur(true);
  };


  const renderItem = ({ item }) => {
    return (
      <View style={styles.postWrapper}>
       
      </View>
    );
  };

  useEffect(() => {
    fetchUsers();
  }, [searchText, country, state, city, categoryId, optionId]);
  const fetchUsers = async () => {
    setLoading(true);
    try {
      let query = firestore().collection('users');
      if (searchText !== '') {
        query = query.where('keywords', 'array-contains-any', [searchText.toLowerCase()]);
      }
      if (country !== '') {
        query = query.where('country', '==', country);
      }
      if (state !== '') {
        query = query.where('state', '==', state);
      }
      if (city !== '') {
        query = query.where('city', '==', city);
      }
      if (categoryId !== '') {
        query = query.where('categoryId', '==', categoryId);
      }
      if (optionId !== '') {
        query = query.where('optionId', '==', optionId);
      }
      const snapshot = await query.get();
      const fetchedPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.postList}
          numColumns={2}
          ListHeaderComponent={
            <View style={[styles.header, { borderBottomColor: theme.primary, backgroundColor: theme.background }]}>
              <TextInput
                style={[styles.searchTextInput, { backgroundColor: theme.background, borderColor: theme.primary }]}
                placeholder="Search"
                placeholderTextColor={theme.textSecondary}
                onChangeText={text => setSearchText(text)}
                value={searchText}
              />
              <View style={styles.btn}>
                <TwoSelectButton
                  primary="Add Location"
                  secondary="Add Category"
                  onPressPrimary={onAddLocationPress}
                  onPressSecondary={onAddCategoryPress}
                />
              </View>
              <View style={styles.btn}>
                <TwoSelectBtnWithActiveState
                  primary="Search Users"
                  secondary="Search Posts"
                  onPressPrimary={() => navigation.navigate('SearchUsers')}
                  onPressSecondary={() => navigation.navigate('Search')}
                  primaryActive={!active}
                  secondaryActive={active}
                />
              </View>
              {(category || option) && (
                <View style={[styles.info, { backgroundColor: theme.primary }]}>
                  {category && (
                    <View style={styles.subInfo}>
                      <Text style={[styles.value, { color: theme.white }]}>Category: {category}</Text>
                      <TouchableOpacity onPress={clearCategory}>
                        <FontAwesomeIcon icon="fa-solid fa-delete-left" size={22} color={theme.white} />
                      </TouchableOpacity>
                    </View>
                  )}
                  {option && (
                    <View style={styles.subInfo}>
                      <Text style={[styles.value, { color: theme.white }]}>Option: {option}</Text>
                      <TouchableOpacity onPress={clearOption}>
                        <FontAwesomeIcon icon="fa-solid fa-delete-left" size={22} color={theme.white} />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
              {(country || state || city) && (
                <View style={[styles.info, { backgroundColor: theme.primary }]}>
                  {country && (
                    <View style={styles.subInfo}>
                      <Text style={[styles.value, { color: theme.white }]}>Country: {country}</Text>
                      <TouchableOpacity onPress={clearCountry}>
                        <FontAwesomeIcon icon="fa-solid fa-delete-left" size={22} color={theme.white} />
                      </TouchableOpacity>
                    </View>
                  )}
                  {state && (
                    <View style={styles.subInfo}>
                      <Text style={[styles.value, { color: theme.white }]}>State: {state}</Text>
                      <TouchableOpacity onPress={clearState}>
                        <FontAwesomeIcon icon="fa-solid fa-delete-left" size={22} color={theme.white} />
                      </TouchableOpacity>
                    </View>
                  )}
                  {city && (
                    <View style={styles.subInfo}>
                      <Text style={[styles.value, { color: theme.white }]}>City: {city}</Text>
                      <TouchableOpacity onPress={clearCity}>
                        <FontAwesomeIcon icon="fa-solid fa-delete-left" size={22} color={theme.white} />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            </View>
          }
        />
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
        visible={locationModalVisible}
      />
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
        visible={categoryModalVisible}
      />
      {blur && (
        <BlurView
          style={styles.blur}
          blurType="light"
          blurAmount={10}
          reducedTransparencyFallbackColor="white"
        />
      )}
    </View>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  postList: {
    backgroundColor: theme.background,
    flex: 1,
  },
  header: {
    paddingHorizontal: 15,
    paddingTop: 16,
    borderBottomColor: theme.primary,
    borderBottomWidth: 1,
    backgroundColor: theme.background,
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
    marginBottom: 16,
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
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Search;