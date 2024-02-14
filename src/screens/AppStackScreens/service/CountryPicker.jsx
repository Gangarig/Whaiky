import React, { useState, useEffect } from 'react';
import { View, Modal, StyleSheet, Button } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Country } from 'country-state-city';
import PrimaryButton from '../../../components/Buttons/PrimaryButton';
import { useTheme } from '../../../context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const CountryPicker = ({ onSelect, isModalVisible, setModalVisibility }) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const theme = useTheme();
  const styles = getStyles(theme);

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
            placeholderStyle={{ color: theme.primary  }} 
            dropDownContainerStyle={styles.dropdownContainer}
            zIndex={open ? 5000 : undefined}
            zIndexInverse={1000}
            style={styles.dropdown}
            textStyle={styles.textStyle}
            ArrowUpIconComponent={() => <FontAwesomeIcon size={30} color={theme.primary} icon="fa-solid fa-caret-up" />}
            ArrowDownIconComponent={() => <FontAwesomeIcon size={30} color={theme.primary} icon="fa-solid fa-caret-down" />}
            TickIconComponent={() => <FontAwesomeIcon size={20} color={theme.primary} icon="fa-solid fa-check" />}
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

const getStyles = (theme) => {
  return StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: theme.background,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    gap: 10,
    height: 350,
    justifyContent: 'space-between',
    borderColor: theme.primary,
    borderWidth: 1,
  },
  dropdown: {
    borderColor: theme.primary,
    borderradius:10,
    borderWidth: 2.5,
    zIndex: 99,
  },
  textStyle: {
    fontSize: 17,
  },
  dropdownContainer: {
    backgroundColor: theme.white,
    borderColor: theme.primary,
    borderWidth: 2.5,
  },
 
});
};
export default CountryPicker;
