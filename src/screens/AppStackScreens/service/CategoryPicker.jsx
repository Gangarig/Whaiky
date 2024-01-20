import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Modal } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { categoriesData } from '../../../constant/dataStatic/categoriesData';
import { Global } from '../../../constant/Global';
import Colors from '../../../constant/Colors';
import LinearGradient from 'react-native-linear-gradient';
import PrimaryButton from '../../../components/Buttons/PrimaryButton';
import { showMessage } from 'react-native-flash-message';
import UserTheme from '../../../constant/Theme';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';


const CategoryPicker = ({ onSave, onClose }) => {
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
          <Text style={Global.titleSecondary}>Select Category</Text>
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
            ArrowUpIconComponent={() => <FontAwesomeIcon size={30} color={UserTheme.primary} icon="fa-solid fa-caret-up" />}
            ArrowDownIconComponent={() => <FontAwesomeIcon size={30} color={UserTheme.primary} icon="fa-solid fa-caret-down" />}
            TickIconComponent={() => <FontAwesomeIcon size={20} color={UserTheme.primary} icon="fa-solid fa-check" />}
            zIndex={1000}
          />

          {selectedCategory && (
            <>
              <Text style={Global.titleSecondary}>Select Option</Text>
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
                ArrowUpIconComponent={() => <FontAwesomeIcon size={30} color={UserTheme.primary} icon="fa-solid fa-caret-up" />}
                ArrowDownIconComponent={() => <FontAwesomeIcon size={30} color={UserTheme.primary} icon="fa-solid fa-caret-down" />}
                TickIconComponent={() => <FontAwesomeIcon size={20} color={UserTheme.primary} icon="fa-solid fa-check" />}
                zIndex={500}
              />
            </>
          )}
            <View style={styles.btnContainer}>
              <PrimaryButton text="Done" onPress={handleSave} />
              <PrimaryButton text="Cancel" onPress={onClose} />
            </View>
        </View>
  );
};

export default CategoryPicker;

const styles = StyleSheet.create({
  container:{
    width:'100%',
    margin:0,
    gap:10,
    backgroundColor:UserTheme.white,
    zIndex: 9999,
    padding:10,
  },
  dropdown: {
    borderColor: UserTheme.primary,
    borderradius:10,
    borderWidth: 2.5,
    zIndex: 99,
  },
  textStyle: {
    fontSize: 17,
  },
  dropdownContainer: {
    backgroundColor: UserTheme.white,
    borderColor: UserTheme.primary,
    borderWidth: 2.5,
  },
  btnContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    width:'100%',
    gap:10,
    marginTop:10,
  },
});
