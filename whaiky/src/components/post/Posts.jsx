import React, { useContext, useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../../firebase'; // Update with your Firebase import path
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './posts.scss';

const Posts = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    // Check if user is logged in before fetching data
    if (!currentUser) {
      return; // If not logged in, no need to fetch data
    }

    // Create a reference to the "posts" collection
    const postsRef = collection(db, 'posts');

    // Fetch the data from the "posts" collection
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(postsRef);
        const fetchedPosts = [];

        querySnapshot.forEach((doc) => {
          // Get data from each document and push it to the array
          const post = { id: doc.id, ...doc.data() };
          fetchedPosts.push(post);
        });

        // Update the state with fetched posts
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchData();
  }, [currentUser]); // Run this effect whenever currentUser changes

  const handleDeleteConfirmation = (post) => {
    setPostToDelete(post);
    setShowDeleteConfirmation(true);
  };

  const handleDelete = async () => {
    if (postToDelete) {
      try {
        await deleteDoc(doc(db, 'posts', postToDelete.id));
        // Fetch updated data after deletion
        const updatedPosts = posts.filter((post) => post.id !== postToDelete.id);
        setPosts(updatedPosts);
      } catch (error) {
        console.error('Error deleting post:', error);
      }
      setShowDeleteConfirmation(false);
      setPostToDelete(null);
    }
  };

  const handleSelect = async (user) => {
    // Check whether the group (chats in Firestore) exists, if not create
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, 'chats', combinedId));

      if (!res.exists()) {
        // Create a chat in chats collection
        await setDoc(doc(db, 'chats', combinedId), { messages: [] });
  
        // Create user chats
        await updateDoc(doc(db, 'userChats', currentUser.uid), {
          [combinedId + '.userInfo']: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + '.date']: serverTimestamp(),
        });

        await updateDoc(doc(db, 'userChats', user.uid), {
          [combinedId + '.userInfo']: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + '.date']: serverTimestamp(),
        });
      }
    } catch (err) {}

    // Clear the user data after use
    navigate('/chat');
    setUser(null);
  };

  const createConnection = async (post) => {
    const q = query(
      collection(db, 'users'),
      where('uid', '==', post.ownerId)
    );
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const user = doc.data();
        handleSelect(user); // Pass the user data directly to handleSelect
      });
    } catch (err) {
      setErr(true);
      console.log(err);
    }
  };

 
  // Render the posts only if the user is logged in
  return currentUser ? (
    <>
      {posts.map((post) => (
        <div key={post.id} className='post-card'>
          <div className="post-title-wrapper">
            <span className='post-title-text'>{post.title}</span>
          </div>
          <div className="post-price-wrapper">
            <span className='post-price-text'>Price: {post.price}</span>
          </div>
          <img className='post-img' src={post.imageURL} alt={`Post: ${post.title}`} />
        </div>
      ))}
      </>
  ) : null; // If not logged in, render nothing
};

export default Posts;
