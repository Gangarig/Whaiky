import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView, StyleSheet, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Dimensions } from 'react-native';
import { Global } from '../../../constant/Global';
import { categoriesData } from '../../../constant/dataStatic/categoriesData';
import { shadowStyle } from '../../../constant/Shadow';
import NavigationFooter from '../../../navigation/NavigationFooter';

const Category = ({ navigation, route }) => {
  const [openCategories, setOpenCategories] = useState([]);
  const flatListRef = useRef();
  const [layout, setLayout] = useState({});
  const screenHeight = Dimensions.get('window').height;
  const itemHeight = styles.mainCategory.height;
  const someValue = (screenHeight / 2) - (itemHeight / 2);

  const toggleCategory = (categoryId) => {
    if (openCategories.includes(categoryId)) {
      setOpenCategories(openCategories.filter(id => id !== categoryId));
    } else {
      setOpenCategories([...openCategories, categoryId]);
      flatListRef.current?.scrollToIndex({
        index: categoriesData.findIndex(category => category.id === categoryId),
        animated: true,
        viewPosition: 0.5, // Adjust this value as needed
      });
    }
  };

  const onLayout = (id) => (event) => {
    const { y } = event.nativeEvent.layout;
    setLayout(prev => ({
      ...prev,
      [id]: y,
    }));
  };

  const navigateToDetail = (optionId) => {
    navigation.navigate('CategoryDetail', { optionId });
  };

  const renderItem = ({ item }) => (
    <View
      onLayout={onLayout(item.id)}
      style={shadowStyle}
    >
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={['rgb(158, 66, 240)', 'rgb(95, 109, 203)']}
        style={[styles.mainCategory]}
      >
        <TouchableOpacity style={styles.mainCategory} onPress={() => toggleCategory(item.id)}>
          <Image source={item.icon} style={styles.icon} />
          <Text style={[Global.titleSecondary, styles.title]}>{item.text}</Text>
        </TouchableOpacity>
      </LinearGradient>
      {openCategories.includes(item.id) && (
        <View style={styles.optionsContainer}>
          {item.options.map(option => (
            <TouchableOpacity
              key={option.optionId}
              onPress={() => navigateToDetail(option.optionId)}
            >
              <Text style={styles.optionText}>{`\u2022 ${option.text}`}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <View style={styles.border}></View>
    </View>
  );

  return (
    <View style={{flex:1}}>
    <FlatList
      style={styles.container}
      contentContainerStyle={[styles.contentContainerStyle, styles.bottomPadding]}
      data={categoriesData}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      ref={flatListRef}
    />
    <NavigationFooter navigation={navigation}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  contentContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 16,
    paddingVertical: 16,
  },
  mainCategory: {
    width: 350,
    height: 85,
    borderRadius: 10,
    paddingLeft: 5,
    gap: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: '#FFF',
    fontSize: 24,
    height: 30,
  },
  optionsContainer: {
    marginLeft: 16,
    marginBottom: 16,
    backgroundColor: '#7b7b7b',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    width: 320,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 16,
    marginBottom: 4,
    color: '#FFF',
  },
  icon: {
    width: 60,
    height: 60,
  },
  bottomPadding: {
    paddingBottom: 100,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    marginTop: 16,
  },
});

export default Category;
