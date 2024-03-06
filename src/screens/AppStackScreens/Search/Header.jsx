import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import TwoSelectButton from '../../../components/Buttons/TwoSelectButton';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Fonts from '../../../constant/Fonts';
import shadowStyle from '../../../constant/Shadow';

const Header = ({
  theme,
  onAddLocationPress,
  onAddCategoryPress,
  onSearchTypeToggle,
  country,
  state,
  city,
  category,
  categoryId,
  option,
  clearCountry,
  clearState,
  clearCity,
  clearCategory,
  clearOption
}) => {
  return (
    <View style={[styles.header, { borderBottomColor: theme.primary, backgroundColor: theme.background }]}>
      <TextInput 
        style={[styles.searchTextInput, { backgroundColor: theme.background, borderColor: theme.primary }]}
        placeholder="Search"
        // value and onChangeText should be handled if you need a search functionality
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
        <TwoSelectButton
          primary="Toggle Search"
          secondary={category ? 'Clear Filters' : 'Search Users/Posts'} 
          onPressPrimary={onSearchTypeToggle}
          onPressSecondary={category ? clearCategory : () => {}} //
        />
      </View>
      {(country || state || city || category || option) && (
        <View style={[styles.info, { backgroundColor: theme.primary }, shadowStyle]}>
          {country && (
            <View style={styles.subInfo}>
              <Text style={[styles.value, { color: theme.white }]}>Country: {country}</Text>
              <TouchableOpacity onPress={clearCountry}>
                <FontAwesomeIcon icon="fa-solid fa-delete-left" size={22} color={theme.white} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 15,
    paddingTop: 16,
    borderBottomWidth: 1,
  },
  searchTextInput: {
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
    borderRadius: 12,
    marginBottom: 16,
    padding: 10,
  },
  subInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  value: {
    fontSize: 14,
    fontFamily: Fonts.primary,
  },
});

export default Header;
