import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './profile.scss';
import { useNavigate } from 'react-router-dom';
const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  // Render the profile only if there's a user
  if (!currentUser) {
    return null; // or return some placeholder content if desired
  }
  const handleClick = () => {
    navigate('/profile');
  };
  return (
    <div className='userWrapper' onClick={handleClick}>
      <div className="user">
        <img className='userAvatar' src={currentUser.photoURL} alt="userAvatar" />
        <span className='userName'>{currentUser.displayName}</span>
      </div>
    </div>
  );
}

export default Profile;
