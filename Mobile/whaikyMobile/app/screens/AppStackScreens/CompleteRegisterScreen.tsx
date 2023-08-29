import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';

interface CurrentUser {
  userName?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  country?: string;
  region?: string;
  avatar?: string; // Assuming this is a URL
  uid?: string;
}

// Define the shape of the context returned from useCurrentUser
interface UserContextType {
  // Add other properties and methods you might have in your context
  currentUser: CurrentUser;
}

const useCurrentUser = () => {
  // Dummy implementation. Replace with your actual implementation
  return {
    currentUser: {},
  } as UserContextType;
};

const CompleteRegisterScreen: React.FC = () => {
  const { currentUser } = useCurrentUser();

  const [userName, setUserName] = useState<string>(currentUser?.userName || '');
  const [email, setEmail] = useState<string>(currentUser?.email || '');
  const [firstName, setFirstName] = useState<string>(currentUser?.firstName || '');
  const [lastName, setLastName] = useState<string>(currentUser?.lastName || '');
  const [phone, setPhone] = useState<string>(currentUser?.phone || '');
  const [country, setCountry] = useState<string>(currentUser?.country || '');
  const [region, setRegion] = useState<string>(currentUser?.region || '');
  const [avatar, setAvatar] = useState<string>(currentUser?.avatar || ''); // Assume this is a URL
  const [uid, setUid] = useState<string>(currentUser?.uid || '');

  const handleCompleteRegistration = () => {
    // TODO: Handle the completion of registration.
    // You may want to update the user's profile in your database here.
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Complete Register</Text>

      {avatar ? <Image source={{ uri: avatar }} style={{ width: 100, height: 100 }} /> : null}

      <TextInput
        placeholder="Username"
        value={userName}
        onChangeText={setUserName}
      />
      
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      
      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />

      <TextInput
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
      />
      
      {/* TODO: Add pickers for country and region */}
      <TextInput
        placeholder="Country"
        value={country}
        onChangeText={setCountry}
      />

      <TextInput
        placeholder="Region"
        value={region}
        onChangeText={setRegion}
      />
      
      <Text>UID: {uid}</Text>

      <TouchableOpacity onPress={handleCompleteRegistration}>
        <Text>Complete Registration</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CompleteRegisterScreen;
