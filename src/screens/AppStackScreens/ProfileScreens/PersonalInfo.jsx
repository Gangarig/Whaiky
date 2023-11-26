import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, SafeAreaView, TouchableOpacity, Modal } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import PhoneInput from 'react-native-phone-input';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import { ScrollView } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { Alert } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { Global } from '../../../constant/Global';
import avatar from '../../../assets/images/avatar/avatar.png';
import LocationPicker from '../../AppStackScreens/service/LocationPicker';
import { shadowStyle } from '../../../constant/Shadow';
import PrimaryButton from '../../../components/Buttons/PrimaryButton';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../../constant/Colors';
import BackButton from '../../../components/Buttons/BackButton';


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
      <ScrollView style={styles.container} >
        <View>
          <BackButton onPress={() => navigation.goBack()} />
        </View>
          <LinearGradient
            colors={['#9E41F0', '#4C7BC0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.profileContainer]}
          >
        <View >
          <View style={styles.avatarBox}>
            <Image
              source={userInfo.photoURL && userInfo.photoURL !== 'null' && userInfo.photoURL !== ''
                ? { uri: userInfo.photoURL }
                : avatar }
              style={styles.avatar}
            />
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
            style={styles.input}
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
        </View>
        </LinearGradient>
        <PrimaryButton text="Save" onPress={handleUpdate} />
        <PrimaryButton text="Change Avatar" onPress={handleAvatarChange} />
        <PrimaryButton text="Add Phone Number" onPress={() => setPhoneInputModalVisible(true)} />
        <PrimaryButton text="Change Location" onPress={() => setLocationPickerVisible(true)} />
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 30,
    gap: 10,
    flex: 1,
    width: '100%',
    ...shadowStyle
  },
  profileContainer: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  avatar: {
    width: 114,
    height: 119,
    borderWidth: 2,
    borderColor: Colors.white,
    borderRadius: 100,
  },
  input: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  nameText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: Colors.white,
    paddingBottom: 10,
  },
  infoWrapper: {
    width: '100%',
    gap: 5,
    paddingBottom: 80,
  },
  infoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
  },
});

export default PersonalInfo;
