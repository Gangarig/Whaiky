import React , { useContext }from 'react'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'

const Chat = () => {
    const {data} = useContext(ChatContext);
    
  return (
    <div className='chat'>
        <div className='chatInfo'>
            <span>{data.user.displayName}</span>
            <div className='chatIcons'>
                <img src="" alt=""/>
                <img src="" alt=""/>
                <img src="" alt=""/>
            </div>
        </div>
    </div>
  )
}

export default Chat