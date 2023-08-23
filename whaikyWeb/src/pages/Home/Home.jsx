import React from 'react'
import Navbar from '../../components/navbar/Navbar'
import Profile from '../../components/user/profile';
import Posts from '../../components/post/Posts';
import AddPost from '../../components/post/AddPost';
import Search from '../../components/search/Search';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';
import './Home.scss';




const Home = () => {
  const {currentUser} = useContext(AuthContext)
  return (
            <div className='post-flexbox'>
              <Posts/>
            </div>
  )
}

export default Home
