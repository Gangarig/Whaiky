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
    <div className='page-container'>
      <div className='page-wrapper'>
      <Profile className="profile"/>
      <Navbar  className="navbar"/>
      <div className='search-post-wrapper'>
        <input type="text" placeholder='Search' className='search-post' />
      </div>
        <div className="post-grid-container">
          <div className='post-grid-wrapper'>
            <div className='post-grid'>
              <Posts/>
            </div>
          </div>
      </div>
      </div>
    </div>
  )
}

export default Home
