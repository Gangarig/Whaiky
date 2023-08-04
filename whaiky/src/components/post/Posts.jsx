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
} from 'firebase/firestore';
import { db, storage } from '../../firebase';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Posts = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

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

  const createConnection = async (post) => {
    try {
      // Check if the user is the post owner
      if (post.ownerId === currentUser.uid) {
        console.log("You cannot create a connection with yourself.");
        return;
      }

      // Proceed with creating connections
      const combinedId =
        currentUser.uid > post.ownerId
          ? currentUser.uid + post.ownerId
          : post.ownerId + currentUser.uid;

      try {
        const res = await getDoc(doc(db, 'chats', combinedId));

        if (!res.exists()) {
          // Create a chat in chats collection
          await setDoc(doc(db, 'chats', combinedId), { messages: [] });

          // Create user chats for the current user
          await updateDoc(doc(db, 'userChats', currentUser.uid), {
            [combinedId + '.userInfo']: {
              uid: post.ownerId,
              displayName: post.ownerName,
              // Assuming you have ownerName in the post
              // You might need to fetch this information from Firestore if it's not in the post
            },
            [combinedId + '.date']: serverTimestamp(),
          });
          // Create user chats for the post owner user
          await updateDoc(doc(db, 'userChats', currentUser.uid), {
            [combinedId + '.userInfo']: {
              uid: currentUser.uid,
              displayName: currentUser.displayName,
              
              // Assuming you have ownerName in the post
              // You might need to fetch this information from Firestore if it's not in the post
            },
            [combinedId + '.date']: serverTimestamp(),
          });

          
        }
      } catch (err) {
        console.error('Error creating chat:', err);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // Render the posts only if the user is logged in
  return currentUser ? (
    <div className='postContainer'>
      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>Category: {post.category}</p>
          <p>Description: {post.description}</p>
          <p>Price: {post.price}</p>
          <p>ownerID: {post.ownerId}</p>
          <button onClick={() => createConnection(post)}>Contact {post.ownerName}</button>
          <p>postID: {post.id}</p>
          <img src={post.imageURL} alt={`Post: ${post.title}`} />

          {post.ownerId === currentUser.uid && (
            <button onClick={() => handleDeleteConfirmation(post)}>Delete</button>
          )}
        </div>
      ))}
      {showDeleteConfirmation && (
        <div className='deleteConfirmation'>
          <p>Are you sure you want to delete this post?</p>
          <button onClick={handleDelete}>Yes</button>
          <button onClick={() => setShowDeleteConfirmation(false)}>No</button>
        </div>
      )}
    </div>
  ) : null; // If not logged in, render nothing
};

export default Posts;
