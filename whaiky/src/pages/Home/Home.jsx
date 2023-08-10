import React from 'react'
import Navbar from '../../components/navbar/Navbar'
import Profile from '../../components/user/profile';
import Posts from '../../components/post/Posts';
import AddPost from '../../components/post/AddPost';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';
import './Home.scss';




const Home = () => {
  const {currentUser} = useContext(AuthContext)
  return (
    <>
    <Navbar />
    <Profile/>
      <div className='home-container'>
        <div className='home-wrapper'>
          <Posts/>
        </div>
      </div>
    </>
  )
}

export default Home
