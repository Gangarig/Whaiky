import React, { useContext } from 'react'
import {signOut} from "firebase/auth"
import { auth } from '../firebase'
import { AuthContext } from '../context/AuthContext'


const Navbar = () => {
  const {currentUser} = useContext(AuthContext)

  return (
    <nav className='navbar'>
      <div className='navWrapper'>
        <div className="logo">LOGO</div>
        <ul className='navItems'>
          <li className='navItem'>Home</li>
          <li className='navItem'>CATAGORIES</li>
          <li className='navItem'>ADD POST</li>
          <li className='navItem'>MESSAGES</li>
          <li className='navItem'>MY PROFILE</li>
          <li className='navItem'>Wallet</li>
          <li className='navItem'>Marklist</li>
          <li className='navItem'>Settings</li>
        </ul>
        <div className='navFooter'> 
          <div className='navFooterBox'>
          <span className='navFooterItem'>Support</span>
          <button className='navFooterItem logOut' onClick={()=>signOut(auth)}>Log out</button>
          </div>
          <span className='navFooterItem'>Become a contractor</span>
        </div>
      </div>
    </nav>
  )
}

export default Navbar