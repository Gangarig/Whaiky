import { View, Text, Button, TextInput, Alert, StyleSheet ,Modal} from 'react-native';
import React from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { useState, useEffect } from 'react';
import { categoriesData } from '../src/dataStatic/categoriesData';

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
    console.log("Category value changed to:", valueCategory);
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
      setServices(prev => {
        const optionTextValue = valueCategory === 11 ? customText : getOptionTextById(valueOption);
        const newServices = [
          ...prev,
          {
            categoryId: valueCategory,
            categoryText: getCategoryTextById(valueCategory),
            optionId: valueOption,
            optionText: optionTextValue
          }
        ];
        console.log("Services after addition:", newServices);
        return newServices;
      });
      setValueCategory(null);
      setValueOption(null);
      setCustomText('');
    } else {
      console.warn("Cannot add service. Category or option missing.");
    }
};


  useEffect(() => {
    if (onServicesChange && typeof onServicesChange === 'function') {
      console.log("Services updated and sending to parent:", services);
      onServicesChange(services);
    }
  }, [services]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}  // Use the prop for modal visibility
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
              style={styles.textInput}
            />
          )}
  
          <Button title="Add Another Service" onPress={handleAddService} />
  
          <View style={styles.servicesContainer}>
            <Text>Selected Services:</Text>
            {services.map((service, index) => (
              <View key={index} style={styles.serviceItem}>
                <Text style={styles.serviceText}>
                  Category Id: {service.categoryId}, 
                  Category Text: {service.categoryText}, 
                  Option Id: {service.optionId || 'N/A'}, 
                  Option Text: {service.optionText}
                </Text>
                <Button title="-" onPress={() => handleDeleteService(index)} />
              </View>
            ))}
          </View>
  
          {/* Use the toggleModal prop to close the modal */}
          <Button title="Close" onPress={toggleModal} />
        </View>
      </View>
    </Modal>
);
            };

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  dropDown: {
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  servicesContainer: {
    marginTop: 20,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  serviceText: {
    flex: 1,
    marginRight: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // This makes the background gray
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  }
});

export default ServiceCategoryPicker;
