import React, { useContext, useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from "../../firebase";
import { v4 as uuid } from "uuid";
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import './addPost.scss';

const AddPost = () => {
  const { currentUser } = useContext(AuthContext);
  const [postTitle, setPostTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [postDesc, setPostDesc] = useState('');
  const [postPrice, setPostPrice] = useState('');
  const [postImg, setPostImg] = useState(null);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
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

  const handlePost = async (e) => {
    e.preventDefault();

    if (!postTitle || !selectedCategory || !postDesc || !postPrice || !postImg) {
      toast.error('Please fill in all the fields before submitting.');
      return;
    }

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
              
              title: postTitle,
              category: selectedCategory,
              description: postDesc,
              price: postPrice,
              imageURL: downloadURL,
              createdAt: serverTimestamp(),
            };

            await addDoc(postsRef, postData);

            toast.success('Post added successfully');

            setPostTitle('');
            setSelectedCategory('');
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
    <div className='postFormContainer'>
      <div className='postFormWrapper'>
        {currentUser && ( // Only render the form if the user is logged in
          <form className='postForm' onSubmit={handlePost}>

            <div className='postTitle'>
              
              <label htmlFor='postTitleText'>Title</label>
              <div className='gradient-title-border-wrapper'>
              <input
                className='postTitleInput gradient-input'
                type='text'
                name='postTitle'
                id='postTitle'
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
              />
              </div>
            </div>
            <div className='postCategory'>
              <label htmlFor='postCategory'>Choose category</label>
              <div className='border-category-wrapper'>
              <select
                id='categorySelect'
                value={selectedCategory}
                onChange={handleCategoryChange}
                className='categorySelectBox border-category'
              >
                <option className='categoryOption' value="Home Improvement">Home Improvement</option>
                <option className='categoryOption' value="Cleaning Services">Cleaning Services</option>
                <option className='categoryOption' value="HVAC Services">HVAC Services</option>
                <option className='categoryOption' value="Painting Services">Painting Services</option>
                <option className='categoryOption' value="Electrical Services">Electrical Services</option>
                <option className='categoryOption' value="Water Heater Services">Water Heater Services</option>
                <option className='categoryOption' value="Plumbing Services">Plumbing Services</option>
                <option className='categoryOption' value="Moving Services">Moving Services</option>
                <option className='categoryOption' value="category9">Landscaping Services</option>
                <option className='categoryOption' value="category10">General Services</option>
              </select>
              </div>
            </div>
            <div className='postDesc'>
              <label htmlFor='postDesc'>Description</label>
              <div className='border-desc-wrapper'>
              <textarea
                name='postDesc'
                className='postDescInput border-desc'
                id='postDesc'
                cols='30'
                rows='10'
                value={postDesc}
                onChange={(e) => setPostDesc(e.target.value)}
              ></textarea>
              </div>
            </div>
            <div className='postPrice'>
              <label htmlFor='postPrice'>Price</label>
              <div className='border-postPrice-wrapper'>
              <input
                type='number'
                name='postPrice'
                id='postPrice'
                className='postPriceInput border-postPrice'
                value={postPrice}
                onChange={(e) => setPostPrice(e.target.value)}
              />
              </div>
            </div>
            <div className='gradient-border-img-wrapper'>
              <div className='postImgwrapper' onClick={handleDivClick}>
                <label className='postImgLabel' htmlFor='postImgInput'>
                  Upload Photos
                </label>
                <input className='fileInput' type='file' name='postImg' id='postImgInput' onChange={handleImageChange} />
              </div>
            </div>






            <button className='postBtn' type='submit'>
              Post
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddPost;
