import React from 'react'
import Navbar from '../../components/navbar/Navbar'
import './CategoriesPage.scss'
import Profile from '../../components/user/profile';

const CategoriesPage = () => {
  return (
    <div className='page-container'>
      <div className='page-wrapper'>
      <Profile className="profile"/>
      <Navbar  className="navbar"/>
      <div className="post-flex-container">
      </div>
      </div>
    </div>
  )
}

export default CategoriesPage