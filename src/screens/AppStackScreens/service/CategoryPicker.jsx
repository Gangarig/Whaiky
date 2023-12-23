import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Modal } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { categoriesData } from '../../../constant/dataStatic/categoriesData';
import { Global } from '../../../constant/Global';
import Colors from '../../../constant/Colors';
import LinearGradient from 'react-native-linear-gradient';
import PrimaryButton from '../../../components/Buttons/PrimaryButton';
import { showMessage } from 'react-native-flash-message';


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
        <View style={styles.modalContent}>
          <Text style={Global.titleSecondary}>Select Category</Text>
          <DropDownPicker
            open={openCategory}
            value={selectedCategory}
            items={categoryItems}
            setOpen={setOpenCategory}
            setValue={setSelectedCategory}
            setItems={() => {}}
            style={styles.dropDown}
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
                style={styles.dropDown}
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

const styles = StyleSheet.create({
  modalContent: {
    width: '100%',
    backgroundColor: Colors.background,
    padding: 20,
    borderRadius: 10,
    gap: 10,
  },
  dropDown: {
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  btnContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 10,
  },


});

export default CategoryPicker;
