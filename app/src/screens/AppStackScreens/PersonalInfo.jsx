import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, SafeAreaView, TouchableOpacity, Modal } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import PhoneInput from 'react-native-phone-input';
import LocationPicker from '../../../service/LocationPicker';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import { ScrollView } from 'react-native';

const PersonalInfo = ({ navigation }) => {
  const { currentUser } = useAuth();
  const [userInfo, setUserInfo] = useState({});
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [phoneInputModalVisible, setPhoneInputModalVisible] = useState(false);
  const [locationPickerVisible, setLocationPickerVisible] = useState(false);
  const [userLocation, setUserLocation] = useState({
    country: '',
    state: '',
    city: ''
  });
  const [locationChanged, setLocationChanged] = useState(false);

  const fetchData = async () => {
    if (currentUser?.uid) {
      const userDocRef = firestore().collection('users').doc(currentUser.uid);
      const userDoc = await userDocRef.get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        setUserInfo(userData);
        setUserLocation({
          country: userData.country || '',
          state: userData.state || '',
          city: userData.city || ''
        });
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  const handleAvatarChange = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true
      });
  
      if (!image) {
        return;
      }
  
      const storageRef = storage().ref(`profile_images/${currentUser.uid}`);
      await storageRef.putFile(image.path);
      const downloadURL = await storageRef.getDownloadURL();
  
      await firestore().collection('users').doc(currentUser.uid).update({
        photoURL: downloadURL
      });
  
      setUserInfo(prevState => ({ ...prevState, photoURL: downloadURL }));
  
      alert('Avatar updated successfully!');
    } catch (error) {
      console.error("Error updating avatar:", error);
      alert('Error updating avatar: ' + error.message);
    }
  };

  const handleLocationSave = (selectedCountry, selectedState, selectedCity) => {
    if (
      selectedCountry !== userLocation.country ||
      selectedState !== userLocation.state ||
      selectedCity !== userLocation.city
    ) {
      setLocationChanged(true);
    }
    
    setUserLocation({
      country: selectedCountry,
      state: selectedState,
      city: selectedCity
    });
  };

  const handleUpdate = async () => {
    if (currentUser?.uid) {
      try {
        const updatedUserData = {
          firstName: userInfo.firstName || null,
          lastName: userInfo.lastName || null,
          displayName: userInfo.displayName || null,
          phoneNumbers: userInfo.phoneNumbers || null,
        };
        
        if (locationChanged) {
          updatedUserData.country = userLocation.country || null;
          updatedUserData.state = userLocation.state || null;
          updatedUserData.city = userLocation.city || null;
        }

        await firestore().collection('users').doc(currentUser.uid).update(updatedUserData);

        alert('Information updated successfully!');
      } catch (error) {
        alert('Error updating information: ' + error.message);
      }
    }
  };

  const addPhoneNumber = () => {
    if (newPhoneNumber) {
      setUserInfo(prevState => ({
        ...prevState,
        phoneNumbers: [...(prevState.phoneNumbers || []), newPhoneNumber]
      }));
      setNewPhoneNumber('');
      setPhoneInputModalVisible(false);
    }
  };

  const deletePhoneNumber = (index) => {
    Alert.alert(
      'Delete Phone Number',
      'Are you sure you want to delete this phone number?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            const phoneNumbersCopy = [...userInfo.phoneNumbers];
            phoneNumbersCopy.splice(index, 1);
            setUserInfo({ ...userInfo, phoneNumbers: phoneNumbersCopy });
          },
          style: 'destructive',
        },
      ],
      { cancelable: false },
    );
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <Image
            source={userInfo.photoURL && userInfo.photoURL !== 'null' && userInfo.photoURL !== ''
              ? { uri: userInfo.photoURL }
              : require('../../../assets/images/avatar/avatar.png')}
            style={styles.avatar}
          />
          <TouchableOpacity>
            <Button title="Change Avatar" onPress={handleAvatarChange} />
          </TouchableOpacity>
          <TextInput
            placeholder="First Name"
            value={userInfo.firstName || ''}
            onChangeText={(text) => setUserInfo({ ...userInfo, firstName: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Last Name"
            value={userInfo.lastName || ''}
            onChangeText={(text) => setUserInfo({ ...userInfo, lastName: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="User Name"
            value={userInfo.displayName || ''}
            onChangeText={(text) => setUserInfo({ ...userInfo, displayName: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            value={userInfo.email || ''}
            editable={false}
            style={styles.input}
          />
          <View style={styles.locationContainer}>
            {locationChanged && (
              <View>
                <Text>Country: {userLocation.country}</Text>
                <Text>State: {userLocation.state}</Text>
                <Text>City: {userLocation.city}</Text>
              </View>
            )}
            <Button title="Change Location" onPress={() => setLocationPickerVisible(true)} />
          </View>
          {userInfo.phoneNumbers && userInfo.phoneNumbers.map((phoneNumber, index) => (
            <View key={index} style={styles.phoneNumberContainer}>
              <Text>{phoneNumber}</Text>
              <Button title="Delete" onPress={() => deletePhoneNumber(index)} color="red" />
            </View>
          ))}
          <Button title="Add Phone Number" onPress={() => setPhoneInputModalVisible(true)} />
          <Button title="Update Info" onPress={handleUpdate} />
          <Button title="Go back" onPress={() => navigation.goBack()} />
        </View>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={phoneInputModalVisible}
        onRequestClose={() => setPhoneInputModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <PhoneInput
              value={newPhoneNumber}
              default={newPhoneNumber}
              onChangePhoneNumber={setNewPhoneNumber}
            />
            <Button title="Confirm" onPress={addPhoneNumber} />
            <Button title="Cancel" onPress={() => setPhoneInputModalVisible(false)} color="red" />
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={locationPickerVisible}
        onRequestClose={() => setLocationPickerVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <LocationPicker onSave={handleLocationSave} onClose={() => setLocationPickerVisible(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
  },
  locationContainer: {
    marginBottom: 16,
  },
  phoneNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    flex: 0.6,
    flexDirection: 'column',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default PersonalInfo;
