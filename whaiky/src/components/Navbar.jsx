import { signOut } from 'firebase/auth'
import React from 'react'
import { auth } from '../firebase'

const Navbar = () => {
  return (
    <div><button onClick={()=>signOut(auth)}>Log Out</button></div>
  )
}

export default Navbar