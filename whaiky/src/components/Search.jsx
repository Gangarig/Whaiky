import React, { useState } from 'react'
import { db } from '../firebase';
import { collection, doc, query, setDoc } from "firebase/firestore"; 


const Search = () => {
    const [username , setUsername] = useState('');
    const [user , setUser] = useState(null);
    const [error , setError] = useState(false);

    const handleSearch = async () => {
        const q = query(collection(db, "users"), 
        where("displayName", "==", username));
        try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            setDoc(doc.data());  
        });
    } catch (error) {
        setError(true);
        console.log(error);
    }

    };


    const handleKey = async (e) => {
        e.code === 'Enter' &&  handleSearch();
    };


  return (
    <div className='search'>
        <div className='searchForm'>
            <input type="text" name="search" placeholder='Find a User' 
                onKeyDown={handleKey}
                onChange={(e) => setUsername(e.target.value)}
            />
        </div>
        {error && <span>User not Found !</span>}
        {user && <div className='userChat'>
            <img src={user.photoURL}
             alt="" />
             <div className='userChatInfo'>
                 <span>{user.displayName}</span>
             </div>
        </div>}
    </div>
  )
}
export default Search;
