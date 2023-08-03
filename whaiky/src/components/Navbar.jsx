import React, { useContext } from 'react'
import {signOut} from "firebase/auth"
import { auth } from '../firebase'
import { AuthContext } from '../context/AuthContext'
import { useNavigate , Link} from 'react-router-dom'


const Navbar = () => {
  const {currentUser} = useContext(AuthContext)
  const navigate = useNavigate();
  return (
    <nav className='navbar'>
      <div className='navWrapper'>
        <div className="logo">LOGO</div>
        <ul className='navItems'>
          <li onClick={() => navigate('/')} className='navItem'>HOME</li>
          <li className='navItem' onClick={() => navigate('/categories')}>CATAGORIES</li>
          <li onClick={() => navigate('/addpost')} className='navItem'>ADD POST</li>
          <li  onClick={() => navigate('/chat')} className='navItem'>MESSAGES</li>
          <li onClick={() => navigate('/profile')} className='navItem'>MY PROFILE</li>
          <li onClick={() => navigate('/wallet')} className='navItem'>Wallet</li>
          <li onClick={() => navigate('/marklist')} className='navItem'>Marklist</li>
          <li onClick={() => navigate('/settings')} className='navItem'>Settings</li>
        </ul>
        <div className='navFooter'> 
          <div className='navFooterBox'>
              <span className='navFooterSupport'>Support</span>
              <button className='logOut' onClick={()=>signOut(auth)}>Log out</button>
          </div>
          <div className='navFooterItem'>Become a contractor</div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar