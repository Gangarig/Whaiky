import React from 'react';
import { View, Text, Button, ScrollView, SafeAreaView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import ServiceCategoryPicker from '../../../service/ServiceCategoryPicker';
import { categoriesData } from '../../dataStatic/categoriesData';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import firestore from '@react-native-firebase/firestore';
const Legalinfo = ({ navigation }) => {
  const { currentUser } = useAuth();
  const [ Category, setCategory ] = useState([]);
  const [ Option, setOption ] = useState([]);
  const [services, setServices] = useState([]);
  const [isPickerModalVisible, setPickerModalVisible] = useState(false);

  const togglePickerModal = () => {
    setPickerModalVisible(prevVisible => !prevVisible);
  };

  const handleServicesUpdate = (updatedServices) => {
    setServices(updatedServices);
  };

  
  const handleSave = () => {
    // Ensure there is a current user before proceeding
    if (!currentUser || !currentUser.uid) {
      console.error("No user found. Cannot save to Firestore.");
      alert("Error saving data. Please log in again.");
      return;
    }
  
    // Prepare the data for Firestore
    const servicesData = services.map(s => ({
      CategoryId: s.categoryId,
      Category: s.categoryText,
      OptionId: s.optionId,
      Option: s.optionText,
    }));
  
    // Save to Firestore
    firestore()
      .collection('users')
      .doc(currentUser.uid)
      .set({ services: servicesData }, { merge: true })
      .then(() => {
        alert('Info saved successfully!');
      })
      .catch(error => {
        console.error("Error saving to Firestore:", error);
        alert("Error saving data. Please try again later.");
      });
  };
  
const handleSaveAndContinue = () => {
  handleSave();
  navigation.navigate('DocumentUpload');
};

return (
  <SafeAreaView style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ padding: 16 }}>
        <Text>Legalinfo</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
        {/* 2. Trigger button to show modal */}
        <Button title="Select Services" onPress={togglePickerModal} />
        {/* 3. Pass modalVisible and toggle function as props */}
        <ServiceCategoryPicker 
          onServicesChange={handleServicesUpdate} 
          modalVisible={isPickerModalVisible} 
          toggleModal={togglePickerModal} 
        />
                  {/* Selected Services List Display */}
                  <View style={{ marginTop: 20 }}>
            <Text>Selected Services:</Text>
            {services.map((service, index) => (
              <View key={index} style={{ flexDirection: 'row', marginVertical: 5 }}>
                <Text>
                  Category Id: {service.categoryId},
                  Category Text: {service.categoryText},
                  Option Id: {service.optionId || 'N/A'},
                  Option Text: {service.optionText}
                </Text>
              </View>
            ))}
          </View>
        <Button title="Save and Continue" onPress={handleSaveAndContinue}/>
      </View>
    </ScrollView>
  </SafeAreaView>
);
};

export default Legalinfo;
