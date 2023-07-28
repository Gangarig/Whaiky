import React, { useContext, useState } from 'react';
import { db } from '../firebase';
import { 
    collection, 
    query, 
    where, 
    getDoc, 
    getDocs,
    setDoc, 
    updateDoc, 
    serverTimestamp, 
    doc } from 'firebase/firestore';
import {AuthContext} from '../context/AuthContext';


const Search = () => {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);
  const {currentUser} = useContext(AuthContext);


  const handleSearch = async () => {
    const q = query(collection(db, 'users'), where('displayName', '==', username));
    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        // If the query returns any documents, we set the first matching document to the user state
        const firstUser = querySnapshot.docs[0];
        setUser(firstUser.data());
        setError(false); // Reset the error state if a user is found
      } else {
        // If no matching user found, set the user state to null and show the error message
        setUser(null);
        setError(true);
      }
    } catch (error) {
      setError(true);
      console.log(error);
    }
  };

  const handleKey = (e) => {
    // Check if the Enter key is pressed and trigger the search
    if (e.code === 'Enter') {
      handleSearch();
    }
  };

  const handleSelect = async () => { 
    // check wether the group already(chats in firestore) exists, if not, create it.
    const combineId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
    const res = await getDoc(doc(db , "chats",combineId));
    try {
        if(!res.exists()) {
            await setDoc(doc(db, "chats", combineId), { messaeges: [] });
        }

        await updateDoc(doc(db,"userChats", currentUser.uid), {
            [combineId+".userInfo"]: {
                uid: user.uid,
                displayName: user.displayName,
                photoURL: user.photoURL
            },[combineId+".date"]: serverTimestamp() 
        });

        await updateDoc(doc(db,"userChats", user.uid), {
            [combineId+".userInfo"]: {
                uid: currentUser.uid,
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL
            },[combineId+".date"]: serverTimestamp() 
        });

    } catch {err}
    setUser(null);
    setUsername('');

    };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          name="search"
          placeholder="Find a User"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {error && <span>User not Found!</span>}
      {user && (
        <div className="userChat" onClick={handleSelect}>
          <img className='avatarImg' src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );

}

export default Search;
