import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc,getDocs, where, query, collection, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import './PostDetail.scss';
import star from '../../assets/svg/star.svg';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { serverTimestamp } from 'firebase/firestore';

const PostDetail = () => {
  const { currentUser } = useContext(AuthContext);
  const { postId } = useParams();
  const [postDetails, setPostDetails] = useState(null);
  const [err, setErr] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const navigate = useNavigate();

  const createConnection = async (post) => {
    if (!post) {
        console.error('Post is not provided for creating a connection.');
        return;
    }

    const q = query(collection(db, 'users'), where('uid', '==', post.ownerId));
    try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const user = doc.data();
            handleSelect(user);
        });
    } catch (err) {
        setErr(true);
        console.log(err);
    }
  };

  const handleSelect = async (user) => {
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, 'chats', combinedId));
      if (!res.exists()) {
        await setDoc(doc(db, 'chats', combinedId), { messages: [] });
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
    } catch (err) {
      console.error(err);
    }
    navigate('/chat');
  };

  const handleDelete = async () => {
    // Confirm with the user before deleting the post
    const confirmation = window.confirm("Are you sure you want to delete this post?");
    if (!confirmation) return;

    try {
        await deleteDoc(doc(db, 'posts', postId));
        alert('Post deleted successfully!');
        navigate('/'); // navigate to the home or another relevant page after deletion
    } catch (error) {
        console.error("Error deleting the post: ", error);
        alert('Failed to delete the post. Please try again.');
    }
  };


  useEffect(() => {
    const fetchPostDetails = async () => {
      const postDoc = await getDoc(doc(db, 'posts', postId));
      if (postDoc.exists()) {
        setPostDetails(postDoc.data());
      }
    };
    fetchPostDetails();
  }, [postId]);

return postDetails ? (
  <>
    <div className='post-detail-container'>
      <div className="post-detail-content">
          <img className='post-detail-image' src={postDetails.imageURL} alt="" />
          <div className='post-detail-title-wrapper'>
            <div className="post-detail-title-subwrapper">
              <span className='post-detail-title'>{postDetails.title}</span>
              <div className="post-title-info">
                <span className='post-detail-date'>{postDetails.date}</span>
                <span className='post-detail-location'>{postDetails.location}</span>
              </div>
            </div> 
            <div className="post-detail-price-wrapper">
              <span className='post-detail-sale-price'>{postDetails.salePrice}</span>
              <span className='post-detail-price'>.{postDetails.price}$</span>
            </div>
          </div>
          <div className="post-detail-description">
            <span>{postDetails.description}</span>
          </div>
      </div>
      <div className="post-detail-owner">
            <div className="post-marker">
              <img src={star} alt="star.svg" />
              <span>Mark it!</span>
            </div>
            <div className="post-owner">
                <img className='post-owner-avatar' src={postDetails.ownerAvatar} alt="poster-avatar" />
                <div className='post-owner-info'>
                  <span className='post-owner-name'>{postDetails.ownerName}  </span>
                  <span className='post-owner-testimonial'>Lorem Ipsum </span>
                  {/* svg star rating */}
                  <svg width="99" height="15" viewBox="0 0 99 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 0L9.18386 5.18237H14.6329L10.2245 8.38525L11.9084 13.5676L7.5 10.3647L3.09161 13.5676L4.77547 8.38525L0.367076 5.18237H5.81614L7.5 0Z" fill="#EDC023"/>
                  <path d="M28.5 0L30.1839 5.18237H35.6329L31.2245 8.38525L32.9084 13.5676L28.5 10.3647L24.0916 13.5676L25.7755 8.38525L21.3671 5.18237H26.8161L28.5 0Z" fill="#EDC023"/>
                  <path d="M49.5 0L51.1839 5.18237H56.6329L52.2245 8.38525L53.9084 13.5676L49.5 10.3647L45.0916 13.5676L46.7755 8.38525L42.3671 5.18237H47.8161L49.5 0Z" fill="#EDC023"/>
                  <path d="M70.5 0L72.1839 5.18237H77.6329L73.2245 8.38525L74.9084 13.5676L70.5 10.3647L66.0916 13.5676L67.7755 8.38525L63.3671 5.18237H68.8161L70.5 0Z" fill="#D9D9D9"/>
                  <path d="M91.5 0L93.1839 5.18237H98.6329L94.2245 8.38525L95.9084 13.5676L91.5 10.3647L87.0916 13.5676L88.7755 8.38525L84.3671 5.18237H89.8161L91.5 0Z" fill="#D9D9D9"/>
                </svg>
                  <span className='post-owner-social-link'>See my Social profile</span>
                </div>
            </div>
              <div className="post-detail-buttons">
              {currentUser.uid === postDetails.ownerId && 
                  <button onClick={handleDelete} className='custom-button'>Delete Post</button>
                }
                <button onClick={() => createConnection(postDetails)} className='custom-button'>Send a message</button>
                <button className='custom-button'>BOOK NOW</button>
              </div> 
        </div>  
  </div>
  </>
) : (
  <div>Loading...</div>
);
};

export default PostDetail;



