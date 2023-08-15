import React, { useContext, useState, useEffect } from 'react';
import Navbar from '../../components/navbar/Navbar';
import { AuthContext } from '../../context/AuthContext';
import { collection, query, where, getDocs, updateDoc, doc , getDoc} from 'firebase/firestore';
import { storage } from '../../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { db } from '../../firebase';
import { toast } from 'react-toastify';
import { getMetadata } from 'firebase/storage';
import { deleteObject } from 'firebase/storage';
import './ProfilePage.scss';

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
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnapshot = await getDoc(userDocRef);
  
          if (userDocSnapshot.exists()) {
              const fullUserData = userDocSnapshot.data();
              setCountry(fullUserData.country || '');
              setRegion(fullUserData.region || '');
              setFirstName(fullUserData.firstName || '');
              setLastName(fullUserData.lastName || '');
              setUsername(fullUserData.displayName || '');
              setPhone(fullUserData.phone || '');
              setEmail(fullUserData.email || '');
              setImgUrl(fullUserData.photoURL || '');
          } else {
              console.error("No user data found in Firestore for the given UID");
          }
      } catch (error) {
          console.error("Error fetching user data from Firestore:", error);
      }
  };

    fetchUserData();
}, [currentUser.uid, db]);


const handleImageSelection = (e) => {
  const file = e.target.files[0];
  if (file) setSelectedImage(file);
};



const handleAvatarChange = async () => {
  if (!selectedImage) return;

  try {
    if (photoURL) {
      await deleteExistingImage();
    }

    const imageRef = ref(
      storage,
      `profile_images/${currentUser.uid}_${selectedImage.name}`
    );
    const uploadTask = uploadBytesResumable(imageRef, selectedImage);

    await uploadTask; // Wait for the upload to complete

    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

    // Update user's photoURL in Firebase Authentication
    await updateProfile(currentUser, {
      photoURL: downloadURL,
    });

    // Update userType in the context
    updateUserType('newUserTypeHere'); // Replace with the actual new user type

    setImgUrl(downloadURL); // Update photoURL state to re-render the avatar

    toast.success('Avatar updated successfully!');
  } catch (error) {
    toast.error('Error updating avatar.');
  }
};


const deleteExistingImage = async () => {
  if (!photoURL) return;

  try {
    const imageRef = ref(storage, photoURL);

    // Check if the image exists before attempting to delete it
    try {
      const imageMetadata = await getMetadata(imageRef);
      if (imageMetadata) {
        await deleteObject(imageRef);
        console.log('Old image deleted successfully:', photoURL);
      } else {
        console.log('Old image not found. Skipping deletion.');
      }
    } catch (error) {
      console.error('Error getting image metadata:', error);
    }
  } catch (error) {
    console.error('Error deleting old image:', error);
    throw error;
  }
};



const updateUserProfile = async () => {
  try {
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

    const userDocRef = doc(db, 'users', currentUser.uid); // Use currentUser.uid
    await updateDoc(userDocRef, updatedData);
    toast.success('Profile updated successfully!');
  } catch (error) {
    toast.error('Error updating profile.');
  }
};

return (
      <>
      <div className='profile-wrapper'>
        <button onClick={updateUserProfile}>Save Changes</button>
        <h1>Profile Page</h1>
        <input type='text' placeholder='First name' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <input type='text' placeholder='Last name' value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <CountryDropdown value={country} onChange={(val) => setCountry(val)} />
        <RegionDropdown country={country} value={region} onChange={(val) => setRegion(val)} />
        <input type='text' placeholder='Username' value={displayName} onChange={(e) => setUsername(e.target.value)} />
        <input type='text' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
        {photoURL && (
          <img src={photoURL} alt="User Avatar" className="user-avatar" />
        )}

        <label htmlFor="avatar-input">
          {photoURL ? 'Change Avatar' : 'Upload Avatar'}
        </label>
        <input 
          type='file' 
          id="avatar-input"
          onChange={handleImageSelection}
        />
        {selectedImage && (
          <button onClick={handleAvatarChange}>Update Avatar</button>
        )}
        <PhoneInput country={'us'} value={phone} onChange={(phone) => setPhone(phone)} />
      </div>
    </>
  );
};

export default ProfilePage;
