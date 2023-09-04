import React, { useState, useEffect, FC, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../../context/UserContext';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { firestore, storage } from '../../../FirebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import PhoneInputComponent from './components/PhoneInputComponent';
import CountryStateCity from './components/CountryStateCity';

const CompleteRegisterScreen: FC = () => {
  const { currentUser, setCurrentUser } = useUser();
  const [email, setEmail] = useState<string>(currentUser?.email || '');
  const [city, setCity] = useState<string>(currentUser?.city || '');
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>(currentUser?.country);
  const [firstName, setFirstName] = useState<string>(currentUser?.firstName || '');
  const [lastName, setLastName] = useState<string>(currentUser?.lastName || '');
  const [userName, setUserName] = useState<string>(currentUser?.userName || '');
  const [avatarURL, setAvatarURL] = useState<string>(currentUser?.avatarURL || '');
  const [phones, setPhones] = useState<string[]>(currentUser?.phones || []);
  const [locationVisible, setLocationVisible] = useState(false);
  const phoneInputRef = useRef<{ getValue: () => string } | null>(null);

  const handleCountryChange = (newCountry: string) => {
    setSelectedCountry(newCountry);
  };

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
  }

  const addPhoneNumber = () => {
    const newPhone = phoneInputRef.current?.getValue();
    if (newPhone && phones.length < 3) {
      setPhones([...phones, newPhone]);
    }
  };

  const deletePhoneNumber = (index: number) => {
    const updatedPhones = [...phones];
    updatedPhones.splice(index, 1);
    setPhones(updatedPhones);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser?.uid) {
        const userDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setEmail(userData?.email || '');
          setPhones(userData?.phones || []);
          setSelectedCountry(userData?.country || '');
          setCity(userData?.city || '');
          setFirstName(userData?.firstName || '');
          setLastName(userData?.lastName || '');
          setUserName(userData?.userName || '');

          setAvatarURL(userData?.photoURL || '');
        }
      }
    };

    fetchData();
  }, [currentUser]);

  const handleCompleteRegister = async () => {
    if (currentUser?.uid) {
      const updatedData = {
        email,
        country: selectedCountry || '',
        city,
        firstName,
        lastName,
        userName,
        photoURL: avatarURL,
        phones,
      };

      try {
        await setDoc(doc(firestore, 'users', currentUser.uid), updatedData, { merge: true });

        const allFieldsFilled = Object.values(updatedData).every(value => Boolean(value));

        const personalInfoStatus = allFieldsFilled ? 'completed' : 'incomplete';

        await setDoc(doc(firestore, 'users', currentUser.uid), { personalInfo: personalInfoStatus }, { merge: true });

        setCurrentUser(prevUser => ({
          ...prevUser!,
          ...updatedData,
          personalInfo: personalInfoStatus,
        }));
      } catch (error) {
        console.error("Failed to update user data in Firestore:", error);
      }
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = (result as any).uri;
      updateAvatar(uri);
    }
  };

  const updateAvatar = async (uri: string) => {
    const imageData = await fetch(uri);
    const blob = await imageData.blob();

    if (currentUser?.uid && userName) {
      const imageName = `${userName}_${new Date().toISOString()}`;
      const newStorageRef = ref(storage, `profile_images/${imageName}`);

      if (avatarURL && avatarURL !== 'your_default_avatar_url') {
        const decodedUrl = decodeURIComponent(avatarURL);
        const oldImageName = decodedUrl.split('/').slice(-1)[0].split('?')[0];
        const oldStorageRef = ref(storage, `profile_images/${oldImageName}`);
        deleteObject(oldStorageRef).catch((error) => {
          console.error('Failed to delete old avatar:', error);
        });
      }

      await uploadBytesResumable(newStorageRef, blob).then(() => {
        return getDownloadURL(newStorageRef);
      }).then(async (downloadURL) => {
        await setDoc(doc(firestore, 'users', currentUser.uid!), {
          photoURL: downloadURL as string,
        }, { merge: true });

        setCurrentUser(prevUser => ({
          ...prevUser!,
          photoURL: downloadURL,
        }));
        setAvatarURL(downloadURL as string);
      });
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.title}>Complete Register Screen</Text>

        <TextInput
          style={styles.input}
          value={email}
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
        />

        {locationVisible ? (
          <CountryStateCity
            onCountryChange={handleCountryChange} // Pass the function to handle country change
          />
        ) : (
          <View>
            <Text>Country: {selectedCountry}</Text>
            {city ? <Text>City: {city}</Text> : null} {/* Display city if there is a value */}
            <TouchableOpacity onPress={() => setLocationVisible(true)}>
              <Text>Change Location</Text>
            </TouchableOpacity>
          </View>
        )}

        <TextInput
          style={styles.input}
          value={firstName}
          placeholder="First Name"
          onChangeText={(text) => setFirstName(text)}
        />
        <TextInput
          style={styles.input}
          value={lastName}
          placeholder="Last Name"
          onChangeText={(text) => setLastName(text)}
        />
        <TextInput
          style={styles.input}
          value={userName}
          placeholder="User Name"
          onChangeText={(text) => setUserName(text)}
        />

        <View style={styles.phoneContainer}>
          <PhoneInputComponent ref={phoneInputRef} />
          <TouchableOpacity onPress={addPhoneNumber}>
            <Text>Add Phone Number</Text>
          </TouchableOpacity>
        </View>

        {phones.map((phone, index) => (
          <View key={index} style={styles.phoneListContainer}>
            <Text>{phone}</Text>
            <TouchableOpacity onPress={() => deletePhoneNumber(index)}>
              <Text style={{ color: 'red' }}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}

        {avatarURL ? <Image source={{ uri: avatarURL }} style={styles.avatar} /> : null}

        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Change Avatar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleCompleteRegister}>
          <Text style={styles.buttonText}>Complete Register</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    width: '90%',
    height: 40,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 16,
  },
  phoneContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginBottom: 16,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007BFF',
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  phoneListContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginBottom: 8,
  },
});

export default CompleteRegisterScreen;
