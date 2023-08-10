import React, { useState , useEffect } from 'react'
import { useNavigate , Link  } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../firebase';
import { toast } from 'react-toastify';
import whaikyLogo from '../../assets/img/whaikyLogo.png';
import { motion } from 'framer-motion';
import img1 from '../../assets/img/ad/img1.png';
import img2 from '../../assets/img/ad/img2.png';
import img3 from '../../assets/img/ad/img3.png';
import './Login.scss';

const Login = () => {
  const [err,setErr ] = useState(false);
  const navigate = useNavigate();
  const [contentIndex, setContentIndex] = useState(0);
  const contents = [
    (
      <div className='logo-box'>
        <span>Welcome</span>
        <span>to</span>
        <img src={whaikyLogo} alt="whaiky Logo" />
        <span>Whaiky</span>
      </div>
    ),
    (
      <div className='logo-box'>
        <figure className='ad-figure'>
          <img src={img1} alt="img1" className='ad-img'/>
          <figcaption className='fig-caption'>
            Whaiky
          </figcaption>
          <p className='img-text'>
            Find the service you are looking for at the  best prices, fast easy and without leaving home with the security of Whaiky
          </p>
        </figure>
      </div>
    ),(
      <div className='logo-box'>
        <figure className='ad-figure'>
          <img src={img2} alt="img2" className='ad-img'/>
          <figcaption className='fig-caption'>
            Whaiky
          </figcaption>
          <p className='img-text'>
          Get the most out of your service and offer it on whaiky,
          where every one can find you more easily.
          </p>
        </figure>
      </div>
    ),(
      <div className='logo-box'>
        <figure className='ad-figure'>
          <img src={img3} alt="img2" className='ad-img'/>
          <figcaption className='fig-caption'>
            Whaiky
          </figcaption>
          <p className='img-text'>
          Start enjoying
          <br />
          the adventure
          </p>
        </figure>
      </div>
    )
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setContentIndex((prevIndex) => (prevIndex + 1) % contents.length);
    }, 5000); // Change content every 5 seconds

    return () => {
      clearInterval(interval);
    };
  }, [contents.length]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    try {
     await signInWithEmailAndPassword(auth, email, password);
     toast.success('Logged in successfully');
     navigate('/transition');
    } catch (err) {
      toast.error(err.message);
    }

  };
  useEffect(() => {
    const handleWindowResize = () => {
      const loginForm = document.getElementById('viewAdjust');
      if (loginForm) {
        loginForm.style.height = 700 > window.innerHeight ? 'auto' : '564px';
      }
    };
    window.addEventListener('resize', handleWindowResize);
    handleWindowResize();
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return (
    <div className="form-Container">
      <div className="form-Wrapper">
          {/* Logo Box  */}
          <motion.div
          id='motionBox'
          className='sub-Wrapper ad-content box' 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.5,
            ease: [0, 0.71, 0.2, 1.01]
          }}>
          {contents[contentIndex]}
          </motion.div>
          {/* Vertical Line */}
          <div className='vertical-Line'></div>
          {/* Login Form */}
          <div className=' sub-Wrapper'>
            <div className='login-Form' id='viewAdjust'>
                <form onSubmit={handleSubmit}>
                  <div className='form-subContainer'>
                    <span className="title">LOGIN</span>
                  </div>
                  <div className='form-subContainer'>
                    <label className='login-label' htmlFor="email">Email address</label>
                    <input className='login-input' type="email" placeholder="Type your Email" />
                    <label className='login-label' htmlFor="password">Password</label>
                    <input className='login-input' type="password" placeholder="Type your password" />
                    <span className='forgot-password-link'>FORGOT PASSOWRD</span>
                  </div>
                  <div className='login-form-buttons form-subContainer'>
                      <button className='continue-button btn'>CONTINUE</button>
                      <span className='or'>or</span>
                      <p><Link  className='sign-up' to="/register">SIGN UP</Link></p>
                  </div>
                </form>
            </div>
          </div>
      </div>
    </div>
  )
}
 
export default Login
