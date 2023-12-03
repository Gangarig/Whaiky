import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Country } from 'country-state-city';
import { Global } from '../../../constant/Global';

const CountryPicker = ({ onSelect, value }) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null); // Track the selected value

  useEffect(() => {
    const countries = Country.getAllCountries().map((country) => ({
      label: country.name,
      value: country.name,
    }));
    setItems(countries);
  }, []);

  useEffect(() => {
    // Update the selectedValue whenever the value prop changes
    setSelectedValue(value);
  }, [value]);

  const handleOpen = useCallback(() => {
    setOpen((prevState) => !prevState);
  }, []);

  return (
    <View style={styles.container}>
      <DropDownPicker
        open={open}
        value={selectedValue}
        items={items}
        setOpen={handleOpen}
        setValue={(selectedItem) => {
          setSelectedValue(selectedItem);
          onSelect(selectedItem);
        }}
        placeholder="Country of Issue"
        placeholderStyle={{ color: 'gray' }} 
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        zIndex={open ? 5000 : undefined}
        zIndexInverse={1000}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 10,
  },

  dropdown: {
    borderColor: 'black',
    borderWidth: 1,
  },
  dropdownContainer: {
    borderColor: '#ddd',
  },
});

export default CountryPicker;
