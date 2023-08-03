import React from 'react'
import Navbar from '../components/Navbar'
import Profile from '../components/user/profile';
import Posts from '../components/post/Posts';
import AddPost from '../components/post/AddPost';

import '../style.scss';




const Home = () => {
  return (
    <div className='homePage'>
      <Navbar/>
      <Profile/>
      <Posts/>
    </div>
  )
}

export default Home
