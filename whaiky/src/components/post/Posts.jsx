import React, { useContext, useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../../firebase'; // Update with your Firebase import path
import { AuthContext } from '../../context/AuthContext';
import { useNavigate , Link } from 'react-router-dom';
import './posts.scss';

const Posts = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    const postsRef = collection(db, 'posts');

    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(postsRef);
        const fetchedPosts = [];

        querySnapshot.forEach((doc) => {
          const post = { id: doc.id, ...doc.data() };
          fetchedPosts.push(post);
        });

        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchData();
  }, [currentUser]);

  const handleDeleteConfirmation = (post) => {
    setPostToDelete(post);
    setShowDeleteConfirmation(true);
  };

  const handleDelete = async () => {
    if (postToDelete) {
      try {
        await deleteDoc(doc(db, 'posts', postToDelete.id));
        const updatedPosts = posts.filter((post) => post.id !== postToDelete.id);
        setPosts(updatedPosts);
      } catch (error) {
        console.error('Error deleting post:', error);
      }
      setShowDeleteConfirmation(false);
      setPostToDelete(null);
    }
  };

  return currentUser ? (
    <>
      {posts.map((post) => (
        <Link to={`/post-detail/${post.id}`} key={post.id}>
          <div className='post-card'>
            <div className="post-title-wrapper">
              <span className='post-title-text'>{post.title}</span>
            </div>
            <div className="post-price-wrapper">
              <span className='post-price-text'>Price: {post.price}</span>
            </div>
            <img className='post-img' src={post.imageURL} alt={`Post: ${post.title}`} />
          </div>
        </Link>
      ))}
    </>
  ) : null;
};

export default Posts;
