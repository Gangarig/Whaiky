import { signOut } from 'firebase/auth'
import React , { useContext } from 'react'
import { auth } from '../firebase'
import { AuthContext } from '../context/AuthContext'

const Navbar = () => {
  const {currentUser} = useContext(AuthContext);
  return (
    <div>
      <img className='profileImg' src={currentUser.photoURL} alt=""/>
      <span className='userName'>{currentUser.displayName}</span>
      <button onClick={()=>signOut(auth)}>Log Out</button>
    </div>
  )
}

export default Navbar