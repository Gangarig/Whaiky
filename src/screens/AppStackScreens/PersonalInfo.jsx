import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, SafeAreaView, TouchableOpacity, Modal } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import PhoneInput from 'react-native-phone-input';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import { ScrollView } from 'react-native';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Global } from '../../constant/Global';
import avatar from '../../assets/images/avatar/avatar.png';
import LocationPicker from '../AppStackScreens/service/LocationPicker';


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
  
      showMessage({
        message: 'Avatar updated successfully!' + error.message,
        type: 'success',
      });
    } catch (error) {
      showMessage({
        message: 'Error updating avatar: ' + error.message,
        type: 'danger',
      });
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

        showMessage({
          message: 'Information updated successfully!',
          type: 'success',
        });

      } catch (error) {
        showMessage({
          message: 'Error updating information: ' + error.message,
          type: 'danger',
        });
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
          <View style={styles.avatarBox}>
            <Image
              source={userInfo.photoURL && userInfo.photoURL !== 'null' && userInfo.photoURL !== ''
                ? { uri: userInfo.photoURL }
                : avatar }
              style={styles.avatar}
            />
            </View>
            <TouchableOpacity>
              <Button title="Change Avatar" onPress={handleAvatarChange} />
            </TouchableOpacity>
          <Text style={[Global.titleSecondary,styles.left]}>Full Name</Text>
          <TextInput
            placeholder="First Name"
            value={userInfo.firstName || ''}
            onChangeText={(text) => setUserInfo({ ...userInfo, firstName: text })}
            style={Global.input}
          />
          <TextInput
            placeholder="Last Name"
            value={userInfo.lastName || ''}
            onChangeText={(text) => setUserInfo({ ...userInfo, lastName: text })}
            style={Global.input}
          />
          <Text style={[Global.titleSecondary,styles.left]}>UserName</Text>
          <TextInput
            placeholder="User Name"
            value={userInfo.displayName || ''}
            onChangeText={(text) => setUserInfo({ ...userInfo, displayName: text })}
            style={Global.input}
          />
          <Text style={[Global.titleSecondary,styles.left]}>Email</Text>
          <TextInput
            placeholder="Email"
            value={userInfo.email || ''}
            editable={false}
            style={Global.input}
          />
          <Text style={[Global.titleSecondary,styles.left]}>Location</Text>
          {userLocation.country && userLocation.state && userLocation.city ? (
            <View style={styles.locationContainer}>
              <Text style={Global.text}>Country : {userLocation.country}</Text>
              <Text style={Global.text}>State : {userLocation.state}</Text>
              <Text style={Global.text}>City : {userLocation.city}</Text>
            </View>
          ) : (
            <Text style={Global.text}>N/A</Text>
          )}
          <Button title="Select Location" onPress={() => setLocationPickerVisible(true)} />
            

          {/* Location Picker Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={locationPickerVisible}
            onRequestClose={() => {
              setLocationPickerVisible(false);
            }}
          >
            <View style={styles.fullScreenModal}>
              <TouchableOpacity 
                style={styles.modalOverlay} 
                activeOpacity={1} 
                onPressOut={() => { setLocationPickerVisible(false); }}
              />
              <LocationPicker
                onSave={(selectedCountry, selectedState, selectedCity) => {
                  handleLocationSave(selectedCountry, selectedState, selectedCity);
                  setLocationPickerVisible(false); 
                }}
                onClose={() => setLocationPickerVisible(false)} 
              />
            </View>
          </Modal>

          <Text style={[Global.titleSecondary,styles.left]}>Phone Number</Text>
          {userInfo.phoneNumbers && userInfo.phoneNumbers.length > 0 ? (
            userInfo.phoneNumbers.map((phoneNumber, index) => (
              <View key={index} style={styles.phoneNumberContainer}>
                <Text style={Global.text}>{phoneNumber}</Text>
                  <Button title='Delete' onPress={()=>deletePhoneNumber(index)} style={Global.text}/>
              </View>
            ))
          ) : (
            <Text style={Global.text}>N/A</Text>
          )}

          <Button title="Add Phone Number" onPress={() => setPhoneInputModalVisible(true)} />
          <Modal
            animationType="slide"
            transparent={true}
            visible={phoneInputModalVisible}
            onRequestClose={() => {
              setPhoneInputModalVisible(false);
            }}
          >
            <View style={styles.fullScreenModal}>
              <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPressOut={() => { setPhoneInputModalVisible(false); }}
              />

              <View style={styles.modalContent}>
                <Text style={Global.titleSecondary}>Enter Phone Number</Text>
                <PhoneInput
                  ref={(ref) => { phoneInput = ref; }}
                  initialCountry="at"
                  value={newPhoneNumber}
                  onChangePhoneNumber={(text) => setNewPhoneNumber(text)}
                  style={Global.input}
                />
                <Button title="Add" onPress={addPhoneNumber} />
              </View>
              <Button title="Close" onPress={() => setPhoneInputModalVisible(false)} />
            </View>
          </Modal>
          
          <View style={[Global.row,Global.center]}>
          <Button title="Update Info" onPress={handleUpdate} />
          <Button title="Go back" onPress={() => navigation.goBack()} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  avatarBox: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
  },
  fullScreenModal: {
    flex: 1,
    justifyContent:'center',
    alignItems:'center',
    height: '100%',
    backgroundColor: '#FFF',
    paddingVertical: 50,
  },
  left:{
    alignSelf:'flex-start',
    paddingLeft:25,
  },
  phoneNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
    paddingHorizontal: 30,
  },
  locationContainer: {
    width: '100%',
    marginBottom: 10,
    paddingHorizontal: 30,
  },
});

export default PersonalInfo;
