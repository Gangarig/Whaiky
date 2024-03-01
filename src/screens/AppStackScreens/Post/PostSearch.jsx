import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet, Modal, TouchableOpacity } from 'react-native';
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



const PostSearch = ({ navigation }) => {
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
  const [blur, setBlur] = useState(false);
  const header = () => {
    return (
    <View style={styles.header}>
        <TextInput 
          style={styles.searchTextInput}
          placeholder="Search"
          value={searchTerm}
          onChangeText={text => setSearchTerm(text)}
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
          primary={"Search User"}
          secondary={"Search Post"}
          onPressPrimary={() => {
            navigation.navigate('UserSearch');
          }}
          onPressSecondary={() => {}}
          />
        </View>
        <View style={styles.info}>
            {/* {country &&  */}
              <View style={[styles.infoContainer,shadowStyle]}>
                {/* {country && */}
                <View style={styles.subInfo}>
                <Text style={styles.value}>Country : {country || 'N/A'}</Text>
                <TouchableOpacity onPress={
                  ()=>clearCountry()
                }>
                <FontAwesomeIcon color={theme.white} size={22} icon="fa-solid fa-delete-left" />
                </TouchableOpacity>
                </View>
                {/* // } */}
                
                {/* {state && */}
                <View style={styles.subInfo}>
                <Text style={styles.value}>State : {state}</Text>
                <TouchableOpacity onPress={
                  ()=>clearState()
                }>
                <FontAwesomeIcon color={theme.white} size={22} icon="fa-solid fa-delete-left" />
                </TouchableOpacity>
                </View>
                {/* //} */}
                
                {/* // {city && */}
                <View style={styles.subInfo}>
                <Text style={styles.value}>City : {city}</Text>
                <TouchableOpacity onPress={
                  ()=>clearCity()
                }>
                <FontAwesomeIcon color={theme.white} size={22} icon="fa-solid fa-delete-left" />
                </TouchableOpacity>
                </View>
                {/* } */}
              </View>
            {/* } */}
        </View>
        <View style={styles.info}>
              {/* {category &&  */}
                <View style={[styles.infoContainer,shadowStyle]}>
                    {/* {category &&  */}
                    <View style={styles.subInfo}>
                      <Text style={styles.value}>{category || 'N/A'} {categoryId}</Text>
                      <TouchableOpacity onPress={
                        ()=>clearCategory()
                      }>
                      <FontAwesomeIcon color={theme.white} size={22} icon="fa-solid fa-delete-left" />
                      </TouchableOpacity>
                    </View>
                    {/* } */}
                    {/* {option &&  */}
                    <View style={styles.subInfo}>
                    <Text style={styles.value}>{option || 'N/A'}</Text>
                    <TouchableOpacity onPress={
                      ()=>clearOption()
                    }>
                    <FontAwesomeIcon color={theme.white} size={22} icon="fa-solid fa-delete-left" />
                    </TouchableOpacity>
                    </View>
                    {/* } */}
                </View>
              {/* } */}
      </View>
      <View style={styles.bottomBorder}>
      </View>
    </View>
    )
  }

  // Search Functions
  const [posts , setPosts] = useState([]);
  const [users ,setUsers] = useState([]);
  const [searchType , setSearchType] = useState('post');
  const [filteredData , setFilteredData ] = useState([]);






  return (
    <View style={styles.flatlist}>
      <FlatList 
        data={filteredPosts}
        renderItem={({ item }) => <PostCard post={item} />}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={header}
        refreshing={isRefreshing}
      />
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
  flatlist: {
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
    padding: 10,
    marginBottom: 16,
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

});

export default PostSearch;