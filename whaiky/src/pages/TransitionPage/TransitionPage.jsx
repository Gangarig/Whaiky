import React, { useContext, useState } from 'react'
import './TransitionPage.scss'
import { AuthContext } from '../../context/AuthContext'
import img4 from '../../assets/img/ad/img4.png'
import img5 from '../../assets/img/ad/img5.png'
import { useNavigate } from 'react-router-dom'


const TransitionPage = () => {
  const { currentUser, userData } = useContext(AuthContext);
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();
  const handleSelect = (selectedUserType) => {
    setUserType(selectedUserType);
    navigate('/home');
  };

  return (
    <div className='transition-page'>
      <div className='transition-wrapper'>
        <div className='content-box'>
          <span className='transition-title'>Whaiky</span>
          <div className='img-box' onClick={() => handleSelect('customer')}>
            <img src={img4} alt="customer example" />
            <span className='text-wrapper-1'>Looking for service</span>
          </div>
          <div className='vr-line'></div>
          <div className='img-box' onClick={() => handleSelect('contractor')}>
            <img src={img5} alt="coworker" />
            <span className='text-wrapper-2'>Work with us</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransitionPage;
