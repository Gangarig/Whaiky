import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';

import { categoriesData } from '../../dataStatic/categoriesData';

const Category = ({ navigation, route }) => {
  const [openCategories, setOpenCategories] = useState([]);

  const toggleCategory = (categoryId) => {
    if (openCategories.includes(categoryId)) {
      setOpenCategories(openCategories.filter(id => id !== categoryId));
    } else {
      setOpenCategories([...openCategories, categoryId]);
    }
  };

  const navigateToDetail = (optionId) => {
    navigation.navigate('CategoryDetail', { optionId });
  };

  return (
    <View style={styles.container}>
      {categoriesData.map(category => (
        <View key={category.id}>
          <TouchableOpacity onPress={() => toggleCategory(category.id)}>
            <Text style={styles.mainCategory}>{category.text}</Text>
          </TouchableOpacity>
          {openCategories.includes(category.id) && (
            <View style={styles.optionsContainer}>
              {category.options.map(option => (
                <TouchableOpacity
                  key={option.optionId}
                  onPress={() => navigateToDetail(option.optionId)}
                >
                  <Text style={styles.optionText}>{option.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  mainCategory: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  optionsContainer: {
    marginLeft: 16,
    marginBottom: 16,
  },
  optionText: {
    fontSize: 16,
    marginBottom: 4,
  },
});

export default Category;
