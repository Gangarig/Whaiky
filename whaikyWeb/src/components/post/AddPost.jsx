import React, { useContext, useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from "../../firebase";
import { v4 as uuid } from "uuid";
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { categoriesData } from './categoriesData';
import { getDownloadURL, ref, uploadBytesResumable, deleteObject } from "firebase/storage";

import './addPost.scss';

const AddPost = () => {
  const { currentUser } = useContext(AuthContext);
  const [postTitle, setPostTitle] = useState('');
  const [postDesc, setPostDesc] = useState('');
  const [postPrice, setPostPrice] = useState('');
  const [postImg, setPostImg] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [city, setCity] = useState('');  
  const [zipCode, setZipCode] = useState('');  
  const [uploadedImgURL, setUploadedImgURL] = useState(null);

  // Handle category change
  const handleCategoryChange = (event) => {
    setSelectedCategoryId(event.target.value);
    setSelectedOptionId('');
  };

  // Handle option change within a category
  const handleOptionChange = (event) => {
    setSelectedOptionId(event.target.value);
  };

  // Extract the relative file path from the uploadedImgURL for deletion
  const extractFilePath = (url) => {
    const urlParts = url.split('/o/');
    if (urlParts.length !== 2) return null;
    return decodeURIComponent(urlParts[1].split('?')[0]);
  };

  // Delete the existing image in Firebase storage
  const deleteExistingImage = async () => {
    if (uploadedImgURL) {
        const filePath = extractFilePath(uploadedImgURL);
        if (filePath) {
            const storageRefToDelete = ref(storage, filePath);
            await deleteObject(storageRefToDelete);
            setUploadedImgURL(null);
            setPostImg(null);
        }
    }
  };

  // Handle image selection or change
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
        await deleteExistingImage();
        const newImgRef = ref(storage, `images/${uuid()}_${file.name}`);
        const snapshot = await uploadBytesResumable(newImgRef, file);
        const newImgURL = await getDownloadURL(snapshot.ref);
        setPostImg(file);
        setUploadedImgURL(newImgURL);
    }
  };
  const handleImageChangeButton = async (e) => {
    e.preventDefault();  // Prevent default to ensure the form doesn't submit

    // Delete the existing image if any
    await deleteExistingImage();

    // Trigger the file input for a new image
    const fileInput = document.getElementById('postImgInput');
    if (fileInput) {  // Ensure fileInput is not null
      fileInput.click();
    } else {
      console.warn('File input element not found!');
    }
  };

  // Helper function to trigger file input click
  const handleDivClick = (e) => {
    const fileInput = document.getElementById('postImgInput');
    if (e.target !== fileInput) {
        fileInput.click();
    }
  };

  // Validation for form fields
  const isValidForm = () => {
    if (!postTitle || !postDesc || !postPrice || !postImg || !selectedCategoryId || !selectedOptionId || !city || !zipCode) {
      toast.error('Please fill in all the fields before submitting.');
      return false;
    }
    return true;
  };

  // Handle numeric input for price
  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (/^[0-9]*$/.test(value)) {
      setPostPrice(value);
    } else {
      e.target.value = postPrice;
    }
  };

  // Handle post submission
  const handlePost = async (e) => {
    e.preventDefault();
    if (!isValidForm()) return;
    try {
      const storageRef = ref(storage, `images/${uuid()}_${postImg.name}`);
      const uploadTask = uploadBytesResumable(storageRef, postImg);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Handle upload progress if needed
        },
        (error) => {
          toast.error('Error uploading image');
          console.error('Error uploading image:', error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            const postsRef = collection(db, 'posts');
            const postId = uuid(); 
            const postData = {
              postId,
              ownerId: currentUser.uid,
              ownerName: currentUser.displayName,
              ownerAvatar: currentUser.photoURL,
              categoryId: selectedCategoryId,
              optionId: selectedOptionId,
              title: postTitle,
              description: postDesc,
              price: postPrice,
              imageURL: downloadURL,
              city: city,
              zipCode: zipCode,
              createdAt: serverTimestamp(),
            };
            await addDoc(postsRef, postData);
            toast.success('Post added successfully');
            setCity('');
            setZipCode('');
            setSelectedCategoryId('');
            setSelectedOptionId('');
            setPostTitle('');
            setPostDesc('');
            setPostPrice('');
            setPostImg(null);
            setUploadedImgURL(null);
          } catch (error) {
            toast.error('Error adding post');
            console.error('Error adding post:', error);
          }
        }
      );
    } catch (error) {
      toast.error('Error uploading image');
      console.error('Error uploading image:', error);
    }
  };
  return (
    currentUser && (
      // The form for adding posts
      <div className="add-post-wrapper">
      <form className='add-post-form' onSubmit={handlePost}>
        <label htmlFor='postTitleText'>1. Title <span className='info-text'>( Choose a short and meaningful headline )</span></label>
        <input type='text' name='postTitle' value={postTitle} onChange={(e) => setPostTitle(e.target.value)} />
        <label htmlFor='postCategory'>2. Choose category <span className='info-text'>( Choose a short and meaningful headline )</span></label>
        <div className='postCategory'>
          <select
            id='categorySelect'
            value={selectedCategoryId}
            onChange={handleCategoryChange}
          >
            {categoriesData.map(category => (
              <option key={category.id} value={category.id}>{category.text}</option>
            ))}
          </select>
        </div>

        {selectedCategoryId && (
          <div className='postOption'>
            <select
              id='optionSelect'
              value={selectedOptionId}
              onChange={handleOptionChange}
            >
              {
                categoriesData.find(cat => cat.id === parseInt(selectedCategoryId)).options.map(option => (
                  <option key={option.optionId} value={option.optionId}>{option.text}</option>
                ))
              }
            </select>
          </div>
        )}
        <label htmlFor='postDesc'>3. Description <span className='info-text'> ( Choose a short and meaningful headline )</span></label>
        <textarea name='postDesc' value={postDesc} onChange={(e) => setPostDesc(e.target.value)}></textarea>

        <label htmlFor='postPrice'>4. Price <span className='info-text'> ( Choose a short and meaningful headline )</span></label>
        <input type='text' name='postPrice' value={postPrice} onChange={handlePriceChange} />



        <label htmlFor='cityInput'>City</label>
        <input type='text' name='city' id='cityInput' value={city} onChange={(e) => setCity(e.target.value)} placeholder='Enter city' />

        <label htmlFor='zipCodeInput'>Zip Code</label>
        <input type='text' name='zipCode' id='zipCodeInput' value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder='Enter zip code' />

        <div className='file-upload-label'>
            <label htmlFor='postImgInput'>5. Please Upload photo <br /> <span className='info-text'> ( Choose a short and meaningful headline )</span></label>
            <span className='info-text-2'> please add detailed pic etc </span>
          </div>

          <div className='file-upload' onClick={handleDivClick}>
          <input type='file' id='postImgInput' className='file-upload-button' name='postImg' onChange={handleImageChange} />
            
            {uploadedImgURL ? (
              <img src={uploadedImgURL} alt="Uploaded Preview" className="uploaded-image-preview" />
            ) : (
              <>
                <span className='file-upload-text'>Upload Photos</span>
                
              </>
            )}
          </div>

          {uploadedImgURL && (
            <button 
              onClick={handleImageChangeButton} 
              className='custom-button'
            >
                Change
            </button>
          )}

          <button className='custom-button' type='submit'>CONTINUE</button>
        </form>
      </div>
    )
  );
};

export default AddPost;

