import React from 'react'
import Navbar from '../components/Navbar'
import Posts from '../components/post/Posts'
import Profile from '../components/user/profile';

import '../style.scss';




const Home = () => {
  return (
    <div className='homePage'>
    {/* <Navbar/> */}
    <Profile/>
    <Posts/>
    </div>
  )
}

export default Home
