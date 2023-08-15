import React, { useContext, useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from "../../firebase";
import { v4 as uuid } from "uuid";
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { categoriesData } from './categoriesData';
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
 

  const handleCategoryChange = (event) => {
    setSelectedCategoryId(event.target.value);
    setSelectedOptionId(''); // Reset the option selection when changing the category
  };
  const handleOptionChange = (event) => {
    setSelectedOptionId(event.target.value);
  };

  const handleImageChange = (event) => {
    setPostImg(event.target.files[0]);
  };
  const handleDivClick = (e) => {
    const fileInput = document.getElementById('postImgInput');
    if (e.target !== fileInput) {
        fileInput.click();
    }
  };

  const isValidForm = () => {
    if (!postTitle || !postDesc || !postPrice || !postImg || !selectedCategoryId || !selectedOptionId || !city || !zipCode) {
      toast.error('Please fill in all the fields before submitting.');
      return false;
    }

    return true;
  };
  const handlePriceChange = (e) => {
    const value = e.target.value;
    // Use regex to test if the value is only numeric
    if (/^[0-9]*$/.test(value)) {
      setPostPrice(value);
    } else {
      e.target.value = postPrice;
    }
  };
  

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
    currentUser && ( // Only render the form if the user is logged in
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
        <label htmlFor='postDesc'>3. Description ( Choose a short and meaningful headline )</label>
        <textarea name='postDesc' value={postDesc} onChange={(e) => setPostDesc(e.target.value)}></textarea>

        <label htmlFor='postPrice'>4. Price</label>
        <input type='text' name='postPrice' value={postPrice} onChange={handlePriceChange} />



        <label htmlFor='cityInput'>City</label>
        <input type='text' name='city' id='cityInput' value={city} onChange={(e) => setCity(e.target.value)} placeholder='Enter city' />

        <label htmlFor='zipCodeInput'>Zip Code</label>
        <input type='text' name='zipCode' id='zipCodeInput' value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder='Enter zip code' />


        <div className='file-upload-label'>
          <label htmlFor='postImgInput'>5. Please Upload photos</label>
          <span className='info-text-2'> please add detailed pic etc </span>
        </div>
        <div className='file-upload'>
        <span className='file-upload-text'>Upload Photos</span>
        <input type='file' name='postImg' onChange={handleImageChange} />
        </div>
        <button className='custom-button' type='submit'>CONTINUE</button>
      </form>
    )
  );
};

export default AddPost;

