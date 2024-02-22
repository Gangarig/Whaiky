import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Modal } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { categoriesData } from '../../../constant/dataStatic/categoriesData';
import Fonts from '../../../constant/Fonts';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useTheme } from '../../../context/ThemeContext';
import TwoSelectButton from '../../../components/Buttons/TwoSelectButton';

const CategoryPicker = ({ onSave, onClose }) => {
  const [openCategory, setOpenCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openOption, setOpenOption] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const theme = useTheme();
  const styles = getStyles(theme);

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
          <Text style={styles.text}>Select Category</Text>
          <DropDownPicker
            open={openCategory}
            value={selectedCategory}
            items={categoryItems}
            setOpen={setOpenCategory}
            setValue={setSelectedCategory}
            setItems={() => {}}
            style={styles.dropdown}
            textStyle={styles.textStyle}
            dropDownContainerStyle={styles.dropdownContainer}
            ArrowUpIconComponent={() => <FontAwesomeIcon size={18} color={theme.primary} icon="fa-solid fa-chevron-up" />}
            ArrowDownIconComponent={() => <FontAwesomeIcon size={18} color={theme.primary} icon="fa-solid fa-chevron-down" />}
            TickIconComponent={() => <FontAwesomeIcon size={20} color={theme.primary} icon="fa-solid fa-check" />}
            zIndex={1000}
          />

          {selectedCategory && (
            <>
              <Text style={styles.text}>Select Option</Text>
              <DropDownPicker
                open={openOption}
                value={selectedOption}
                items={optionItems}
                setOpen={setOpenOption}
                setValue={setSelectedOption}
                setItems={() => {}}
                style={styles.dropdown}
                textStyle={styles.textStyle}
                dropDownContainerStyle={styles.dropdownContainer}
                ArrowUpIconComponent={() => <FontAwesomeIcon size={18} color={theme.primary} icon="fa-solid fa-chevron-up" />}
                ArrowDownIconComponent={() => <FontAwesomeIcon size={18} color={theme.primary} icon="fa-solid fa-chevron-down" />}
                TickIconComponent={() => <FontAwesomeIcon size={20} color={theme.primary} icon="fa-solid fa-check" />}
                zIndex={500}
              />
            </>
          )}
          <View style={styles.buttonBox}>
          <TwoSelectButton
            primary="Save"
            secondary="Cancel"
            onPressPrimary={handleSave}
            onPressSecondary={onClose}
          />
          </View>
        </View>
  );
};

export default CategoryPicker;

const getStyles = (theme) => StyleSheet.create({
  container:{
    width:'100%',
    margin:0,
    gap:10,
    backgroundColor:theme.white,
    zIndex: 9999,
    padding:10,
    flex:1,
  },
  dropdown: {
    borderColor: theme.primary,
    borderradius:12,
    borderWidth: 1,
    zIndex: 99,
  },
  textStyle: {
    fontSize: 17,
  },
  dropdownContainer: {
    backgroundColor: theme.white,
    borderColor: theme.primary,
    borderWidth: 1,
  },
  btnContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    width:'100%',
    gap:10,
    marginTop:10,
  },
  buttonBox: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    zIndex: 1,
  },
  text: {
    fontSize: 14,
    color: theme.text,
    fontFamily: Fonts.primary,
  },

  
});
