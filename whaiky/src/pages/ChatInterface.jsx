import React from 'react'
import Sidebar from '../components/Sidebar'
import Chat from '../components/chat/Chat'

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
