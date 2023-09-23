import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image,StyleSheet ,SafeAreaView, TouchableOpacity, Alert, Modal } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import PhoneInput from 'react-native-phone-input';
import LocationPicker from '../../../service/LocationPicker';
import { ScrollView } from 'react-native';
import { ChangeAvatar } from '../../../service/UpdateAvatar';
import { UpdateAvatar } from '../../../service/UpdateAvatar';

const PersonalInfo = ({ navigation }) => {
  const { currentUser } = useAuth();
  const [userInfo, setUserInfo] = useState({});
  const [newPhoneNumber, setNewPhoneNumber] = useState(1);
  const [phoneInputModalVisible, setPhoneInputModalVisible] = useState(false);
  const [locationPickerVisible, setLocationPickerVisible] = useState(false);
  const [userLocation, setUserLocation] = useState({
    country: '',
    state: '',
    city: ''
  });
  const ChangeAvatar = () => {
    UpdateAvatar(currentUser, setUserInfo);
  }
  
  useEffect(() => {
    const fetchData = async () => {
      if (currentUser?.uid) {
        const userDocRef = firestore().collection('users').doc(currentUser.uid);
        const userDoc = await userDocRef.get();

        if (userDoc.exists) {
          setUserInfo(userDoc.data());
        }
      }
    };

    fetchData();
  }, [currentUser]);
  const handleLocationSave = (selectedCountry, selectedState, selectedCity) => {
    setUserLocation({
      country: selectedCountry,
      state: selectedState,
      city: selectedCity
    });
  };

  const handleUpdate = async () => {
    if (currentUser?.uid) {
      try {
        await firestore().collection('users').doc(currentUser.uid).set(userInfo, { merge: true });
        alert('Information updated successfully!');
      } catch (error) {
        alert('Error updating information: ', error.message);
      }
    }
  };

  const addPhoneNumber = () => {
    if (newPhoneNumber) {
      setUserInfo(prevState => ({
        ...prevState,
        phoneNumbers: [...(prevState.phoneNumbers || []), newPhoneNumber]
      }));
      setNewPhoneNumber('');  // Reset new phone number input
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
      <View>
        <Image 
          source={userInfo.photoURL && userInfo.photoURL !== 'null' && userInfo.photoURL !== '' 
            ? { uri: userInfo.photoURL } 
            : require('../../../assets/images/avatar/avatar.png')} 
          style={{ width: 100, height: 100 }} 
        />
        <TouchableOpacity>
         <Button title="Change Avatar" onPress={ChangeAvatar} />
        </TouchableOpacity>
        <TextInput
          placeholder="First Name"
          value={userInfo.firstName || ''}
          onChangeText={(text) => setUserInfo({ ...userInfo, firstName: text })}
        />
        <TextInput
          placeholder="Last Name"
          value={userInfo.lastName || ''}
          onChangeText={(text) => setUserInfo({ ...userInfo, lastName: text })}
        />
        <TextInput
          placeholder="User Name"
          value={userInfo.displayName || ''}
          onChangeText={(text) => setUserInfo({ ...userInfo, displayName: text })}
        />
        <TextInput
          placeholder="Email"
          value={userInfo.email || ''}
          editable={false} // Making the email field non-editable
        />
        <Button title="Pick Location" onPress={() => setLocationPickerVisible(true)} />
        <Modal
          animationType="slide"
          transparent={true}
          visible={locationPickerVisible}
          onRequestClose={() => setLocationPickerVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <LocationPicker onSave={handleLocationSave} onClose={() => setLocationPickerVisible(false)} />
            </View>
          </View>
        </Modal>

                
        {userInfo.phoneNumbers && userInfo.phoneNumbers.map((phoneNumber, index) => (
          <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
            <Text>{phoneNumber}</Text>
            <Button title="Delete" onPress={() => deletePhoneNumber(index)} color="red" />
          </View>
        ))}

        <Button title="Add Phone Number" onPress={() => setPhoneInputModalVisible(true)} />
        

        
        <Modal
          animationType="slide"
          transparent={true}
          visible={phoneInputModalVisible}
          onRequestClose={() => setPhoneInputModalVisible(false)}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: '80%', padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
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

        <Button title="Update Info" onPress={handleUpdate} />
        <Button title="Go back" onPress={() => navigation.goBack()} />
      </View>

    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  // ... other styles ...

  modalBackground: {
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
    elevation: 5, // Optional, for shadow on Android
    shadowColor: '#000', // Optional, for shadow on iOS
    shadowOffset: { width: 0, height: 2 }, // Optional, for shadow on iOS
    shadowOpacity: 0.25, // Optional, for shadow on iOS
    shadowRadius: 4, // Optional, for shadow on iOS
  },
});

export default PersonalInfo;
