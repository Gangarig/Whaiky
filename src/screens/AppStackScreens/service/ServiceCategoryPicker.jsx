import { View, Text, Button, TextInput, Alert, StyleSheet, Modal, FlatList } from 'react-native';
import React from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { useState, useEffect } from 'react';
import { showMessage } from 'react-native-flash-message';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../../context/AuthContext';
import { Global } from '../../../constant/Global';
import { categoriesData } from '../../../constant/dataStatic/categoriesData';
import Colors from '../../../constant/Colors';
import LinearGradient from 'react-native-linear-gradient';
import PrimaryButton from '../../../components/Buttons/PrimaryButton';
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
            style={styles.dropDown}
            zIndex={1000}
          />
          <DropDownPicker
            open={openOptions}
            value={valueOption}
            items={options}
            setOpen={setOpenOptions}
            setValue={setValueOption}
            setItems={() => {}}
            style={styles.dropDown}
            zIndex={500}
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

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    zIndex: 99,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dropDown: {
    marginBottom: 10,
  },
  serviceItem: {
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    width: '100%',
    height: 'fit-content',
  },
  btnContainer:{
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
});

export default ServiceCategoryPicker;
