import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import UserTheme from '../constant/Theme';
import { useFooter } from '../context/FooterContext';

const NavigationFooter = ({ navigation }) => {
  const { activeItem, setFooterActiveItem } = useFooter(); // Use the context hook

  const handlePress = (item) => {
    setFooterActiveItem(item);
    navigation.navigate(item);
  };

  return (
    <View style={styles.NavigationFooter}>
      {['Home', 'Category', 'AddPost', 'Messages', 'Profile'].map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handlePress(item)}
          style={styles.iconWrapper}
        >
          <FontAwesomeIcon size={20} color={UserTheme.white} icon={icons[item]} />
          {activeItem === item && <View style={styles.bottomBorder}></View>}
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Define the icons for each item
const icons = {
  Home: "fa-solid fa-house",
  Category: "fa-solid fa-list",
  AddPost: "fa-regular fa-pen-to-square",
  Messages: "fa-regular fa-comment-dots",
  Profile: "fa-regular fa-user"
};

export default NavigationFooter;

const styles = StyleSheet.create({
  NavigationFooter: {
    height: 50,
    flexDirection: 'row',
    backgroundColor: UserTheme.lightPrimary,
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  iconWrapper: {
    alignItems: 'center',
  },
  bottomBorder: {
    width: 20,
    backgroundColor: UserTheme.white,
    marginTop: 3,
    height: 2,
  }
});
