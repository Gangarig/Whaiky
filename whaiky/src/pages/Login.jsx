import React, { useState } from 'react'
import { useNavigate , Link  } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';
import { toast } from 'react-toastify';

const Login = () => {
  const [err,setErr ] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    try {
     await signInWithEmailAndPassword(auth, email, password);
     toast.success('Logged in successfully');
     navigate('/');
    } catch (err) {
      console.error("Error:", err.message);
      toast.error(err.message);
    }

  };

  return (
    <div className='formContainer'>
      <div className='formWrapper'>
        <form className='registerForm' onSubmit={handleSubmit}>  
          <label htmlFor="email">Email</label>
          <input type="email" name="email" />
          <label htmlFor="password">Password</label>
          <input type="password" name="password" />
          <button type="submit">
            Log in
          </button>
          <p>If you dont have an account <Link to="/register">Register</Link></p>
        </form>
      </div>
    </div>
  )
}
 
export default Login
