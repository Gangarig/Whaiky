import React from 'react'
import Sidebar from '../../components/sidebar/Sidebar'
import Chat from '../../components/chat/Chat'
import './ChatInterFace.scss';

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
