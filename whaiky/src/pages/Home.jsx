import React from 'react'
import Navbar from '../components/Navbar'
import Search from '../components/Search'
 const Home = () => {
  return (
    <div className='homeContainer'>
      <div className='navWrapper'>
      <Search/>
      <Navbar />
      </div>
    </div>
  )
}

export default Home
