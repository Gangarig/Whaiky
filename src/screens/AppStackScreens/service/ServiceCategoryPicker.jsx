import { View, Text, Button, TextInput, Alert, StyleSheet, Modal, FlatList } from 'react-native';
import React from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { useState, useEffect } from 'react';
import { showMessage } from 'react-native-flash-message';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../../context/AuthContext';
import { Global } from '../../../constant/Global';
import { categoriesData } from '../../../constant/dataStatic/categoriesData';
import PrimaryButton from '../../../components/Buttons/PrimaryButton';
import theme from '../../../constant/Theme';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useTheme } from '../../../context/ThemeContext';


const ServiceCategoryPicker = ({ onServicesChange, modalVisible, toggleModal }) => {
  const [openCategory, setOpenCategory] = useState(false);
  const [valueCategory, setValueCategory] = useState(null);
  const [openOptions, setOpenOptions] = useState(false);
  const [valueOption, setValueOption] = useState(null);
  const [options, setOptions] = useState([]);
  const [showTextInput, setShowTextInput] = useState(false);
  const [customText, setCustomText] = useState('');
  const [services, setServices] = useState([]);
  const [image ,setImage]=useState(null);
  const { currentUser } = useAuth();
  const theme = useTheme();
  const styles = getStyles(theme);
  const items = categoriesData.map(cat => ({
    label: cat.text,
    value: cat.id
  }));

  const getCategoryTextById = (categoryId) => {
    const category = categoriesData.find(cat => cat.id === categoryId);
    return category ? category.text : '';
  };

  const getOptionTextById = (optionId) => {
    for (let category of categoriesData) {
      const option = category.options.find(opt => opt.optionId === optionId);
      if (option) return option.text;
    }
    return '';
  };

  const handleDeleteService = (index) => {
    Alert.alert(
      "Delete Service",
      "Are you sure you want to delete this service?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete", onPress: () => {
            const updatedServices = [...services];
            updatedServices.splice(index, 1);
            setServices(updatedServices);
          }
        }
      ]
    );
  };

  useEffect(() => {
    if (valueCategory) {
      const selectedCategory = categoriesData.find(cat => cat.id === valueCategory);
      const optionItems = selectedCategory.options.map(option => ({
        label: option.text,
        value: option.optionId
      }));
      setOptions(optionItems);

      if (valueCategory === 11) {
        setShowTextInput(true);
      } else {
        setShowTextInput(false);
      }
    } else {
      setOptions([]);
    }
  }, [valueCategory]);

  const handleAddService = () => {
    if (valueCategory && (valueOption || (valueCategory === 11 && customText))) {
      const newService = {
        categoryId: valueCategory,
        categoryText: getCategoryTextById(valueCategory),
        optionId: valueOption,
        optionText: valueCategory === 11 ? customText : getOptionTextById(valueOption),
      };
  
      // Here, we add the new service to Firestore
      firestore()
        .collection('users')
        .doc(currentUser.uid) // make sure currentUser is accessible
        .update({
          services: firestore.FieldValue.arrayUnion(newService),
        })
        .then(() => {
          showMessage({
            message: "Service added successfully!",
            type: "success",
          });
          // Optionally, if you want to reflect this in local state immediately
          setServices(prev => [...prev, newService]);
        })
        .catch(error => {
          console.error("Error adding service: ", error);
          showMessage({
            message: "Error adding service. Please try again.",
            type: "danger",
          });
        });
  
      setValueCategory(null);
      setValueOption(null);
      setCustomText('');
    } else {
      showMessage({
        message: "Cannot add service. Category or option missing.",
        type: "danger",
      });
    }
  };
  

  useEffect(() => {
    if (onServicesChange && typeof onServicesChange === 'function') {
      onServicesChange(services);
    }
  }, [services]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}  
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <DropDownPicker
            open={openCategory}
            value={valueCategory}
            items={items}
            setOpen={setOpenCategory}
            setValue={setValueCategory}
            setItems={() => {}}
            style={styles.dropdown}
            textStyle={styles.textStyle}
            dropDownContainerStyle={styles.dropdownContainer}
            ArrowUpIconComponent={() => <FontAwesomeIcon size={30} color={theme.primary} icon="fa-solid fa-caret-up" />}
            ArrowDownIconComponent={() => <FontAwesomeIcon size={30} color={theme.primary} icon="fa-solid fa-caret-down" />}
            TickIconComponent={() => <FontAwesomeIcon size={20} color={theme.primary} icon="fa-solid fa-check" />}
            zIndex={1000}
          />
          <DropDownPicker
            open={openOptions}
            value={valueOption}
            items={options}
            setOpen={setOpenOptions}
            setValue={setValueOption}
            setItems={() => {}}
            zIndex={500}
            style={styles.dropdown}
            textStyle={styles.textStyle}
            dropDownContainerStyle={styles.dropdownContainer}
            ArrowUpIconComponent={() => <FontAwesomeIcon size={30} color={theme.primary} icon="fa-solid fa-caret-up" />}
            ArrowDownIconComponent={() => <FontAwesomeIcon size={30} color={theme.primary} icon="fa-solid fa-caret-down" />}
            TickIconComponent={() => <FontAwesomeIcon size={20} color={theme.primary} icon="fa-solid fa-check" />}
          />
          {showTextInput && (
            <TextInput
              value={customText}
              onChangeText={setCustomText}
              placeholder="Enter custom service"
              style={Global.Input}
            />
          )}
          <View style={styles.btnContainer}>
          <PrimaryButton
            text="Add Service"
            onPress={handleAddService}
          />
          <PrimaryButton  
            text="Close"
            onPress={toggleModal}
          />
          </View>
          </View>
      </View>
    </Modal>
  );
};

const getStyles = (theme) => {
  return StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    height: '60%',
    width: '100%',
    backgroundColor: theme.background,
    borderRadius: 10,
    padding: 20,
    zIndex: 99,
    alignItems: 'center',
  },
  dropdown: {
    borderColor: theme.primary,
    borderradius:10,
    borderWidth: 2.5,
    zIndex: 99,
    marginVertical:10,
  },
  textStyle: {
    fontSize: 17,
  },
  dropdownContainer: {
    backgroundColor: theme.white,
    borderColor: theme.primary,
    borderWidth: 2.5,
  },
  btnContainer:{
    justifyContent:'center',
    alignItems:'center',
    gap: 10,
    position: 'absolute',
    bottom: 20,
    
  },
});
}

export default ServiceCategoryPicker;
