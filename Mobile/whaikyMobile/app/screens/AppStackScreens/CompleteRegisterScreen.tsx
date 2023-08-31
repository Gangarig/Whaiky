// CompleteRegisterScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet,Image } from 'react-native';
import { useUser } from '../../context/UserContext';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { firestore , storage } from '../../../FirebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';


const CompleteRegisterScreen = () =>{
  const { currentUser, setCurrentUser } = useUser();
  const [email, setEmail] = useState<string>(currentUser?.email || '');
  const [phone, setPhone] = useState<string>(currentUser?.phone || '');
  const [country, setCountry] = useState<string>(currentUser?.country || '');
  const [region, setRegion] = useState<string>(currentUser?.region || '');
  const [firstName, setFirstName] = useState<string>(currentUser?.firstName || '');
  const [lastName, setLastName] = useState<string>(currentUser?.lastName || '');
  const [userName, setUserName] = useState<string>(currentUser?.userName || '');
  const [avatarURL , setAvatarURL] = useState<string>(currentUser?.avatarURL || 'https://firebasestorage.googleapis.com/v0/b/whaiky-1.appspot.com/o/profile_images%2Fdefault_avatar.png?alt=media&token=3b5b5b1e-5b0a-4b0a-8b0a-5b0a4b0a8b0a');


  useEffect(() => {
    const fetchData = async () => {
      if (currentUser?.uid) {
        const userDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setEmail(userData?.email || '');
          setPhone(userData?.phone || '');
          setCountry(userData?.country || '');
          setRegion(userData?.region || '');
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
      // Update Firestore
      await setDoc(doc(firestore, 'users', currentUser.uid), {
        email,
        phone,
        country,
        region,
        firstName,
        lastName,
        userName,
        photoURL: avatarURL as string,  // Changed from phoroURL to photoURL
      }, { merge: true });
  
      // Update context
      setCurrentUser(prevUser => ({
        ...prevUser!,
        email,
        phone,
        country,
        region,
        firstName,
        lastName,
        userName,
        avatarURL,
      }));
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
  
      // Delete old avatar from Firebase Storage
      if (avatarURL && avatarURL !== 'your_default_avatar_url') {
        // Extract old image name from avatarURL
        const decodedUrl = decodeURIComponent(avatarURL);
        const oldImageName = decodedUrl.split('/').slice(-1)[0].split('?')[0];
        const oldStorageRef = ref(storage, `profile_images/${oldImageName}`);
        deleteObject(oldStorageRef).catch((error) => {
          console.error('Failed to delete old avatar:', error);
        });
      }
  
      // Upload new avatar
      await uploadBytesResumable(newStorageRef, blob).then(() => {
        return getDownloadURL(newStorageRef);
      }).then(async (downloadURL) => {
        await setDoc(doc(firestore, 'users', currentUser.uid!), {
          photoURL: downloadURL as string,
        }, { merge: true });
  
        // Update context and local state
        setCurrentUser(prevUser => ({
          ...prevUser!,
          photoURL: downloadURL,
        }));
        setAvatarURL(downloadURL as string);
      });
    }
  };
  

  return (
    <View style={styles.container}>
      <Text>Complete Register Screen</Text>
      <TextInput
        style={styles.input}
        value={email}
        placeholder="Email"
        onChangeText={text => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        value={phone}
        placeholder="Phone"
        onChangeText={text => setPhone(text)}
      />
      <TextInput
        style={styles.input}
        value={country}
        placeholder="Country"
        onChangeText={text => setCountry(text)}
      />
      <TextInput
        style={styles.input}
        value={region}
        placeholder="Region"
        onChangeText={text => setRegion(text)}
      />
      <TextInput
        style={styles.input}
        value={firstName}
        placeholder="First Name"
        onChangeText={text => setFirstName(text)}
      />
      <TextInput
        style={styles.input}
        value={lastName}
        placeholder="Last Name"
        onChangeText={text => setLastName(text)}
      />
      <TextInput
        style={styles.input}
        value={userName}
        placeholder="User Name"
        onChangeText={text => setUserName(text)}
      />
      {avatarURL ? <Image source={{ uri: avatarURL }} style={{ width: 100, height: 100 }} /> : null}
      <Button title="Change Avatar" onPress={pickImage} />  
      <Button title="Complete Register" onPress={handleCompleteRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: 300,
    height: 40,
    borderWidth: 1,
    borderColor: 'grey',
    marginBottom: 10,
    paddingHorizontal: 8,
  },
});

export default CompleteRegisterScreen;
