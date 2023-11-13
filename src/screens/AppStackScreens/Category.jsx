import React, { useState } from 'react';
import { View, Text,Image, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { Global}  from '../../../style/Global'
import { categoriesData } from '../../dataStatic/categoriesData';
import { ScrollView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { useRef } from 'react';
import { Dimensions } from 'react-native';


const Category = ({ navigation, route }) => {
  const [openCategories, setOpenCategories] = useState([]);
  const scrollViewRef = useRef(); 
  const [layout, setLayout] = useState({});
  const screenHeight = Dimensions.get('window').height;
  const itemHeight = styles.mainCategory.height; 
  const someValue = (screenHeight / 2) - (itemHeight / 2);
  const toggleCategory = (categoryId) => {
    if (openCategories.includes(categoryId)) {
      setOpenCategories(openCategories.filter(id => id !== categoryId));
    } else {
      setOpenCategories([...openCategories, categoryId]);
      scrollViewRef.current?.scrollTo({
        y: layout[categoryId] - (someValue), 
        animated: true,
      });
    }
  };
  
  const onLayout = (id) => (event) => {
    const {y} = event.nativeEvent.layout;
    setLayout(prev => ({
      ...prev,
      [id]: y,
    }));
  };

  const navigateToDetail = (optionId) => {
    navigation.navigate('CategoryDetail', { optionId });
  };

  return (
    <ScrollView style={styles.container}
      contentContainerStyle={[styles.contentContainerStyle, styles.bottomPadding]}
      ref={scrollViewRef}
    >
      {categoriesData.map(category => (
        <View key={category.id}
          onLayout={onLayout(category.id)}
          >
          <LinearGradient
          start={{x: 0, y: 0}} 
          end={{x: 1, y: 0}}
          colors={['rgb(158, 66, 240)', 'rgb(95, 109, 203)']}
          style={styles.mainCategory}
          >
            <TouchableOpacity style={styles.mainCategory} onPress={() => toggleCategory(category.id)}>
            <Image source={category.icon} style={styles.icon} />
            <Text style={[Global.titleSecondary,styles.title]}>{category.text}</Text>
            </TouchableOpacity>
          </LinearGradient>
          {openCategories.includes(category.id) && (
            <View style={styles.optionsContainer}>
              {category.options.map(option => (
                <TouchableOpacity
                  key={option.optionId}
                  onPress={() => navigateToDetail(option.optionId)}
                >
              <Text style={styles.optionText}>{`\u2022 ${option.text}`}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      ))}
    </ScrollView>
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
  icon : {
    width: 60,
    height: 60,
  },
  bottomPadding: {
    paddingBottom: 100,
  },
});

export default Category;
