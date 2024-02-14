import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../../context/ThemeContext';
import { categoriesData } from '../../../constant/dataStatic/categoriesData';
import { shadowStyle } from '../../../constant/Shadow';

const Category = ({ navigation }) => {
  const [openCategories, setOpenCategories] = useState([]);
  const flatListRef = useRef();
  const theme = useTheme();
  const styles = getStyles(theme);
  const screenHeight = Dimensions.get('window').height;
  const [itemHeight, setItemHeight] = useState(85); 
  useEffect(() => {
    setItemHeight(styles.mainCategory.height);
  }, [styles.mainCategory.height]);

  const someValue = (screenHeight / 2) - (itemHeight / 2);

  const toggleCategory = (categoryId) => {
    if (openCategories.includes(categoryId)) {
      setOpenCategories(openCategories.filter(id => id !== categoryId));
    } else {
      setOpenCategories([categoryId]);
      const index = categoriesData.findIndex(category => category.id === categoryId);
      if (index !== -1) {
        flatListRef.current?.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.5, 
        });
      }
    }
  };

  const navigateToDetail = (optionId) => {
    navigation.navigate('CategoryDetail', { optionId });
  };

  const renderItem = ({ item }) => (
    <View style={styles.shadowContainer}>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 2, y: 0 }}
        colors={[theme.primary, theme.secondary]}
        style={styles.mainCategory}
      >
        <TouchableOpacity onPress={() => toggleCategory(item.id)} style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <Image source={item.icon} style={styles.icon} />
          <Text style={styles.title}>{item.text}</Text>
        </TouchableOpacity>
      </LinearGradient>
      {openCategories.includes(item.id) && (
        <View style={styles.optionsContainerWrapper}>
        <View style={styles.optionsContainer}>
          {item.options.map((option) => (
            <TouchableOpacity
              key={option.optionId}
              onPress={() => navigateToDetail(option.optionId)}
            >
              <Text style={styles.optionText}>{`\u2022 ${option.text}`}</Text>
            </TouchableOpacity>
          ))}
        </View>
        </View>
      )}
    </View>
  );

  return (
    <FlatList
      data={categoriesData}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      ref={flatListRef}
      contentContainerStyle={{ alignItems: 'center',justifyContent:'center', paddingVertical: 20, width: '100%'}}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      style={styles.FlatList}
    />
  );
};

const getStyles = (theme) => StyleSheet.create({
  shadowContainer: {
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden', 
  },
  mainCategory: {
    width: 350,
    height: 85,
    borderRadius: 10,
    paddingLeft: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: theme.white,
    fontSize: 24,
  },
  optionsContainerWrapper: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,  
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  } ,
  optionsContainer: {
    backgroundColor: theme.gray,
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,  
    width: '90%',
  },
  optionText: {
    color: theme.white,
    fontSize: 16,
    marginBottom: 4,
  },
  icon: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
});

export default Category;
