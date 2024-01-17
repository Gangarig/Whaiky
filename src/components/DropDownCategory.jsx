import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { categoriesData } from '../constant/dataStatic/categoriesData';
import UserTheme from '../constant/Theme';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const DropDownCategory = ({ onSave, onClose }) => {
  const [openCategory, setOpenCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openOption, setOpenOption] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const categoryItems = categoriesData.map((category) => ({
    label: category.text,
    value: category.id.toString(),
  }));

  const optionItems = selectedCategory
    ? categoriesData
        .find((category) => category.id === parseInt(selectedCategory))
        .options.map((option) => ({
          label: option.text,
          value: option.optionId.toString(),
        }))
    : [];

  useEffect(() => {
    setOpenOption(false);
  }, [selectedCategory]);

  const handleSave = () => {
    const selectedCategoryText = categoriesData.find(
      (category) => category.id === parseInt(selectedCategory)
    ).text;
    
    let selectedOptionText = null;
    if (selectedCategory) {
      const selectedCategoryData = categoriesData.find(
        (category) => category.id === parseInt(selectedCategory)
      );
      if (selectedCategoryData && selectedOption) {
        const selectedOptionData = selectedCategoryData.options.find(
          (option) => option.optionId === parseInt(selectedOption)
        );
        if (selectedOptionData) {
          selectedOptionText = selectedOptionData.text;
        }
      }
    }
  
    onSave(selectedCategory, selectedOption, selectedCategoryText, selectedOptionText);
    onClose();
  };
  

  return (
        <View style={styles.container}>
          <DropDownPicker
            open={openCategory}
            value={selectedCategory}
            items={categoryItems}
            setOpen={setOpenCategory}
            setValue={setSelectedCategory}
            setItems={() => {}}
            zIndex={1000}
            style={styles.dropdown}
            textStyle={styles.textStyle}
            dropDownContainerStyle={styles.dropdownContainer}
            ArrowUpIconComponent={() => <FontAwesomeIcon size={35} color={UserTheme.primary} icon="fa-solid fa-caret-up" />}
            ArrowDownIconComponent={() => <FontAwesomeIcon size={35} color={UserTheme.primary} icon="fa-solid fa-caret-down" />}
            TickIconComponent={() => <FontAwesomeIcon size={25} color={UserTheme.primary} icon="fa-solid fa-check" />}
         />

          {selectedCategory && (
              <DropDownPicker
                open={openOption}
                value={selectedOption}
                items={optionItems}
                setOpen={setOpenOption}
                setValue={setSelectedOption}
                setItems={() => {}}
                zIndex={500}
                style={styles.dropdown}
                textStyle={styles.textStyle}
                dropDownContainerStyle={styles.dropdownContainer}
                ArrowUpIconComponent={() => <FontAwesomeIcon size={35} color={UserTheme.primary} icon="fa-solid fa-caret-up" />}
                ArrowDownIconComponent={() => <FontAwesomeIcon size={35} color={UserTheme.primary} icon="fa-solid fa-caret-down" />}
                TickIconComponent={() => <FontAwesomeIcon size={25} color={UserTheme.primary} icon="fa-solid fa-check" />}
              />
          )}


        </View>
  );
};

const styles = StyleSheet.create({
  container:{
    width:'100%',
    margin:0,
    gap:10,
    backgroundColor:UserTheme.white,
    zIndex: 9999,
  },
  dropdown: {
    borderColor: UserTheme.primary,
    borderWidth: 2.5,
    zIndex: 99,
  },
  textStyle: {
    fontSize: 20,
  },
  dropdownContainer: {
    backgroundColor: UserTheme.white,
    borderColor: UserTheme.primary,
    borderWidth: 2.5,
  },
})

export default DropDownCategory;
