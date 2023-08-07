import React, { useContext, useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from 'firebase/firestore';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { db } from '../firebase';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { currentUser, userData } = useContext(AuthContext);

  const [country, setCountry] = useState(userData?.country || '');
  const [region, setRegion] = useState(userData?.region || '');
  const [firstName, setFirstName] = useState(userData?.firstName || '');
  const [lastName, setLastName] = useState(userData?.lastName || '');
  const [displayName, setUsername] = useState(userData?.displayName || '');
  const [phone, setPhone] = useState(userData?.phone || '');
  const [email, setEmail] = useState(userData?.email || '');
  const [photoURL, setImgUrl] = useState(userData?.photoURL || '');

  const updateUserProfile = async () => {
    // Prepare updated data
    const updatedData = {
      country,
      region,
      firstName,
      lastName,
      displayName,
      phone,
      email,
      photoURL,
    };

    // Update Firestore document with updated data
    try {
      const userDocRef = doc(db, 'users', userData.uid);
      await updateDoc(userDocRef, updatedData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Error updating profile');
    }
  };

  return (
    <>
      <Navbar />
      <div className='paddingFromNav'>
        <button onClick={updateUserProfile}>Save Changes</button>
        <h1>Profile Page</h1>
        <input
          type='text'
          placeholder='First name'
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type='text'
          placeholder='Last name'
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <CountryDropdown value={country} onChange={(val) => setCountry(val)} />
        <RegionDropdown country={country} value={region} onChange={(val) => setRegion(val)} />
        <input
          type='text'
          placeholder='Username'
          value={displayName}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type='text'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type='text'
          placeholder='Image URL'
          value={photoURL}
          onChange={(e) => setImgUrl(e.target.value)}
        />
        <PhoneInput country={'us'} value={phone} onChange={(phone) => setPhone(phone)} />
      </div>
    </>
  );
};

export default ProfilePage;
