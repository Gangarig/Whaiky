import React from 'react'
import Navbar from '../components/Navbar'
import Search from '../components/Search'
import Chat from '../components/Chat'
import Sidebar from '../components/Sidebar'


const ChatInterface = () => {
  return (
    <div className='home'>
      <div className="container">
        <Sidebar/>
        <Chat/>
      </div>
    </div>
  )
}

export default ChatInterface
