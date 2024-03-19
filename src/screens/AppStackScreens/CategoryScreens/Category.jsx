import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../../context/ThemeContext';
import { categoriesData } from '../../../constant/dataStatic/categoriesData';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

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

  const categoryIcons = {
    1: 'fa-solid fa-house',
    2: 'fa-solid fa-spray-can-sparkles',
    3: 'fa-solid fa-fire', 
    4: 'fa-solid fa-paint-roller',
    5: 'fa-solid fa-bolt',    
    6: 'fa-solid fa-temperature-arrow-up',
    7: 'fa-solid fa-droplet-slash',
    8: 'fa-solid fa-truck',
    9: 'fa-solid fa-seedling',
    10: 'fa-solid fa-screwdriver-wrench',
    11: 'fa-solid fa-person',
  };


  const renderItem = ({ item }) => (
    <View style={styles.categoryContainer}>
      <TouchableOpacity style={styles.categoryWrapper}
        onPress={() => toggleCategory(item.id)}
        activeOpacity={0.7}
      >
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 2, y: 0 }}
          colors={[theme.primary, theme.secondary]}
          style={styles.mainCategory}
        >
            <FontAwesomeIcon size={40} style={[]} color={theme.white}
              icon={categoryIcons[item.id]}
            />
            <Text style={styles.title}>{item.text}</Text>
        </LinearGradient>
        </TouchableOpacity>
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
  FlatList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  categoryContainer: {
    minWidth: '100%',
    marginBottom: 16,
  },
  categoryWrapper: {
    width: '100%',
  },
  mainCategory: {
    height: 85,
    width: '100%',
    flexDirection: 'row',
    borderRadius  : 12,
    alignItems: 'center',
    paddingLeft: 20,
  },
  title: {
    color: theme.white,
    fontSize: 24,
    paddingLeft: 25,
  },
  optionsContainerWrapper: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,  
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
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
