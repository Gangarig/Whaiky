import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useTheme } from '../../../../context/ThemeContext';
import ServiceCategoryPicker from '../../service/ServiceCategoryPicker';
import PrimaryButton from '../../../../components/Buttons/PrimaryButton';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import Fonts from '../../../../constant/Fonts';
import { BlurView } from '@react-native-community/blur';

const ServiceCategory = ({ navigation }) => {
  const { currentUser } = useAuth();
  const [services, setServices] = useState([]);
  const [isPickerModalVisible, setPickerModalVisible] = useState(false);
  const [isModalBackgroundVisible, setModalBackgroundVisible] = useState(false);
  const [userData, setUserData] = useState({});
  const theme = useTheme();
  const styles = getStyles(theme);
  const [blur, setBlur] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      showMessage({
        message: 'No user is signed in',
        type: 'warning',
      });
      return;
    }

    const subscriber = firestore()
      .collection('users')
      .doc(currentUser.uid)
      .onSnapshot(documentSnapshot => {
        setServices(documentSnapshot.data().services || []);
      });

    const unsubscribe = firestore()
      .collection('users')
      .doc(currentUser.uid)
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data());
        }
      }, error => {
        console.log('Error:', error);
        showMessage({
          message: 'Error fetching user data.',
          type: 'danger',
        });
      });

    // Unsubscribe from events when no longer in use
    return () => {
      subscriber();
      unsubscribe();
    };
  }, [currentUser]);

  const togglePickerModal = () => {
    setBlur(!blur);
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

  const categoryIcons = {
    1: 'fa-solid fa-house',
    2: 'fa-solid fa-fire',
    3: 'fa-solid fa-bolt',
    4: 'fa-solid fa-droplet-slash',
    5: 'fa-solid fa-droplet-slash',
    6: 'fa-solid fa-spray-can-sparkles',
    7: 'fa-solid fa-paint-roller',
    8: 'fa-solid fa-temperature-arrow-up',
    9: 'fa-solid fa-truck',
    10: 'fa-solid fa-screwdriver-wrench',
  };

  return (
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.ScrollView}
      >
            {blur && (
                <BlurView
                style={styles.blur}
                blurType="light"
                blurAmount={2}
                reducedTransparencyFallbackColor="white"
                />
            )}
          <Text style={styles.title}>Select Your Categories</Text>
          <ServiceCategoryPicker 
            modalVisible={isPickerModalVisible} 
            toggleModal={togglePickerModal}
          />
          {services.map((service, index) => (
            <View key={index} style={styles.serviceContainer}>
              <FontAwesomeIcon size={40} style={[]} color={theme.primary}
                icon={categoryIcons[service.categoryId]}
              />
              <View style={styles.textWrapper}>
                <Text style={styles.categoryText}>{service.categoryText}</Text>
                <Text style={styles.optionText}>{service.optionText}</Text>
              </View>
              <TouchableOpacity onPress={() => handleDeleteService(service)}>
              <FontAwesomeIcon size={40} style={[]} color={theme.primary} icon={faTrashCan}/>
              </TouchableOpacity>
            </View>
          ))}
          {services.length === 0 && (
            <Text style={styles.title}>No services found</Text>
          )  
          }
          <View style={styles.btnContainer}>
            <PrimaryButton
            text="Add Service"
            onPress={togglePickerModal}
            style={{marginTop: 20}}
          />
          {currentUser.status === 'contractor' ?
          null:(
          <PrimaryButton 
            text="Continue" 
            onPress={handleSaveAndContinue} 
            style={styles.saveButton}
          />
          )}
          </View>
      </ScrollView>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.background,
    flex: 1,
  },
  ScrollView: {
    width: '100%',  
    paddingVertical: 20,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 16,
  },
  serviceContainer: {
    backgroundColor: theme.background,
    borderWidth: 1,
    borderColor: theme.primary,
    borderRadius: 12,
    overflow: 'hidden',
    height: 80,
    paddingHorizontal: 10,
    marginBottom: 16,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textWrapper: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 1,
    paddingLeft: 20,
  },
  categoryText: {
    color: theme.text,
    fontSize: 14,
    fontFamily: Fonts.primary,
    marginBottom: 6,
    fontWeight: 'bold',
  },
  optionText: {
    color: theme.text,
    fontSize: 12,
    fontFamily: Fonts.primary,
    
  },
  btnContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  blur: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: "absolute",
    height: "110%",
    width: "110%",
    zIndex: 10,
  }
  
});

export default ServiceCategory;



