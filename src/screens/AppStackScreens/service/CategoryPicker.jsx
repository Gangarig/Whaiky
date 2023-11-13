import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Modal } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { categoriesData } from '../../../constant/dataStatic/categoriesData';
import { Global } from '../../../constant/Global';

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
    
    const selectedOptionText = selectedCategory
      ? categoriesData
          .find((category) => category.id === parseInt(selectedCategory))
          .options.find((option) => option.optionId === parseInt(selectedOption))
          .text
      : null;

    onSave(selectedCategory, selectedOption, selectedCategoryText, selectedOptionText);
    onClose();
  };

  return (
    <Modal transparent={true} visible={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={Global.title}>Select Category</Text>
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
              <Text style={Global.title}>Select Option</Text>
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

          <Button title="Save" onPress={handleSave} />
          <Button title="Close" onPress={() => onClose()} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
  },
  modalContent: {
    height: '80%',
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  dropDown: {
    marginBottom: 10,
  },
});

export default CategoryPicker;
