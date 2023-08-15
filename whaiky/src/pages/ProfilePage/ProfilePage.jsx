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

  console.log(photoURL);
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

  const uploadImage = async () => {
    if (!selectedImage) return null;

    const imageRef = ref(storage, `profile_images/${currentUser.uid}_${selectedImage.name}`);
    const uploadTask = uploadBytesResumable(imageRef, selectedImage);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Handle progress here if needed
        },
        (error) => {
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  };
  const deleteExistingImage = async (url) => {
    try {
      const imageRef = ref(storage, url); // Create a reference from a gs:// or https:// URL
      await deleteObject(imageRef);
    } catch (error) {
      console.error('Error deleting old image:', error);
    }
  };

  const updateUserProfile = async () => {
    try {
      let updatedImageURL = photoURL;

      if (selectedImage) {
        // Delete old image from storage if it exists
        if (photoURL) {
          await deleteExistingImage(photoURL);
        }

        // Upload new image
        updatedImageURL = await uploadImage();
        if (updatedImageURL) setImgUrl(updatedImageURL);
      }

      const updatedData = {
        country,
        region,
        firstName,
        lastName,
        displayName,
        phone,
        email,
        photoURL: updatedImageURL,
      };

      const userDocRef = doc(db, 'users', userData.uid);
      await updateDoc(userDocRef, updatedData);

      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Error updating profile');
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
                {/* Displaying the Avatar */}
                {photoURL ? (
          <>
            <img src={photoURL} alt="User Avatar" className="user-avatar" />
            <label htmlFor="avatar-input">Change Avatar</label>
          </>
        ) : (
          <label htmlFor="avatar-input">Upload Avatar</label>
        )}
        
        <input 
          type='file' 
          id="avatar-input"
          onChange={handleImageSelection}
          style={{ display: photoURL ? 'none' : 'block' }} 
        />
        <PhoneInput country={'us'} value={phone} onChange={(phone) => setPhone(phone)} />
      </div>
    </>
  );
};

export default ProfilePage;
