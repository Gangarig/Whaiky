import React, { useEffect, useState, useContext } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';


const Chats = () => {
  const [chats, setChats] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext); 

  useEffect(() => {
    const getChats = async () => {
      if (!currentUser?.uid) {
        return; // Ensure currentUser.uid exists before proceeding
      }

      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        // Make sure doc exists and has the "chats" property before setting the state
        if (doc.exists() && doc.data().chats) {
          setChats(doc.data().chats);
        }
      });

      return () => {
        unsub();
      };
    };

    getChats();
  }, [currentUser]);
  const handleSelect = (user) => {
    dispatch({CHANGE_USER , payload : user})
  }

  return (
    <div>
      <h1>Chats</h1>
      {Object.entries(chats)?.map((chat) => (
        <div className='userChat' key={chat[0]} onClick={() => handleSelect(chat[1].userInfo)} >
          {/* Safely access properties using optional chaining */}
          <img src={chat[1]?.userInfo?.photoURL} alt=""/>
          <div>
            <span>{chat[1]?.userInfo?.displayName}</span>
            <p>{chat[1]?.userInfo?.lastmessage?.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chats;
