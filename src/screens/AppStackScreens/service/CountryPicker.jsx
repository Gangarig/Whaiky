import React, { useState, useEffect } from 'react';
import { View, Modal, StyleSheet, Button } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Country } from 'country-state-city';
import PrimaryButton from '../../../components/Buttons/PrimaryButton';
import Colors from '../../../constant/Colors';
const CountryPicker = ({ onSelect, isModalVisible, setModalVisibility }) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);

  useEffect(() => {
    const countries = Country.getAllCountries().map((country) => ({
      label: country.name,
      value: country.name,
    }));
    setItems(countries);
  }, []);

  const onValueChange = (selectedItem) => {
    setSelectedValue(selectedItem);
    onSelect(selectedItem); // Pass the selected country back to parent
  };

  return (
    <Modal
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => setModalVisibility(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <DropDownPicker
            open={open}
            value={selectedValue}
            items={items}
            setOpen={setOpen}
            setValue={onValueChange}
            placeholder="Country of Issue"
            placeholderStyle={{ color: Colors.primary  }} 
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            zIndex={open ? 5000 : undefined}
            zIndexInverse={1000}

          />
          <PrimaryButton
            text="Close"
            onPress={() => setModalVisibility(false)}
          />
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    gap: 10,
    height: 350,
    justifyContent: 'space-between',
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  dropdown: {
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  dropdownContainer: {
    borderColor: Colors.primary,
  },
  // ... other styles ...
});

export default CountryPicker;
