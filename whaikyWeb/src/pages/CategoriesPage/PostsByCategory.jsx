import React, { useContext, useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { db } from '../../firebase'; 
import { AuthContext } from '../../context/AuthContext';  
import { collection, getDocs } from 'firebase/firestore';
import './CategoriesPage.scss';  

const PostsByCategory = () => {
  const { currentUser } = useContext(AuthContext);
  const { optionId } = useParams(); 
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const fetchData = async () => {
        const postsRef = collection(db, 'posts');
        try {
            const querySnapshot = await getDocs(postsRef);
        
            const fetchedPosts = [];
            querySnapshot.forEach((doc) => {
              const post = { id: doc.id, ...doc.data() };
              fetchedPosts.push(post);
            });

            // Convert optionId to the appropriate datatype (Number in this case)
            const filteredPosts = fetchedPosts.filter(post => post.categoryId === Number(optionId));
            
            setPosts(filteredPosts);
            console.log(filteredPosts); // Log here to see the filtered data
          } catch (error) {
            console.error('Error fetching posts:', error);
          }
    };

    fetchData();  // Call the async function here
}, [currentUser, optionId]);

  return (
      <>
     
        <div className='posts-container'>
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className='post-card'>
                <div className='post-title-wrapper'>
                  <span className='post-title-text'>{post.title}</span>
                </div>
                <div className='post-price-wrapper'>
                  <span className='post-price-text'>Price: {post.price}</span>
                </div>
                <img className='post-img' src={post.imageURL} alt={`Post: ${post.title}`} />
              </div>
            ))
          ) : (
            <div className="no-posts-message">No posts available for this category.</div>
          )}
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

export default PostsByCategory;
