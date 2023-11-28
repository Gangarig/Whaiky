import React, { useState, useEffect,useRef } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, SafeAreaView, TouchableOpacity, Modal } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import PhoneInput from 'react-native-phone-input';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import { ScrollView } from 'react-native';
import  { showMessage } from 'react-native-flash-message';
import { Alert } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { Global } from '../../../constant/Global';
import LocationPicker from '../../AppStackScreens/service/LocationPicker';
import FastImage from 'react-native-fast-image';
import avatar from '../../../assets/images/avatar/avatar.png';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Colors from '../../../constant/Colors';
import { shadowStyle } from '../../../constant/Shadow';
import PrimaryButton from '../../../components/Buttons/PrimaryButton';
import BottomSheet from '@gorhom/bottom-sheet';




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
  const [bottomSheetIndex, setBottomSheetIndex] = useState(-1); 
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const bottomSheetRef = useRef(null);
  const toggleBottomSheet = () => {
    setBottomSheetIndex(prevIndex => (prevIndex === -1 ? 1 : -1)); 
  };
  const closeBottomSheet = () => {
    setBottomSheetIndex(-1);
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
      <ScrollView style={{flex:1}}>
        <View style={styles.container}>
          <View style={styles.avatarBox}>
            <FastImage
              source={userInfo.photoURL && userInfo.photoURL !== 'null' && userInfo.photoURL !== ''
                ? { uri: userInfo.photoURL }
                : avatar }
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.camera} onPress={handleAvatarChange}>
              <FontAwesomeIcon size={24} icon="fa-solid fa-camera" /> 
            </TouchableOpacity>
          </View>

          <Text style={[Global.titleSecondary,styles.left]}>Full Name</Text>
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
          <Text style={[Global.titleSecondary,styles.left]}>UserName</Text>
          <TextInput
            placeholder="User Name"
            value={userInfo.displayName || ''}
            onChangeText={(text) => setUserInfo({ ...userInfo, displayName: text })}
            style={styles.input}
          />
          <Text style={[Global.titleSecondary,styles.left]}>Email</Text>
          <TextInput
            placeholder="Email"
            value={userInfo.email || ''}
            editable={false}
            style={[styles.input]}
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
          <PrimaryButton text="Select Location" onPress={() => setLocationPickerVisible(true)} />
          <PrimaryButton text={isSheetOpen ? "Close Bottom Sheet" : "Open Bottom Sheet"} onPress={toggleBottomSheet} />


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
                <FontAwesomeIcon size={24} color='red' style={[shadowStyle]} icon="fa-solid fa-minus" />
              </View>
            ))
          ) : (
            <Text style={Global.text}>N/A</Text>
          )}

          <PrimaryButton text="Add Phone Number" onPress={() => setPhoneInputModalVisible(true)} />
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

              <View style={styles.modalPhone}>
                <Text style={Global.titleSecondary}>Enter Phone Number</Text>
                <PhoneInput
                  ref={(ref) => { phoneInput = ref; }}
                  initialCountry="at"
                  value={newPhoneNumber}
                  onChangePhoneNumber={(text) => setNewPhoneNumber(text)}
                  style={styles.input}
                />
                <Button title="Add" onPress={addPhoneNumber} />
              </View>
              <Button title="Close" onPress={() => setPhoneInputModalVisible(false)} />
            </View>
          </Modal>

          <BottomSheet
          ref={bottomSheetRef}
          index={bottomSheetIndex}
          snapPoints={['10%', '50%']}
          onChange={index => setBottomSheetIndex(index)}
        >
          <View style={styles.contentContainer}>
            <Text>Bottom Sheet Content Here</Text>
            <Button title="Close" onPress={closeBottomSheet} />
          </View>
        </BottomSheet>
             <PrimaryButton text="Save" onPress={handleUpdate} />
        </View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 100,
    backgroundColor:Colors.background,

  },
  avatar: {
    width: 114,
    height: 119,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 100,
    position:'relative',

  },
  camera:{
    position:'absolute',
    bottom:0,
    right:0,
    backgroundColor:Colors.background,
    borderWidth:2,
    borderColor:Colors.primary,
    borderRadius:100,
    padding:5,
    zIndex:999,
    ...shadowStyle,
  },
  input: {
    width: 300,
    height: 34,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#FBFBFB",
    shadowColor: "rgba(105, 105, 105, 0.5)",
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: 4,
    shadowOpacity: 1,
    elevation: 2,
  },
  left:{
    alignSelf:'flex-start',
    paddingLeft:25,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily:'Montserrat-Medium',
  },
  fullScreenModal: {
    justifyContent:'center',
    alignItems:'center',
    height: 450,
    width: '100%',
    paddingHorizontal: 30,
    paddingVertical: 10,
    backgroundColor: Colors.background,
    bottom: 0,
    position: 'absolute',
    ...shadowStyle,
    borderTopColor: '#696969',
    borderTopWidth: 2,
  },
  modalPhone:{
    gap : 20,
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
    borderTopColor: '#696969',
    borderBottomColor: '#696969',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    width: '85%',
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

});

export default PersonalInfo;