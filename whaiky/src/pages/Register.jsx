
import React, { useState } from 'react'
import Add from '../assets/icons/Add.png'
import { createUserWithEmailAndPassword , updateProfile } from "firebase/auth";
import { auth , storage , db}  from '../firebase'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 


export const Register = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [err,setErr ] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsRegistering(true); 
    
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    // creating an account 
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password)
      const storageRef = ref(storage, displayName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        (error) => {
         setErr(true);
        }, 
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          await updateProfile (res.user,{
            displayName,
            photoURL:downloadURL,
          });
          // adding to firestore db a collection
          await setDoc (doc(db, "users",res.user.uid),{
            uid: res.user.uid,
            displayName,
            email,
            photoURL:downloadURL,
          });
        });
        }
      );
    } catch (err) {
      console.error("Error creating account:", err.message);
      setErr(err.message);
    }finally {
      setIsRegistering(false); // Set the state to false when registration completes or encounters an error
    }
    

  };

  return (
    <div className='formContainer'>
      <div className='formWrapper'>
        <form className='registerForm' onSubmit={handleSubmit}>  
          <label htmlFor="displayName">User Name</label>
          <input type="text" name="displayName" />
          <label htmlFor="email">Email</label>
          <input type="email" name="email" />
          <label htmlFor="password">Password</label>
          <input type="password" name="password" />
          <input className='profileImg' type="file" id="file" />
          <label className='avatar'  htmlFor="file"> 
            <img className='avatarUpload' src={Add} alt="" />
            <span>Add an avatar</span>
          </label>
          <button type="submit" disabled={isRegistering}>
          {isRegistering ? "Signing up..." : "Sign up"}
          </button>
        </form>
      </div>
    </div>
  )
}
