import React, {useContext} from 'react'
import { AuthContext } from '../../context/AuthContext'

const Profile = () => {
  const {currentUser} = useContext(AuthContext)
  return (
    <div className='userWrapper'>
        <div className="user">
          <img className='userAvatar' src={currentUser.photoURL} alt="userAvatar" />
          <span className='userName'>{currentUser.displayName}</span>
        </div>
    </div>
  )
}

export default Profile