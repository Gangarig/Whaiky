import React, { useContext , useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'

const Messages = () => {
    const [messages , setMessages] = useState([]);  
    const data = useContext(ChatContext);

  return (
    <div></div>
  )
}

export default Messages