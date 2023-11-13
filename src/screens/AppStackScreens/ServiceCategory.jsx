import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, SafeAreaView, StyleSheet, Alert } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import ServiceCategoryPicker from '../../screens/AppStackScreens/service/ServiceCategoryPicker';


const ServiceCategory = ({ navigation }) => {
  const { currentUser } = useAuth();
  const [services, setServices] = useState([]);
  const [isPickerModalVisible, setPickerModalVisible] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const subscriber = firestore()
        .collection('users')
        .doc(currentUser.uid)
        .onSnapshot(documentSnapshot => {
          setServices(documentSnapshot.data().services || []);
        });

      // Unsubscribe from events when no longer in use
      return () => subscriber();
    } else {
      showMessage({
        message: 'No user is signed in',
        type: 'warning',
      });
    }
  }, [currentUser]);

  const togglePickerModal = () => {
    setPickerModalVisible(prevVisible => !prevVisible);
  };

  const handleDeleteService = (service) => {
    Alert.alert(
      "Delete Service",
      "Are you sure you want to delete this service?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => deleteService(service) }
      ]
    );
  };

  const deleteService = (serviceToDelete) => {
    // First, update the local state
    setServices(prevServices => 
      prevServices.filter(service => service.categoryId !== serviceToDelete.categoryId)
    );
  
    // Then, create a reference to the user's document
    const userDocRef = firestore().collection('users').doc(currentUser.uid);
  
    // Remove the service from the user's document in Firestore
    userDocRef.update({
      services: firestore.FieldValue.arrayRemove({
        categoryId: serviceToDelete.categoryId,
        categoryText: serviceToDelete.categoryText,
        optionId: serviceToDelete.optionId,
        optionText: serviceToDelete.optionText,
      })
    })
    .then(() => {
      showMessage({
        message: "Service deleted successfully.",
        type: "success",
      });
    })
    .catch(error => {
      console.error("Error removing service from Firestore: ", error);
      showMessage({
        message: "Error deleting service. Please try again later.",
        type: "danger",
      });
    });
  };

  const handleSaveAndContinue = () => {
    if (services.length === 0) {
      showMessage({
        message: "Please select at least one service before continuing.",
        type: "danger",
      });
      return;
    }

    // Navigate to the next screen if there are selected services
    navigation.navigate('DocumentUpload');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>Service Information</Text>
        <Button title="Choose a Category" onPress={togglePickerModal} />
        <ServiceCategoryPicker 
          modalVisible={isPickerModalVisible} 
          toggleModal={togglePickerModal} 
          // other necessary props 
        />

        {services.map((service, index) => (
          <View key={index} style={styles.serviceContainer}>
            <Text style={styles.categoryText}>{service.categoryText}</Text>
            <Text style={styles.optionText}>{service.optionText}</Text>
            <Button title="Delete" onPress={() => handleDeleteService(service)} />
          </View>
        ))}

        <Button title="Save and Continue" onPress={handleSaveAndContinue} />
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scrollViewContent: {
    alignItems: 'center', // Center the services vertically
  },
  serviceContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
  },
  categoryText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionText: {
    fontSize: 16,
  },
});

export default ServiceCategory;
