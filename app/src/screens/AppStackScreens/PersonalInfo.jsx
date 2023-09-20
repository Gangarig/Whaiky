import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, SafeAreaView, TouchableOpacity, Alert, Modal } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import PhoneInput from 'react-native-phone-input';

const PersonalInfo = ({ navigation }) => {
  const { currentUser } = useAuth();
  const [userInfo, setUserInfo] = useState({});
  const [newPhoneNumber, setNewPhoneNumber] = useState(1);
  const [phoneInputModalVisible, setPhoneInputModalVisible] = useState(false);

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
        <Image source={{ uri: userInfo.photoURL || '' }} style={{ width: 100, height: 100 }} />
        <TouchableOpacity>
          <Text>Change Avatar</Text>
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

export default PersonalInfo;
