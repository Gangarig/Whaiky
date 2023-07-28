import React from 'react'
import Navbar from '../components/Navbar'
import Search from '../components/Search'
import Chats from '../components/Chats'
 const Home = () => {
  return (
    <div className='homeContainer'>
      <div className='navWrapper'>
      <Navbar />
      <Search/>
      <Chats/>
      </div>
    </div>
  )
}

export default Home
