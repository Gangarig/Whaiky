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
          <li className='navItem'>
            HOME
          </li>
          <li className='navItem'>CATAGORIES</li>
          <li className='navItem'><Link to='/addpost'> ADD POST</Link></li>
          <li className='navItem'><Link to='/posts'> POST</Link></li>
          <li  className='navItem'>MESSAGES</li>
          <li className='navItem'>MY PROFILE</li>
          <li className='navItem'>Wallet</li>
          <li className='navItem'>Marklist</li>
          <li className='navItem'>Settings</li>
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