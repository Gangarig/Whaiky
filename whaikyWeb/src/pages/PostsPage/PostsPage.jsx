import React, { useContext, useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom'; // Import Link and useParams
import Search from '../../components/search/Search';
import Navbar from '../../components/navbar/Navbar';
import './PostsPage.scss';
import Profile from '../../components/user/profile';
import { db } from '../../firebase'; // Import your Firebase db
import { AuthContext } from '../../context/AuthContext';
import { collection, getDocs, where } from 'firebase/firestore';


const PostsPage = () => {
  const { currentUser } = useContext(AuthContext);
  const { category } = useParams(); // Get the category parameter from the route

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const postsRef = db.collection('posts');

    const fetchData = async () => {
      try {
        const querySnapshot = await postsRef.where('category', '==', category).get();
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
  }, [currentUser, category]); // Include category as a dependency

  return (
      <>
        <div className='posts-container'>
          {posts.map((post) => (
            <div key={post.id} className='post-card'>
              <div className='post-title-wrapper'>
                <span className='post-title-text'>{post.title}</span>
              </div>
              <div className='post-price-wrapper'>
                <span className='post-price-text'>Price: {post.price}</span>
              </div>
              <img className='post-img' src={post.imageURL} alt={`Post: ${post.title}`} />
            </div>
          ))}
        </div>
        <Link
          to='/categories'
          className='back-link'
        >
          Back to Categories
        </Link>
        </>
  );
};

export default PostsPage;
