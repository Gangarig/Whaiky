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
              <label htmlFor='postTitle'>Title</label>
              <input
                className='postTitleInput'
                type='text'
                name='postTitle'
                id='postTitle'
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
              />
            </div>
            <div className='postCategory'>
              <label htmlFor='postCategory'>Choose category</label>
              <select
                id='categorySelect'
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="Home Improvement">Home Improvement</option>
                <option value="Cleaning Services">Cleaning Services</option>
                <option value="HVAC Services">HVAC Services</option>
                <option value="Painting Services">Painting Services</option>
                <option value="Electrical Services">Electrical Services</option>
                <option value="Water Heater Services">Water Heater Services</option>
                <option value="Plumbing Services">Plumbing Services</option>
                <option value="Moving Services">Moving Services</option>
                <option value="category9">Landscaping Services</option>
                <option value="category10">General Services</option>
              </select>
            </div>
            <div className='postDesc'>
              <label htmlFor='postDesc'>Description</label>
              <textarea
                name='postDesc'
                id='postDesc'
                cols='30'
                rows='10'
                value={postDesc}
                onChange={(e) => setPostDesc(e.target.value)}
              ></textarea>
            </div>
            <div className='postPrice'>
              <label htmlFor='postPrice'>Price</label>
              <input
                type='number'
                name='postPrice'
                id='postPrice'
                value={postPrice}
                onChange={(e) => setPostPrice(e.target.value)}
              />
            </div>
            <div className='postImg'>
              <label htmlFor='postImg'>Please Upload photos</label>
              <input type='file' name='postImg' id='postImg' onChange={handleImageChange} />
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
