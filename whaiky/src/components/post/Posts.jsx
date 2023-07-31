import React, { useContext, useState } from 'react';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
const Posts = () => {
  const { currentUser } = useContext(AuthContext);
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handlePost = async (e) => {
    e.preventDefault();
  
    // Validate the input field
    if (!text.trim()) {
      setError('Please enter a post before submitting.');
      return;
    }
  
    try {
      const postData = {
        text: text,
        posterId: currentUser.uid,
        date: new Date(),
        image: '',
      };
      const docRef = await addDoc(collection(db, 'posts'), postData);
      toast.success('Post added successfully');
      setText('');
      setError(''); 
    } catch (e) {
      toast.error(e.message);
    }
  };
  

  // Conditionally render the form based on the user's authentication status
  return (
    <div>
      {currentUser ? (
        <form action="">
          <input
            type="text"
            id="post"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button onClick={handlePost}>POST</button>
        </form>
      ) : (
        <p>Please log in to create a post.</p>
      )}
    </div>
  );
};

export default Posts;
