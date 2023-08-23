import React, { useState } from "react";
import Add from "../../assets/img/add.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import PasswordChecklist from "react-password-checklist";

const Register = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const file = e.target[4].files[0];

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // Create an image name using the displayName
      const imageName = `${displayName}_${file.name}`;
      const storageRef = ref(storage, `profile_images/${imageName}`);
      
      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              createdAt: new Date().getTime(),
              photoURL: downloadURL,
            });
            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/");
          } catch (err) {
            console.log(err);
            setErr(true);
            setLoading(false);
          }
        });
      });
    } catch (err) {
      setErr(true);
      setLoading(false);
    }
  
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">LOGO</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input required type="text" placeholder="display name" />
          <input required type="email" placeholder="email" />
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>Password Again:</label>
          <input
            type="password"
            value={passwordAgain}
            onChange={(e) => setPasswordAgain(e.target.value)}
          />
          <PasswordChecklist
            rules={["minLength", "specialChar", "number", "capital", "match"]}
            minLength={5}
            value={password}
            valueAgain={passwordAgain}
            onChange={(isValid) => {}}
          />
          <input required style={{ display: "none" }} type="file" id="file" />
          <label htmlFor="file">
            <img src={Add} alt="" />
            <span>Add an avatar</span>
          </label>
          <button disabled={loading}>Sign up</button>
          {loading && "Uploading and compressing the image please wait..."}
          {err && <span>Something went wrong</span>}
        </form>
        <p>
          You do have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
