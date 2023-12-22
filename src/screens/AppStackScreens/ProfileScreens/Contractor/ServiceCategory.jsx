import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, TouchableOpacity, StyleSheet, Alert, Touchable } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../../../context/AuthContext';
import ServiceCategoryPicker from '../../service/ServiceCategoryPicker';
import { Global } from '../../../../constant/Global';
import Colors from '../../../../constant/Colors';
import LinearGradient from 'react-native-linear-gradient';
import PrimaryButton from '../../../../components/Buttons/PrimaryButton';
import GradientButton from '../../../../components/GradientButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { shadowStyle } from '../../../../constant/Shadow';


const ServiceCategory = ({ navigation }) => {
  const { currentUser } = useAuth();
  const [services, setServices] = useState([]);
  const [isPickerModalVisible, setPickerModalVisible] = useState(false);
  const [isModalBackgroundVisible, setModalBackgroundVisible] = useState(false);
  

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
    setModalBackgroundVisible(prevVisible => !prevVisible); 
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


      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.ScrollView}
      >
        {isModalBackgroundVisible && (
          <View style={styles.modalBackground} />
        )}
        <LinearGradient
            colors={['#9E41F0', '#4C7BC0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.content}
          >
          <Text style={styles.title}>Select Your Categories</Text>
          <ServiceCategoryPicker 
            modalVisible={isPickerModalVisible} 
            toggleModal={togglePickerModal}
          />
          {services.map((service, index) => (
            <View key={index} style={styles.serviceContainer}>
              <View style={styles.textWrapper}>
                <Text style={styles.categoryText}>{service.categoryText}</Text>
                <Text style={styles.optionText}>{service.optionText}</Text>
              </View>
              <TouchableOpacity onPress={() => handleDeleteService(service)}>
              <FontAwesomeIcon size={25} style={[]} color={Colors.primary} icon="fa-solid fa-trash" />
              </TouchableOpacity>
            </View>
          ))}
          </LinearGradient>
          <View style={styles.btnContainer}>
            <PrimaryButton
            text="Add Service"
            onPress={togglePickerModal}
            style={{marginTop: 20}}
          />
          <PrimaryButton 
            text="Save" 
            onPress={handleSaveAndContinue} 
            style={styles.saveButton}
          />
          </View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1,
    width: '100%',
    paddingVertical: 20,

  },
  ScrollView: {
    flexGrow: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    gap: 20,
    paddingBottom: 100,
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex:9 // 50% opacity black
  },
  content:{
    backgroundColor: 'transparent',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    width: '90%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
  },
  btnContainer:{
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textWrapper: {
    width: '80%',
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
