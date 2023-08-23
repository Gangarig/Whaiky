import React, { useContext } from 'react'
import {signOut} from "firebase/auth"
import { auth } from '../../firebase'
import { AuthContext } from '../../context/AuthContext'
import { useNavigate , Link} from 'react-router-dom'
import add from '../../assets/svg/add.svg'
import category from '../../assets/svg/category.svg'
import house from '../../assets/svg/house.svg'
import message from '../../assets/svg/message.svg'
import profile from '../../assets/svg/profile.svg'
import settings from '../../assets/svg/settings.svg'
import owner from '../../assets/svg/owner.svg'
import wallet from '../../assets/svg/wallet.svg'




import './navbar.scss'


const Navbar = () => {
  const {currentUser} = useContext(AuthContext)
  const navigate = useNavigate();
  const handleLogoClick = () => {
    navigate('/home');
  };
  const handleLogout = async () => {
    try {
      // Sign out the user
      await signOut(auth);

      // Navigate to the login page after successful sign out
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  return (

    <nav className='navbar '>
      <div className='navWrapper'>
        <div onClick={handleLogoClick} className="logo">Whaiky</div>
        <ul className='navItems'>
          <li 
          className='navItem'
          onClick={() => navigate('/home')}>
          <img className='svg' src={house} alt="house.svg" />
          HOME
          </li>
          <li 
          className='navItem'
          onClick={() => navigate('/categories')}>
          <img className='svg' src={category} alt="category.svg" />
          CATAGORIES
          </li>
          <li 
          onClick={() => navigate('/addpost')} 
          className='navItem'>
          <img className='svg' src={add} alt="add.svg" />
          ADD POST
          </li>
          <li 
          onClick={() => navigate('/chat')} 
          className='navItem'>
          <img className='svg' src={message} alt="message.svg" />
          MESSAGES
          </li>
          <li 
          onClick={() => navigate('/profile')} 
          className='navItem'>
          <img className='svg' src={profile} alt="profile.svg" />
          MY PROFILE
          </li>
          <li 
          onClick={() => navigate('/wallet')} 
          className='navItem'>
          <img className='svg' src={wallet} alt="wallet.svg" />
          Wallet
          </li>
          <li 
          onClick={() => navigate('/marklist')} 
          className='navItem'>
          <img className='svg' src={owner} alt="owner.svg" />
          Marklist
          </li>
          <li 
          onClick={() => navigate('/settings')} 
          className='navItem'>
          <img className='svg' src={settings} alt="settings.svg" />
          Settings
          </li>
        </ul>
        <div className='navFooter'> 
          <div className='navFooterBox'>
              <span className='navFooterSupport'>Support</span>
              <button className='logOut' onClick={handleLogout}>Log out</button>
          </div>
          <div className='navFooterItem'>Become a contractor</div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar